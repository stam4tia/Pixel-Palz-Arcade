let characterX;
let characterY;
let characterWidth = 100;
let characterHeight = 120;
let characterXSpeed = 0;
let characterYSpeed = 0;
let gravity = 2;
let jumpStrength = -40; // increase jump strength for a higher jump

let objects = [];
let stinkbug; 
let objectSize = 100;
let stinkbugSize = 70; //  stinkbug size
let maxObjects = 3; // max number of regular objects on the screen
let score = 0;

let characterGroundImg;
let characterJumpImg;
let objectImg;
let stinkbugImg;
let backgroundImage;
let gameOverImg;
let startScreenImg;
let instructionsScreenImg;

let isJumping = false;
let gameOver = false;
let gameStarted = false;
let instructionsShown = false;

let highScore = localStorage.getItem("highScore") || 0; // retrieve high score from local storage, default to 0 if not found

let retroFont;



function preload() {
    backgroundImage = loadImage('habitat.gif'); 
    characterGroundImg = loadImage('mauve_sitting.PNG'); 
    characterJumpImg = loadImage('mauve_jumping.PNG'); 
    objectImg = loadImage('fly.png'); 
    stinkbugImg = loadImage('stinkbug.png'); 
    gameOverImg = loadImage('GameOverMauve.png');
    startScreenImg = loadImage('MauveStart.GIF');
    instructionsScreenImg = loadImage('MauveStart2.png');
    retroFont = loadFont('Xeliard.ttf');

}

function setup() {
    createCanvas(600, 600); 
    characterX = width / 2; // start the character in the center horizontally
    characterY = height - characterHeight;
    textFont(retroFont);

}

function draw() {
    if (gameStarted) {
        if (!gameOver) {
            image(backgroundImage, 0, 0, width, height);

            // display score
            textSize(24);
            fill(0);
            text(`Score: ${score}`, 20, 40);

            text(`High Score: ${highScore}`, 20, 70); // display high score

            // character movement and gravity
            characterX += characterXSpeed;
            characterY += characterYSpeed;
            characterYSpeed += gravity;
            characterX = constrain(characterX, 0, width - characterWidth);
            characterY = constrain(characterY, 0, height - characterHeight);

            // draw character image based on whether the character is jumping
            if (isJumping) {
                image(characterJumpImg, characterX, characterY, characterWidth, characterHeight);
            } else {
                image(characterGroundImg, characterX, characterY, characterWidth, characterHeight);
            }

            // object appearance and collision
            if (frameCount % 125 == 0) { // adjust for every 2 seconds (60 frames/second)
                spawnObjects();
            }

            // draw regular objects
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].isVisible && !objects[i].isStinkbug) {
                    image(objectImg, objects[i].x, objects[i].y, objectSize, objectSize);
                }
            }

            // draw stinkbug
            if (stinkbug && stinkbug.isVisible) {
                image(stinkbugImg, stinkbug.x, stinkbug.y, stinkbugSize, stinkbugSize);
            }

            // character collision with stinkbug
            if (stinkbug && stinkbug.isVisible) {
                let d = dist(characterX + characterWidth / 2, characterY + characterHeight / 2, stinkbug.x + stinkbugSize / 2, stinkbug.y + stinkbugSize / 2); // Reduce collision radius
                if (d < characterWidth / 2 + stinkbugSize / 2 && keyIsDown(87)) { // collision and 'W' key pressed
                    gameOver = true;
                }
            }

            // character collision with regular objects
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].isVisible && !objects[i].isStinkbug) {
                    let d = dist(characterX + characterWidth / 2, characterY + characterHeight / 2, objects[i].x + objectSize / 2, objects[i].y + objectSize / 2);
                    if (d < characterWidth / 2 + objectSize / 2 && keyIsDown(87)) { // collision and 'W' key pressed
                        objects[i].isVisible = false;
                        score++; // increase the score when character touches the object
                    }
                }
            }

            // remove invisible objects
            objects = objects.filter(object => object.isVisible);
        } else {
            image(gameOverImg, 0, 0, width, height);
            drawGameOverScreen(); // call function to display score

            // allow player to restart the game by pressing "R" key
            if (key === 'r' || key === 'R') {
                location.reload(); // reload the page to restart the game
            }
        }
    } else {
        if (!instructionsShown) {
            image(startScreenImg, 0, 0, width, height);
        } else {
            image(instructionsScreenImg, 0, 0, width, height);
        }
    }
}

function keyPressed() {
    if (!gameStarted) {
        if (!instructionsShown && keyCode === 13) { // 13 is the keyCode for Enter key
            instructionsShown = true;
        } else if (instructionsShown && keyCode === 13) {
            gameStarted = true;
        }
    }

    if (keyCode === 32 && characterY === height - characterHeight) {
        // jump when Spacebar is pressed and the character is on the ground
        characterYSpeed = jumpStrength;
        isJumping = true; // set to true when jumping
    }

    if (key === 'a' || key === 'A') {
        // move left when 'A' or 'a' key is pressed
        characterXSpeed = -5;
    } else if (key === 'd' || key === 'D') {
        // move right when 'D' or 'd' key is pressed
        characterXSpeed = 5;
    }
    if (keyCode === 82 || keyCode === 114) { // check for "R" or "r" key
        location.reload(); // reload the page to restart the game
    }
}

function keyReleased() {
    if ((key === 'a' || key === 'A') || (key === 'd' || key === 'D')) {
        characterXSpeed = 0;
    }

    if (keyCode === 32) {
        // set isJumping to false when the spacebar is released
        isJumping = false;
    }
}

function drawGameOverScreen() {
    // load Game Over image
    let gameOverImg = loadImage('GameOverMauve.png');

    // draw Game Over image
    image(gameOverImg, 0, 0, width, height);

    // update high score if applicable
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore); // store new high score in local storage
    }

    // display "Game Over" text or "New High Score!" if applicable
    fill(255);
    textSize(60); 
    textAlign(CENTER, CENTER);
    if (score > highScore) {
        text("New High Score!", width / 2, height / 2 - 100); // display "New High Score!" if the current score is higher
    } else {
        text("Game Over!", width / 2, height / 2 - 100); // display "Game Over" if the current score is not higher
    }

    // display score
    textSize(30); 
    text(`Your Score: ${score}`, width / 2, height / 2 - 20); 

    // display high score
    textSize(35)
    text(`High Score: ${highScore}`, width / 2, height / 2 + 30); 
    // display "Press R to play again!" text
    textSize(40); // Increased text size
    text("Press R to play again!", width / 2, height / 2 + 90); 
}

function spawnObjects() {
    objects = []; // clear existing objects
    spawnStinkbug();
    for (let i = 0; i < maxObjects; i++) {
        objects.push({
            x: random(width - objectSize),
            y: random(height - objectSize),
            isVisible: true,
            isStinkbug: false // mark regular objects
        });
    }
}

// spawn stinkbug
function spawnStinkbug() {
    // initialize stinkbug position
    let stinkbugX;
    let stinkbugY;
    
    // ensure stinkbug position is not too close to the character's position
    do {
        stinkbugX = random(width - stinkbugSize);
        stinkbugY = random(height - stinkbugSize);
    } while (dist(characterX, characterY, stinkbugX, stinkbugY) < characterWidth * 2); // adjust the distance as needed
    
    stinkbug = {
        x: stinkbugX,
        y: stinkbugY,
        isVisible: true
    };
}
