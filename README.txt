Steven Brickner
CEN 3024 01Z

Chess System Implementation

I know I coded much more than I was required to but

 1. I actually wanted to get this working, including with a server and database,
    except for piece movement logic. Unfortunately I've been sick from the 30th to 
    the 17th and couldn't do much classwork at the time.
 2. This is also going to be my final submission for my Internet Programming class.

The actual code I have in place is an absolute mess. I intended to completely
rebuild the logic of how the game stores and handles pieces but ran out of time.
It's a miracle this actually works in any form and I'm sorry you have to read it.

Bugs:

    Critical: 

        1. No proper session management in place. Users are not consistently
           tracked from page to page. SessionID is generated but not used properly
           because I have no idea what I'm doing when it comes to HTML.
        2. The chess HTML page redeclares new versions of classes, such as
           Server, Database, and GameSession. 
        3. Created GameSessions don't match users matched in Queue.
        4. Chess HTML page isn't uniquely generated and is an insecure
           direct object reference. Authentication measures are bypassable. 
        5. Event handler for clicking on a piece can't find piece at any location.
        6. GameSession.promptUser doesn't wait for user action, which would cause
           an infinite loop in the main chess.js file's execution if the method 
           call didn't fail there.

    Major:

        1. User info isn't updated with user authentication information. 
        2. Queue calls matchUsers even when there should only be one user
           in the queue.
        3. End of game doesn't currently reflect winner or loser.
        4. Request draw doesn't send request to other user.
        5. Button hide functionality doesn't work.
           White's buttons can be clicked on black's turn and vice versa.
           Game can be ended multiple times with resign button.
        6. GameSession doesn't have a means to identify winner/loser, and thus
           Database doesn't log game outcome.

    Minor:

        1. Button event listeners and handler functions are in chess.js file
           instead of being part of Chessboard's initializeBoard (I'm considering
           the buttons to be part of the board but honestly they should probably
           be in the GameSession class).

Sample output (All output can be found in the Console logs):

New Server created classes.js:90:17
New session ID created classes.js:99:17
 has been added to the Standard queue. classes.js:147:17
logIn executed successfully. classes.js:19:17
Validating user credentials classes.js:126:17
User credentials validated successfully. classes.js:202:17
Session ID updated classes.js:106:17
joinQueue executed successfully. classes.js:38:17
Request routed classes.js:120:17
 has been added to the Standard queue. classes.js:147:17
Match found classes.js:165:17
 has been removed from the Standard queue. 2 classes.js:153:17
Creating game session classes.js:170:17
New GameSession created classes.js:90:17
GameSession created for  and .

New Server created classes.js:90:17
New session ID created 2 classes.js:99:17
New GameSession created classes.js:90:17
I can't get pieces on the board to work, so click test button to test code flow chess.js:9:9
Game started! Bob goes first. classes.js:261:17
Uncaught TypeError: user.movePiece is not a function
    promptUser http://127.0.0.1:5500/js/classes.js:270
    <anonymous> http://127.0.0.1:5500/chessboard/chess.js:46
classes.js:270:28
Initializing board for white classes.js:471:21
Pieces: white:  
Array(16) [ {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, … ]
classes.js:473:21
Initializing board for black classes.js:475:21
Pieces: black:  
Array(16) [ {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, … ]
classes.js:477:21
Test button clicked chess.js:40:13
isValidMove method called successfully. classes.js:587:17
Pawn: validateMove method called successfully. classes.js:602:17
Board updated. classes.js:580:17
Updating move history classes.js:300:17
Dale's move. classes.js:311:17
Request Draw button clicked chess.js:26:13
requestDraw executed successfully. classes.js:60:17
respondToDraw executed successfully. classes.js:67:17
Resign button clicked chess.js:32:13
resign executed successfully. classes.js:74:17
Game Session saved to database successfully. classes.js:218:17
Game is over. classes.js:345:17

​


