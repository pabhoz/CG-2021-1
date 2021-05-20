import { joinGame, players, loadPlayers, removePlayer } from './app.js';

const socket = io();
socket.emit('join-game', { room, username });

// Escuchar chat-msg
socket.on('player-joins', (response) => {
    joinGame(response.user);
    loadPlayers(response.users);
});

socket.on('player-leaves', (player) => {
    removePlayer(player);
});

socket.on('player-moves', (player) => {
    if (player.id in players) {
        const { x,y,z } = player.position
        players[player.id].control.setPosition(x,y,z);
    }
})

export function playerMoves(position) {
    // console.log(position);
    socket.emit('player-moves', position);
}

function logout() {
    storage.clear();
    goToJoin();
}
