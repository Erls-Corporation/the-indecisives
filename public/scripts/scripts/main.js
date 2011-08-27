(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  window.onload = function() {
    var background, helper, orbit, planet, player, players, socket;
    helper = new Canvas(document.getElementById('game-canvas'));
    background = new Background();
    planet = new Planet();
    orbit = new Orbit(200);
    window.players = players = new PlayersCollection();
    window.player = player = new PlayerModel();
    helper.draw(function() {
      players.update();
      background.draw(this);
      planet.draw(this);
      orbit.draw(this);
      return players.draw(this);
    });
    window.socket = socket = io.connect();
    socket.socket.on('error', function(reason) {
      return console.error('unable to connect socket.io', reason);
    });
    socket.on('players:update', function(players_data) {
      return _.each(players_data, function(player_data) {
        if (player_data.id === socket.socket.sessionid) {
          player_data.self = true;
        }
        player = players.get(player_data.id);
        if (!player) {
          player = new PlayerModel(player_data);
          if (player_data.self) {
            window.current_player = player;
          }
          player.players = players;
          players.add(player);
          return;
        }
        player.clear();
        player.set(player_data);
        if (!player_data.self) {
          ;
        }
      });
    });
    socket.on('player:disconnect', function(player_data) {
      player = players.get('player_data.id');
      return players.remove(player);
    });
    socket.on('connect', function() {
      console.log("connected");
      socket.on('error', function(err) {
        return console.error(err);
      });
      window.addEventListener('keypress', __bind(function(event) {
        switch (event.keyCode) {
          case 100:
          case 68:
            socket.emit('player:update', 'UP');
            if (current_player.get('state') === 'alive') {
              return current_player.aim_left();
            }
            break;
          case 97:
          case 65:
            socket.emit('player:update', 'DOWN');
            if (current_player.get('state') === 'alive') {
              return current_player.aim_right();
            }
        }
      }, this), false);
      return window.addEventListener('keyup', __bind(function(event) {
        switch (event.keyCode) {
          case 83:
            socket.emit('player:update', 'LEFT');
            if (current_player.get('state') === 'alive') {
              return current_player.move_left();
            }
            break;
          case 87:
            socket.emit('player:update', 'RIGHT');
            if (current_player.get('state') === 'alive') {
              return current_player.move_right();
            }
        }
      }, this), false);
    });
    return socket.on('disconnect', function() {
      return console.error('disconnected');
    });
  };
}).call(this);