require("./util/ArraysUtil");

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);


const RoomSocketHandler = require("./handlers/RoomSocketHandler");
const socketMap = new Map();


function handleClient(socket) {
  const roomHSocketHandler = new RoomSocketHandler(socket);
  socketMap.set(socket.id, socket);

  console.log(`New client with id : ${socket.id} !`);

  socket.on("createRoom", (d) => roomHSocketHandler.createRoom(d));
  socket.on("joinRoom", (d) => roomHSocketHandler.joinRoom(d));
  socket.on("quitRoom", (d) => roomHSocketHandler.quitRoom(d));

  socket.on("disconnect", function () {
    socketMap.delete(socket.id);
    //TODO disconect action remove from room ...
  });
}

io.on("connection", (e) => handleClient(e));

http.listen(4433, function(){
  console.log('Server on port :' + 4433);
});

const  socket = require('socket.io-client')('http://localhost:4433');

socket.emit("createRoom", {roomName: "hey", playerName:"Alexis"});
socket.emit("joinRoom", {roomName: "hey", playerName:"Alexis2"});
socket.on('createRoomResponse', function(a){ console.log("Response: " + JSON.stringify(a))});
socket.on('joinRoomResponse', function(a){ console.log("Response: " + JSON.stringify(a))});
socket.on('event', function(data){});
socket.on('disconnect', function(){});

module.exports = socketMap;
