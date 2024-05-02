let runnerX1 = 200;
let runnerY1 = 200;
let runnerX2 = 300;
let runnerY2 = 300;
let runnerXSpeed1 = 0;
let runnerYSpeed1 = 0;
let runnerXSpeed2 = 0;
let runnerYSpeed2 = 0;
const runnerWidth = 50;
const runnerHeight = 50;
const moveSpeed = 10; // adjust for runner movement speed
let gameStarted = false;
let startButton;
let gameWon = false;
let backgroundImage;
let gameMode = 1; // 1 for two-player mode, 2 for single-player mode
let fishX;
let fishY;
let fishSpeedTwoPlayers = 2; // adjust fish movement speed for two-player mode
let fishSpeedOnePlayer = 4; // adjust fish movement speed for single-player mode
let onePlayerButton;
let twoPlayersButton;
let targetX;
let targetY;
let fishImage1; 
let fishImage2; 
let bubblesStart;
let capturedBubbles;
let showStartCutscene = true;
let showMode1Cutscene = false;
let mode1CutsceneTimer = 0;
const mode1CutsceneDuration = 3 * 60; // 3 seconds at 60 FPS
let showMode2Cutscene = false;
let mode2CutsceneTimer = 0;
const mode2CutsceneDuration = 3 * 60; // 3 seconds at 60 FPS
let clicks = 0; 




function preload() {
  backgroundImage = loadImage('water.jpeg');
  fishImage1 = loadImage('fish.png');
  fishImage2 = loadImage('fish2.png');
  bubblesStart = loadImage('BubblesStart.gif');
  capturedBubbles = loadImage('CapturedBubbles.png');
  mode1Cutscene = loadImage('mode1.png');
  mode2Cutscene = loadImage('mode2.png');
}

  function setup() {
    createCanvas(400, 400);
    rectMode(CENTER);
}
  



function draw() {
  image(backgroundImage, 0, 0, width, height);

  // display the start cutscene 
  if (showStartCutscene) {
      image(bubblesStart, 0, 0, width, height);
  } else if (showMode1Cutscene) {
      image(mode1Cutscene, 0, 0, width, height);
      mode1CutsceneTimer++;
      if (mode1CutsceneTimer >= mode1CutsceneDuration) {
          showMode1Cutscene = false;
      }
  } else if (showMode2Cutscene) {
      image(mode2Cutscene, 0, 0, width, height);
      mode2CutsceneTimer++;
      if (mode2CutsceneTimer >= mode2CutsceneDuration) {
          showMode2Cutscene = false;
      }
  } else {
      if (gameStarted) {
          if (gameMode === 1) {
              handleTwoPlayerMode();
          } else if (gameMode === 2) {
              handleSinglePlayerMode();
          }
      }

      // display click count on the top left corner
      fill(255);
      textSize(20);
      text('Clicks: ' + clicks, 10, 30);
  }

  // display captured bubbles if game is won
  if (gameWon) {
      image(capturedBubbles, 0, 0, width, height);
  }
}

  
  
function handleTwoPlayerMode() {
  if (keyIsDown(65)) { // A key
      runnerX1 -= moveSpeed;
  }
  if (keyIsDown(68)) { // D key
      runnerX1 += moveSpeed;
      image(fishImage2, runnerX1 - runnerWidth / 2, runnerY1 - runnerHeight / 2, runnerWidth, runnerHeight);
  } else {
      image(fishImage1, runnerX1 - runnerWidth / 2, runnerY1 - runnerHeight / 2, runnerWidth, runnerHeight);
  }
  if (keyIsDown(87)) { // W key
      runnerY1 -= moveSpeed;
  }
  if (keyIsDown(83)) { // S key
      runnerY1 += moveSpeed;
  }

  // constrain runner 1 within canvas boundaries
  runnerX1 = constrain(runnerX1, runnerWidth / 2, width - runnerWidth / 2);
  runnerY1 = constrain(runnerY1, runnerHeight / 2, height - runnerHeight / 2);

  // check if player 2 captured the fish
  if (
      mouseX >= runnerX1 - runnerWidth / 2 &&
      mouseX <= runnerX1 + runnerWidth / 2 &&
      mouseY >= runnerY1 - runnerHeight / 2 &&
      mouseY <= runnerY1 + runnerHeight / 2 &&
      mouseIsPressed &&
      mouseButton === LEFT &&
      !gameWon
  ) {
      gameWon = true;
      noLoop();
  }
}

    
function handleSinglePlayerMode() {
  if (!targetX || !targetY || dist(runnerX1, runnerY1, targetX, targetY) < 10) {
      targetX = random(runnerWidth / 2, width - runnerWidth / 2);
      targetY = random(runnerHeight / 2, height - runnerHeight / 2);
  }

  // calculate the vector from the fish to the target
  let targetVector = createVector(targetX - runnerX1, targetY - runnerY1);

  // set the maximum movement distance per frame
  let maxMovement = 15; // Adjust for smoother movement

  // limit the movement vector to the maximum distance
  targetVector.limit(maxMovement);

  // move the fish towards the target
  runnerX1 += targetVector.x;
  runnerY1 += targetVector.y;

  // constrain fish within canvas boundaries
  runnerX1 = constrain(runnerX1, runnerWidth / 2, width - runnerWidth / 2);
  runnerY1 = constrain(runnerY1, runnerHeight / 2, height - runnerHeight / 2);

  // determine which image to display based on the movement direction
  let currentFishImage = fishImage2; // Default image
  if (targetVector.x < 0) {
      currentFishImage = fishImage1;
  }

  // draw the fish
  image(currentFishImage, runnerX1 - runnerWidth / 2, runnerY1 - runnerHeight / 2, runnerWidth, runnerHeight);

  // check for win condition (mouse click on the fish)
  if (
      mouseX >= runnerX1 - runnerWidth / 2 &&
      mouseX <= runnerX1 + runnerWidth / 2 &&
      mouseY >= runnerY1 - runnerHeight / 2 &&
      mouseY <= runnerY1 + runnerHeight / 2 &&
      mouseIsPressed &&
      mouseButton === LEFT &&
      !gameWon
  ) {
      clicks++; // click counter
      if (clicks >= 10) { // check if the required number of clicks is reached
          gameWon = true;
          noLoop();
      }
  }
}

  
  
              
  
  function keyPressed() {
    if (!gameStarted) {
        if (key === '1') {
            gameStarted = true;
            gameMode = 2; // set game mode to single-player
            showMode1Cutscene = true;
            startGame();
        } else if (key === '2') {
            gameStarted = true;
            gameMode = 1; // set game mode to two-players
            showMode2Cutscene = true;
            startGame();
        }
    } else {
        if (key === 'r' || key === 'R') {
            restartGame();
        }

      if (key === 'a' || key === 'A') {
        runnerXSpeed1 = -moveSpeed;
      } else if (key === 'd' || key === 'D') {
        runnerXSpeed1 = moveSpeed;
      } else if (key === 'w' || key === 'W') {
        runnerYSpeed1 = -moveSpeed;
      } else if (key === 's' || key === 'S') {
        runnerYSpeed1 = moveSpeed;
      }
    }
  }
  
  function keyReleased() {
    if (!startScreen) {
      if (key === 'a' || key === 'A' || key === 'd' || key === 'D') {
        runnerXSpeed1 = 0;
      } else if (key === 'w' || key === 'W' || key === 's' || key === 'S') {
        runnerYSpeed1 = 0;
      }
    }
  }
  
  function startGame() {
    showStartCutscene = false; // hide the start cutscene
    loop(); 
}

function restartGame() {
  gameStarted = false;
  gameWon = false;
  showStartCutscene = true;
  window.location.reload(); // refresh the entire page
}

