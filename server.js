const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const moment = require('moment');
const { Server } = require("socket.io");
const io = new Server(server, {cors: {origin: "*"}});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/chat=:ID', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// function processes an array of clients to create a list of their names
function getUsers(io, socket) {
  var list = io.sockets.adapter.rooms.get(socket.room);
  var users = [];
  if (list) {
    for (let user of list) {
      var data = io.of('/').sockets.get(user);
      users.push(data.username);
    }
  }
  return users;
}

io.on('connection', (socket) => {
  // If user was invited, he connect to room with his inviter, else he connect to his room.
  const invite = socket.handshake.query.url;
  if (invite) {
    socket.join(invite);
    socket.room = invite;
  } else {
    socket.room = socket.id;
  }
  socket.emit("inviteURL", socket.room);

  // When user enter name, all users in room get new list of users of room.
  socket.on('username', (username) => {
    socket.username = username;
    users = getUsers(io, socket);
    io.to(socket.room).emit("users", users);
  })

  // Received message emit to other users in room
  socket.on('message', (data) => {
    io.to(socket.room).emit("message", {user: data.user, text: data.text, time: moment().format("HH:mm MMM Do")});
  })

  socket.on('disconnect', () => {
    users = getUsers(io, socket);
    io.to(socket.room).emit("users", users);
  });
});

server.listen(5000, () => {
  console.log('Server listening on *:5000');
});

app.use(express.static(path.join(__dirname, 'js')));
app.use(express.static(path.join(__dirname, 'css')));
