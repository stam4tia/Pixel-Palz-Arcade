let characterX;
let characterY;
let characterWidth = 100;
let characterHeight = 120;
let characterXSpeed = 0;
let characterYSpeed = 0;
let gravity = 2;
let jumpStrength = -40;

let objects = [];
let stinkbugs = [];
let objectSize = 100;
let stinkbugSize = 70;
let maxObjects = 3;
let maxStinkbugs = 1; // start with 1 stink bug
let score = 0;

let characterGroundImg;
let characterJumpImg;
let objectImg;
let stinkbugImg;
let backgroundImage;
let gameOverImg;
let startScreenImg;
let instructionsScreenImg;
let boingSound;
let backgroundMusic;


let isJumping = false;
let gameOver = false;
let gameStarted = false;
let instructionsShown = false;

let highScore = localStorage.getItem("highScore") || 0;

let retroFont;

function preload() {
    backgroundImage = loadImage('habitat.gif'); 
    characterGroundImg = loadImage('mauve_sitting.PNG'); 
    characterJumpImg = loadImage('mauve_jumping.PNG'); 
    objectImg = loadImage('fly.png'); 
    stinkbugImg = loadImage('stinkbug.png'); 
    gameOverImg = loadImage('GameOverMauve.PNG');
    startScreenImg = loadImage('MauveStart.gif');
    instructionsScreenImg = loadImage('MauveStart2.png');
    retroFont = loadFont('Xeliard.ttf');
    boingSound = loadSound('boing.mp3');
    backgroundMusic = loadSound('MauveRain.mp3'); 

}

function setup() {
    createCanvas(600, 600); 
    characterX = width / 2;
    characterY = height - characterHeight;
    textFont(retroFont);


    boingSound.setVolume(0.2);
    backgroundMusic.setVolume(0.4);
    backgroundMusic.loop(); 
}

function draw() {
    if (gameStarted) {
        if (!gameOver) {
            image(backgroundImage, 0, 0, width, height);
            textSize(24);
            fill(0);
            text(`Score: ${score}`, 20, 40);
            text(`High Score: ${highScore}`, 20, 70);

            characterX += characterXSpeed;
            characterY += characterYSpeed;
            characterYSpeed += gravity;
            characterX = constrain(characterX, 0, width - characterWidth);
            characterY = constrain(characterY, 0, height - characterHeight);

            if (isJumping) {
                image(characterJumpImg, characterX, characterY, characterWidth, characterHeight);
            } else {
                image(characterGroundImg, characterX, characterY, characterWidth, characterHeight);
            }

            if (frameCount % 125 == 0) {
                spawnObjects();
            }

            for (let i = 0; i < objects.length; i++) {
                if (objects[i].isVisible) {
                    image(objectImg, objects[i].x, objects[i].y, objectSize, objectSize);
                }
            }

            for (let i = 0; i < stinkbugs.length; i++) {
                if (stinkbugs[i].isVisible) {
                    image(stinkbugImg, stinkbugs[i].x, stinkbugs[i].y, stinkbugSize, stinkbugSize);
                }
            }

            for (let i = 0; i < stinkbugs.length; i++) {
                let d = dist(characterX + characterWidth / 2, characterY + characterHeight / 2, stinkbugs[i].x + stinkbugSize / 2, stinkbugs[i].y + stinkbugSize / 2);
                if (d < characterWidth / 2 + stinkbugSize / 2 && keyIsDown(87)) {
                    gameOver = true;
                }
            }

            for (let i = 0; i < objects.length; i++) {
                if (objects[i].isVisible) {
                    let d = dist(characterX + characterWidth / 2, characterY + characterHeight / 2, objects[i].x + objectSize / 2, objects[i].y + objectSize / 2);
                    if (d < characterWidth / 2 + objectSize / 2 && keyIsDown(87)) {
                        objects[i].isVisible = false;
                        score++;
                    }
                }
            }

            objects = objects.filter(object => object.isVisible);
            stinkbugs = stinkbugs.filter(stinkbug => stinkbug.isVisible);

            // increase spawn rate after reaching specific scores
            if (score === 20) {
                maxObjects = 6;
                maxStinkbugs = 2;
            } else if (score === 40) {
                maxObjects = 8;
                maxStinkbugs = 3;
            }
        } else {
            image(gameOverImg, 0, 0, width, height);
            drawGameOverScreen();

            if (key === 'r' || key === 'R') {
                location.reload();
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
        if (!instructionsShown && keyCode === 13) {
            instructionsShown = true;
        } else if (instructionsShown && keyCode === 13) {
            gameStarted = true;
        }
    }

    if (keyCode === 32 && characterY === height - characterHeight) {
        characterYSpeed = jumpStrength;
        isJumping = true;
        boingSound.play(); // play the boing sound when space bar is pressed
    }

    if (keyCode === 87 && characterY === height - characterHeight) { // Check for 'w' key
        isJumping = true;
    }

    if (key === 'a' || key === 'A') {
        characterXSpeed = -5;
    } else if (key === 'd' || key === 'D') {
        characterXSpeed = 5;
    }
    if (keyCode === 82 || keyCode === 114) {
        location.reload();
    }
}



function keyReleased() {
    if ((key === 'a' || key === 'A') || (key === 'd' || key === 'D')) {
        characterXSpeed = 0;
    }

    if (keyCode === 32) {
        isJumping = false;
    }

    if ((keyCode === 87 || keyCode === 119) && characterY === height - characterHeight) {
        isJumping = false;
    }
}

function drawGameOverScreen() {
    let gameOverImg = loadImage('/Mauve/GameOverMauve.png');

    image(gameOverImg, 0, 0, width, height);

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }

    fill(255);
    textSize(60);
    textAlign(CENTER, CENTER);
    if (score > highScore) {
        text("New High Score!", width / 2, height / 2 - 100);
    } else {
        text("Game Over!", width / 2, height / 2 - 100);
    }

    textSize(30);
    text(`Your Score: ${score}`, width / 2, height / 2 - 20);

    textSize(35)
    text(`High Score: ${highScore}`, width / 2, height / 2 + 30);
    textSize(35);
    text("Press R + ENTER to play again!", width / 2, height / 2 + 90);
}

function spawnObjects() {
    objects = [];
    stinkbugs = [];
    for (let i = 0; i < maxObjects; i++) {
        objects.push({
            x: random(width - objectSize),
            y: random(height - objectSize),
            isVisible: true
        });
    }
    for (let i = 0; i < maxStinkbugs; i++) {
        spawnStinkbug();
    }
}

function spawnStinkbug() {
    let stinkbugX;
    let stinkbugY;
    do {
        stinkbugX = random(width - stinkbugSize);
        stinkbugY = random(height - stinkbugSize);
    } while (dist(characterX, characterY, stinkbugX, stinkbugY) < characterWidth * 2);
    
    stinkbugs.push({
        x: stinkbugX,
        y: stinkbugY,
        isVisible: true
    });
}
