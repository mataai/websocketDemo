var app = require('express')();
var http = require('http').Server(app);
var cors = require('cors')
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var games = [];



app.use(cors())

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {

  socket.on('move', function (move) {
    let game = games[move.gameID];
    game.moves[move.userID].push(move.action);
    if (game.moves[game.players[0]].length == game.moves[game.players[1]].length) {
      move1 = game.moves[game.players[0]][game.moves[game.players[0]].length - 1];
      move2 = game.moves[game.players[1]][game.moves[game.players[1]].length - 1];
      output = {
        p1: move1,
        p2: move2,
        roundnum: game.moves[game.players[0]].length - 1,
        winner: null
      }
      if (move1 == move2) {
        //Tie
        io.emit('roundEnd', output);
        console.log("tie")
      }
      if (move2 == "rock" && move2 == "paper" || move1 == "paper" && move2 == "scisors" || move1 == "scisors" && move2 == "rock") {
        //Player 2 Wins
        output.winner = game.players[1]
        io.emit('roundEnd', output);
        console.log("P2 wins")
      }
      else {
        //Player 1 Wins
        output.winner = game.players[0]
        io.emit('roundEnd', output);
        console.log("P1 wins")
      }
    }

  });


  socket.on('start', function (item) {
    let game = {
      gameID: "1",
      hostID: "1",
      players: ["1", "2"],
      moves: []
    };
    game.moves[game.players[0]] = [];
    game.moves[game.players[1]] = [];
    games[game.gameID] = game;
  });

  socket.on('join', function (item) {

  });



});

let game = {
  gameID: "1",
  hostID: "1",
  players: ["1", "2"],
  moves: []
};
game.moves[game.players[0]] = [];
game.moves[game.players[1]] = [];
games[game.gameID] = game;

http.listen(port, function () {
  console.log('listening on *:' + port);
});
