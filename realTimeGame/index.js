const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
// Socket IO
const { Server } = require('socket.io');
const io = new Server(server);
const path = require('path');

const users = {}
const players = {}
/*
{
    username: string,
    room: string,
    position: {x: number, y: number, z: number}
}
*/

app.get('/join', (req, res) => {
    res.sendFile(__dirname + '/public/join.html');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/game', (req, res) => {
    res.sendFile(__dirname + '/public/game.html');
});

app.use('/node_modules', express.static(path.join(__dirname, '..', 'node_modules')));
app.use('/public', express.static(__dirname + '/public'));

// Servidor HTTP
server.listen(3000, () => {
    console.log('Servidor web (HTTP) andando y escuchando por http://localhost:3000');
})

// Servidor de Sockets
io.on('connection', (socket) => {
    // console.log("A user is conected");
    // console.log(socket)

    socket.on('join-game', (data) => {
        socket.join(data.room);
        players[socket.id] = data;
        io.emit('player-joins', { id: socket.id, ...data});
    });

    socket.on('player-moves', (position) => {
        console.log("Player is moving");
    })

    socket.on('join-room', (data) => {
        socket.join(data.room);
        users[socket.id] = data;
    });
    
    socket.on('disconnect', () => {
        try {
            const userData = users[socket.id];
            io.to(userData.room).emit('leave-msg', `${userData.username} ha dejado la sala.`);
        } catch (err) {
            console.log(err.stack ? err.stack : err);
        }
    });

    socket.on('chat-msg', (msg) => {
        if (msg.room) {
            io.to(msg.room).emit('chat-msg', msg);
        }
        //io.emit('chat-msg', msg);
    });

});
