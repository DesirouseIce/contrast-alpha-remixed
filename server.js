console.log('server is starting...');

let players = [];
let playersPos = [];
// let disPlayers = [];

const express = require('express');

const app = express();
const server = app.listen(process.env.PORT || 8123);

app.use(express.static('public'));

const socket = require('socket.io');
const io = socket(server);

setInterval(function(){
  console.log('server is rebooting...');
  //io.disconnectSockets();
  players = [];
  playersPos = [];
  console.log('server has rebooted');
}, 86400000);

console.log('server is running');

io.sockets.on('connection', newConnection);

function newConnection(socket){
  players.push(socket.id);
  playersPos.push(0, 0, 0);
  console.log(players);

//   var startTime = 0;
  socket.on('pingg', function(){
    socket.emit('pongg');
  });
//     startTime = Date.now();
//   });
//   if ((Date.now() - startTime) > 3000){
//     for (i = 0; i < players; i++){
//       if (players[i] == socket.id){
//         players.splice(i, 1)
  
  socket.on('disconnect', function(){
    for (i = 0; i < players.length; i++){
      if (players[i] == socket.id){
        players.splice(i, 1);
        playersPos.splice(i * 3, 3);
        console.log(socket.id + ' disconnected');
        console.log(players);
      }
    }
  });
  
  socket.on('hitPlayer', function(hitPlayer){
    io.to(hitPlayer).emit('hit');
  });

  socket.on('sendPos', updatePos);

  function updatePos(myPos) {
    for (let i = 0; i < players.length; i++){
      if(players[i] == socket.id){
        playersPos[i * 3] = myPos.x;
        playersPos[(i * 3) + 1] = myPos.y;
        playersPos[(i * 3) + 2] = myPos.heading;
      }
    }
    var data = {
      players: players,
      playersPos: playersPos
    }
    socket.broadcast.emit('receivePos', data);
  }
}
