import { User, Server, Database, Queue, GameSession, Chessboard, Piece } from '../js/classes.js';

const database = new Database();
const server = new Server();
const user1 = new User(server.assignSession(), 'Bob', '', '', 900);
const user2 = new User(server.assignSession(), 'Dale', '', '', 900);
const gameSession = new GameSession(user1, user2);

console.log("I can't get pieces on the board to work, so click test button to test code flow");

// These should be part of the Chessboard initializeBoard() method but
// I couldn't get them working so they're here for now
document.addEventListener('DOMContentLoaded', () => {
    const testButton = document.getElementById('testButton');
    const drawButton = document.getElementById('drawButton');
    const resignButton = document.getElementById('resignButton');

    // Add click event listeners for the buttons
    testButton.addEventListener('click', () => handleTestButtonClick());
    drawButton.addEventListener('click', () => handleDrawButtonClick());
    resignButton.addEventListener('click', () => handleResignButtonClick());
});

function handleDrawButtonClick() {
    // Handles request draw button click
    console.log('Request Draw button clicked');
    user1.requestDraw();
}

function handleResignButtonClick() {
    // Handles resign button click
    console.log('Resign button clicked');
    user1.resign();
    gameSession.gameOver = true;
    gameSession.endGame();
}
function handleTestButtonClick() {
    // Test button exists because I can't get the pieces on the board to register
    // So this calls a dummy version of promptUser to test logic
    console.log('Test button clicked');
    gameSession.promptUser(user1);
}

gameSession.startGame();
while(!gameSession.gameOver) {
    gameSession.promptUser(gameSession.turn);
}
gameSession.endGame();