import { joinGame } from './app.js';
const socket = io();
socket.emit('join-game', { room, username });

// Escuchar chat-msg
socket.on('player-joins', (player) => {
    joinGame(player, socket.id);
});

export function playerMoves(position) {
    socket.emit('player-moves', position);
}

function logout() {
    storage.clear();
    goToJoin();
}
