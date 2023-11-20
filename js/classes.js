// Class User
// Handles user actions
// Stores user account information

export class User {
    constructor(sessionID, username, password, email, rating = 900) {
        this.sessionID = sessionID;
        this.username = username;
        this.password = password;
        this.email = email;
        this.rating = rating;
        this.isLoggedIn = false;
        this.server = Server.instance;
    }

    logIn(sessionID, username, password) {
        // Send credential information to the server for validation
        // The server will call validateCredentials
        console.log("logIn executed successfully.");
        this.server.validateCredentials(sessionID, username, password);
        this.isLoggedIn = true;
    }

    register(sessionID, username, password) {
        // Send credential information to the server for registration
        // The server will call routeRequest
        console.log("register executed successfully.");
        this.server.routeRequest(sessionID, username, password);
    }

    updateProfile() {
        // Placeholder for updating the user profile
        console.log("updateProfile executed successfully.");
    }

    joinQueue(queue) {
        // Route request to join the queue to the server which routes to queue
        console.log("joinQueue executed successfully.");
        this.server.routeRequest(this, queue);
    }

    movePiece() {
        // Handle the user's piece movement when it's their turn
        // I don't really know what to do with this since a user should
        // be able to input their movement by clicking.
        // It probably shouldn't even exist
        console.log("movePiece executed successfully.");
    }

    movePiece(test) {
        // This is a dummy implementation for testing
        // Executes when the test button is hit
        const piece = new Pawn();    
        return piece;
    }

    requestDraw() {
        // User requests a draw when it's their turn
        // This should be sent to GameSession for the opponent to respond
        // but it isn't right now
        console.log("requestDraw executed successfully.");
        this.respondToDraw();
    }

    respondToDraw() {
        // User responds to a draw offered by another user
        // Not currently implemented
        console.log("respondToDraw executed successfully.");
        return false;
    }

    resign() {
        // User resigns from the game
        // This should be sent to GameSession but isn't currently
        console.log("resign executed successfully.");
    }
}

// Class Server
// Children: Queue, GameSession
// Meant to represent a back-end server system
// Assigns and updates sessions and routes requests

export class Server {

    static instance;
    
    constructor() {
        Server.instance = this;
        this.database = Database.instance;
        console.log(`New ${this.constructor.name} created`);
        this.sessions = [];
    }

    assignSession() {
        // Generates a unique session ID (for simplicity, using a random number)
        const sessionId = Math.floor(Math.random() * 1000000);
        // Adds the ID to the list of sessions
        this.sessions.push(sessionId);
        console.log("New session ID created");
        return sessionId;
    }

    updateSession(sessionId, username, password) {
        // Updates the user session with the provided user info
        // Not implemented in any meaningful way though
        console.log("Session ID updated");
    }

    routeRequest(username, password) {
        // Meant to send requests to server to their proper place
        // though I'm not sure what that should actually look like
        // Made two versions, one for each in the sequence diagram
        console.log("Request routed");
        this.database.createUser(username, password);
    }

    routeRequest(user, queue) {
        // This version sends the user request to join the queue
        // to the appropriate queue
        console.log("Request routed");
        queue.enqueueUser(user);
    }

    validateCredentials(sessionID, username, password) {
        // Sends credentials to the database for validation
        // Updates session if successful
        console.log("Validating user credentials");
        if(this.database.sendUserInfo(username, password)) {
            this.updateSession(sessionID, username, password)
        };
    }
}

// Class Queue
// Parent: Server
// Meant to represent a back-end queue server for each game mode
// Matches users and creates game sessions for them

export class Queue {
    constructor(gameType) {
        this.gameType = gameType;
        this.users = [];
    }

    enqueueUser(user) {
        // Adds user to queue
        this.users.push(user);
        console.log(`${user.username} has been added to the ${this.gameType} queue.`);
    }

    dequeueUser() {
        // Removes user from queue
        const dequeuedUser = this.users.shift();
        console.log(`${dequeuedUser.username} has been removed from the ${this.gameType} queue.`);
        return dequeuedUser;
    }

    createGameSession(user1, user2) {
        // Creates a new GameSession for two users
        const gameSession = new GameSession(user1, user2);
        console.log(`GameSession created for ${user1.username} and ${user2.username}.`);
        return gameSession;
    }

    matchUsers() {
        console.log("Match found");
        // Dequeues matched users
        const user1 = this.dequeueUser();
        const user2 = this.dequeueUser();
        // Creates a GameSession for users
        console.log("Creating game session");
        this.createGameSession(user1, user2);
    }
}


// Class Database
// Meant to represent the back-end storage of the system
// Table columns indicated below

export class Database {

    static instance;

    constructor(name) {
        Database.instance = this;
        this.name = name;
        this.tables = {
            Users: [],       // Username, Password, Email, and Rating
            GameSessions: [] // ID, WhiteID, BlackID, MoveHistory, Result
        };
    }

    createUser(username, password) {
        // Receives a username and password combination and creates a user
        console.log("User created successfully.");
        return true;
    }

    sendUserInfo(username, password) {
        // Receives a username/password combination, searches its table, and returns info
        // if successful, fails if credentials are invalid
        console.log("User credentials validated successfully.");
        return true;
    }

    updateUserInfo(oldPassword, newPassword) {
        // Updates the user's password
        console.log("User info updated successfully.");
    }

    updateUserInfo(username, result) {
        // Updates the user ranking based on the result of a game
        console.log("User info updated successfully.");
    }

    storeGameData(id, whiteID, blackID, moveHistory, result) {
        // Stores information from a GameSession into the GameSessions table
        console.log("Game Session saved to database successfully.");
    }
}

// Class GameSession
// Parent: Server
// Handles all server logic for the individual game

export class GameSession extends Server {
    constructor(user1, user2) {
        super();
        this.id = 1; // not implemented correctly
        this.users = [user1, user2];
        this.timer = null; // not implemented
        this.moveHistory = [];
        this.chessboard = null;
        this.gameOver = false;
        this.turn = null;
        this.database = Database.instance;
    }

    createBoard() {
        // Creates the Chessboard instance and initializes it
        this.chessboard = new Chessboard();
        this.chessboard.initializeBoard();
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Sets the click handler in the Chessboard instance
        this.chessboard.setClickHandler(this.handleSquareClick.bind(this));
    }

    startGame() {
        // Shuffles the users array to randomize the assignment of colors
        this.users.sort(() => Math.random() - 0.5);

        // Sets the turn to the first user in the shuffled array
        this.turn = 0;

        // Creates the board
        this.createBoard();

        console.log(`Game started! ${this.users[this.turn].username} goes first.`);
    }

    promptUser(user) {
        // This method should be what receives user action, whether that's moving,
        // requesting a draw, or resigning, but I couldn't get anything working in time
        // to handle this properly
        
        // Test version of movePiece
        const piece = user.movePiece("1");

        // Junk data
        // This method of keeping track of piece location won't be used in the end
        const startRow = 0;
        const startCol = 0;
        const endRow = 0;
        const endCol = 0;
        // Accepts and validates user input before sending
        if (this.chessboard.isValidMove(piece, startRow, startCol, endRow, endCol)) {
            // Updates board
            this.chessboard.updateBoard(piece, endRow, endCol);

            // Sends move to user (doesn't actually do this or honestly make sense to)
            const sessionId = this.turn === 0 ? this.users[0].sessionID : this.users[1].sessionID;
            this.sendMove(sessionId, piece, endRow, endCol);
            // Checks if game is over
            if(this.chessboard.isInMate || this.chessboard.isInStalemate) {
                this.gameOver = true;
            }
        } else {
            this.displayWarning(sessionId, "Invalid move. Please try again.");
        }
    }

    sendMove(sessionId, piece, endRow, endCol) {
        // This method would make more sense when using an actual server
        // so instead this implementation just passes control, logs the move,
        // and enables/disables buttons appropriately (if it worked that is)
    
        // Updates move history with the move
        console.log("Updating move history");
        this.moveHistory.push({ sessionId, piece, endRow, endCol});
    
        // Disables current player buttons
        this.disableButtons(this.turn);
        
        // Passes control to the other user
        this.turn = this.turn === 0 ? 1 : 0;
        
        // Enables current player buttons
        this.enableButtons(this.turn);
        console.log(`${this.users[this.turn].username}'s move.`);
    }
    
    disableButtons(player) {
        // Function to disable buttons for a specific player
        // Doesn't currently work
        const buttons = document.querySelectorAll(`.buttons-container[data-player="${player}"] button`);
        buttons.forEach(button => {
            button.disabled = true;
        });
    }
    
    enableButtons(player) {
        // Function to enable buttons for a specific player
        // Doesn't currently work
        const buttons = document.querySelectorAll(`.buttons-container[data-player="${player}"] button`);
        buttons.forEach(button => {
            button.disabled = false;
        });
    }

    displayWarning(sessionId, message) {
        // Displays a warning to the user
        // SessionId would in theory make sure this is sent
        // to the appropriate user but that's not implemented
        console.log(`Warning: ${message}`);
    }

    endGame() {
        // Doesn't currently properly reflect winner or loser
        // Prevents any moves from being made
        this.turn = null;
        // Stores game data in the database
        this.database.storeGameData(this.id, this.users[0], this.users[1], this.moveHistory)
        console.log("Game is over.");
    }

    handleSquareClick(event, row, col) {
        // Handles logic when a square is clicked
        // Couldn't get this working in time so don't click squares
        // Almost all of this, including any methods this calls,
        // needs to be rewritten from the ground up

        const squareIndex = row * 8 + col;
        const square = document.getElementById('chessboard').children[squareIndex];
    
        // Determines which array to use
        const currentPlayerIndex = this.turn;
        const currentPlayerPieces = currentPlayerIndex === 0 ? this.chessboard.whitePieces : this.chessboard.blackPieces;
        console.log("currentplayerpieces: ", currentPlayerPieces);
        if (!this.chessboard.selectedPiece) {
            // First click - select a piece
            const piece = this.getPieceAtSquare(currentPlayerPieces, square);
            console.log('Piece: ', piece);
            if (piece && currentPlayerPieces.includes(piece)) {
                chessboard.selectedPiece = piece;
                chessboard.selectedPosition = square;
                //chessboard.highlightSquare(square);
            }
        } else {
            // Second click - move the selected piece
            if (this.chessboard.isValidMove(piece, startRow, startCol, endRow, endCol)) {
                this.chessboard.updateBoard();
                this.sendMove(sessionId, piece, endRow, endCol);
                // Clear the selected piece after the move
                this.selectedPiece = null;
                this.selectedPosition = null;
                // Checks if game is over
                if(this.chessboard.isInMate || this.chessboard.isInStalemate) {
                    this.gameOver = true;
                }
            } else {
                this.displayWarning(sessionId, "Invalid move. Please try again.");
            }
            //chessboard.clearHighlight(square);
        }
    }

    handleDrawButtonClick() {
        // Handles request draw button click
        console.log('Request Draw button clicked');
        user1.requestDraw();
    }
    
    handleResignButtonClick() {
        // Handles resign button click
        console.log('Resign button clicked');
        user[turn].resign();
        gameSession.gameOver = true;
        gameSession.endGame();
    }

    handleTestButtonClick() {
        // Test button exists because I can't get the pieces on the board to register
        // So this calls movePiece without relying on them to test logic
        console.log('Test button clicked');
        gameSession.promptUser(User1);
    }

    getPieceAtSquare(pieces, square) {
        console.log("Square: ", square);
        // Retrieve the piece at the specified square
        // This is where current implementation gets hung up
        // Even if a square has a piece, this doesn't work
        return pieces.find(piece => piece.square.outerHTML === square.outerHTML);
    }

   /* getPieceAtSquare(pieces, square) { // this version logs each piece for testing
        console.log("Square: ", square);
    
        // Retrieve the piece at the specified square
        const foundPiece = pieces.find(piece => {
            console.log("Checking piece: ", piece);
            console.log("Piece square HTML: ", piece.square.outerHTML);
            console.log("Target square HTML: ", square.outerHTML);
    
            return piece.square.outerHTML === square.outerHTML;
        });
    
        console.log("Found Piece: ", foundPiece);
        return foundPiece;
    } */
}

// Class Chessboard
// Handles all logic for the individual board
// Stores all piece information such as color and location
// Stores all board information such as game state

export class Chessboard {
    constructor() {
        this.whitePieces = [];
        this.blackPieces = [];
        this.ruleSet = 'Standard'; 
        this.isInCheck = false;
        this.isInMate = false;
        this.isInStalemate = false;
        this.clickHandler = null;
    }

    initializeBoard() {
        // Ensure the HTML page is fully loaded first
        document.addEventListener('DOMContentLoaded', () => {
            const chessboard = document.getElementById('chessboard');
            const boardRef = this;
    
            // Create the chessboard
            createChessboard();

            // Create the draw and resign buttons (causes issues so put in chess.js for now)
            /*const testButton = document.getElementById('testButton');
            const drawButton = document.getElementById('drawButton');
            const resignButton = document.getElementById('resignButton');
        
            // Add click event listeners for the buttons
            testButton.addEventListener('click', () => handleTestButtonClick());
            drawButton.addEventListener('click', () => handleDrawButtonClick());
            resignButton.addEventListener('click', () => handleResignButtonClick());*/
    
            // White pieces
            console.log("Initializing board for white");
            createPieces(boardRef, 'white', 1, 0);
            console.log('Pieces: white: ', this.whitePieces);
            // Black pieces
            console.log("Initializing board for black");
            createPieces(boardRef, 'black', 6, 7);
            console.log('Pieces: black: ', this.blackPieces);
            
            // Helper function to create the chessboard
            function createChessboard() {
                for (let row = 0; row < 8; row++) {
                    for (let col = 0; col < 8; col++) {
                        // Create square HTML elements
                        const square = document.createElement('div');
                        square.className = 'square';
    
                        // Divide the chessboard into even and odd squares for CSS styling
                        square.classList.add((row % 2 === 0 && col % 2 === 0) || (row % 2 !== 0 && col % 2 !== 0) ? 'even' : 'odd');
    
                        // Create a piece element and event listener for each square
                        // Needs replacing
                        const piece = document.createElement('div');
                        piece.className = 'piece';
                        square.appendChild(piece);
                        square.addEventListener('click', (event) => boardRef.clickHandler(event, row, col));
                        chessboard.appendChild(square);
                    }
                }
            }
    
            // Helper function to create and place pieces
            // Stores the piece and its square in the appropriate array
            // pawnRow and backRow calculate the appropriate square
            function createPieces(board, color, pawnRow, backRow) {

                const piecesArray = color === 'white' ? board.whitePieces : board.blackPieces;

                // Pawns
                for (let col = 0; col < 8; col++) {
                    const square = chessboard.children[pawnRow * 8 + col];
                    piecesArray.push({ piece: new Pawn(), square: square });
                }

                // Rooks, Knights, Bishops, Queen, King
                const backRowPieces = ['Rook', 'Knight', 'Bishop', 'Queen', 'King', 'Bishop', 'Knight', 'Rook'];
                for (let col = 0; col < 8; col++) {
                    const square = chessboard.children[backRow * 8 + col];
                    const pieceType = backRowPieces[col];

                    // Create instances of the appropriate piece type
                    switch (pieceType) {
                        case 'Rook':
                            piecesArray.push({ piece: new Rook(), square: square });
                            break;
                        case 'Knight':
                            piecesArray.push({ piece: new Knight(), square: square });
                            break;
                        case 'Bishop':
                            piecesArray.push({ piece: new Bishop(), square: square });
                            break;
                        case 'Queen':
                            piecesArray.push({ piece: new Queen(), square: square });
                            break;
                        case 'King':
                            piecesArray.push({ piece: new King(), square: square });
                            break;
                        default:
                            break;
                    }
                }
                placePiecesOnBoard(piecesArray, color);
            }

            // Helper function that assists in initializing the presentation of the board
            // Needs replacing
            function placePiecesOnBoard(piecesArray, color) {
                piecesArray.forEach(pieceInfo => {
                    const { piece, square } = pieceInfo;
                    square.firstChild.innerHTML = getPieceSymbol(color, piece.constructor.name);
                });
            }
    
            // Helper function to get the piece symbol based on the color and type of piece
            function getPieceSymbol(color, type) {
                // Map piece types to symbols
                const pieceTypeSymbols = {
                    'Pawn': 'P',
                    'Rook': 'R',
                    'Knight': 'N',
                    'Bishop': 'B',
                    'Queen': 'Q',
                    'King': 'K'
                };
    
                // Determine the piece symbol based on color and type
                // White is uppercase, black is lowercase
                return color === 'black' ? pieceTypeSymbols[type] : pieceTypeSymbols[type].toLowerCase();
            } 
        });
    }

    setClickHandler(handler) {
        // Lets GameSession handle events while Chessboard focuses on board visuals
        this.clickHandler = handler;
    }

    updateBoard(piece, endRow, endCol) {
        // Updates the visual board based on the current state
        // Needs replacing
        console.log('Board updated.');
    }

    isValidMove(piece, startRow, startCol, endRow, endCol) {
        // Calls validateMove method to validate piece movement
        // then checks for validation of the move in the context of the entire board
        // Needs replacing
        console.log('isValidMove method called successfully.');
        let validMove = piece.validateMove(piece, startRow, startCol, endRow, endCol);
        return true;
    }
}

// Class Piece
// Children: Pawn, Knight, Bishop, Rook, Queen, King
// Handles all logic for the individual pieces
// Ideally, the individual pieces would have their own specific validating logic
// based on their specific movesets. But that's not implemented here.

export class Piece {
    validateMove(piece, startRow, startCol, endRow, endCol) {
        // Checks for validation of the move in the context of the individual piece
        console.log(`${this.constructor.name}: validateMove method called successfully.`);
        return true;
    }
}

class Pawn extends Piece {
}

class Knight extends Piece {
}

class Bishop extends Piece {
}

class Rook extends Piece {
}

class Queen extends Piece {
}

class King extends Piece {
}