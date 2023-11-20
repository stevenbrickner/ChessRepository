import { User, Server, Database, Queue } from './classes.js';

// Create instances with sample values
const database = new Database('Database');
const server = new Server();
const user = new User(server.assignSession(), '', '', '', 900);
const queue = new Queue('Standard');

// Disables queue buttons and hides friends and messages when called
// There's probably a better way to do this but this works for now
setDisplay();

// Adds user to queue which should enable matchUsers to function properly
queue.enqueueUser(user);

function login() {
    // Get the values from the input fields
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    user.logIn(user.sessionID, username, password);

    // Update the UI after login
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('user-info').style.display = 'block';
    document.getElementById('username-display').textContent = user.username;
    document.getElementById('rating-display').textContent = user.rating;

    // Enables buttons and friends/messages list when called
    setDisplay();
}

function setDisplay() {
    const queueButtons = document.querySelectorAll('.game-modes li');
    const messagesElement = document.querySelector('.messages');
    const friendsOnlineElement = document.querySelector('.friends-online');

    if (user.isLoggedIn) {
        // User is logged in, show messages and friends online
        messagesElement.style.display = 'block';
        friendsOnlineElement.style.display = 'block';
    } else {
        // User is not logged in, hide messages and friends online
        messagesElement.style.display = 'none';
        friendsOnlineElement.style.display = 'none';
    }

    queueButtons.forEach(button => {
        if (!user.isLoggedIn) {
            // Apply faded class if the user is not logged in
            button.classList.add('faded');
            button.style.cursor = 'not-allowed';
        } else {
            // Enable the button if the user is logged in
            button.classList.remove('faded');
            button.style.cursor = 'pointer';
            button.addEventListener('click', function() {
                user.joinQueue(queue);
                queue.matchUsers()
                window.open('chessboard/chess.html', '_blank');
            });
        }
    });
}

document.getElementById('login-button').addEventListener('click', login);