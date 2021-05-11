const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
// Socket IO
const { Server } = require('socket.io');
const io = new Server(server);


app.get('/join', (req, res) => {
    res.sendFile(__dirname + '/game/join.html');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/game/index.html');
});

app.get('/saludar', (req, res) => {
    res.send('<h1>Hola!</h1>');
});

// Servidor HTTP
server.listen(3000, () => {
    console.log('Servidor web (HTTP) andando y escuchando por http://localhost:3000');
})

// Servidor de Sockets
io.on('connection', (socket) => {
    // console.log("A user is conected");
    // console.log(socket)

    socket.on('join-room', (room) => {
        socket.join(room);
    });
    
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('chat-msg', (msg) => {
        if (msg.room) {
            io.to(msg.room).emit('chat-msg', msg);
        }
        //io.emit('chat-msg', msg);
    });

});
