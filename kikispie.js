let player;
let objects = [];
let score = 0;
let lives = 3;
let gameSpeed = 1.5;
let cutsceneImages = [];
let cutsceneIndex = 0;
let gameState = 'cutscene';

let strawberryImage;
let blueberryImage;
let raspberryImage;
let backgroundImage;

let backgroundSound; // background audio
let splatSound; // splat sound for fruit collision

// specify the images to load after the player wins
let winImages = [
  '/KikisPie/thanks.PNG',
  '/KikisPie/enjoy.png',
  '/KikisPie/munch.PNG',
  '/KikisPie/nom.PNG',
  '/KikisPie/done.png'
];

function preload() {
  cutsceneImages.push(loadImage('/KikisPie/kikispiestart.gif'));
  cutsceneImages.push(loadImage('/KikisPie/hi.png'));
  cutsceneImages.push(loadImage('/KikisPie/kiki.gif'));
  cutsceneImages.push(loadImage('/KikisPie/help.gif'));

  strawberryImage = loadImage('/KikisPie/strawberry.png');
  blueberryImage = loadImage('/KikisPie/blueberry.png');
  raspberryImage = loadImage('/KikisPie/raspberry.png');
  backgroundImage = loadImage('/KikisPie/tree.gif');

  // load background audio
  backgroundSound = loadSound('/KikisPie/cute.mp4');

  // load splat sound
  splatSound = loadSound('/KikisPie/splat.wav');
}

function setup() {
  createCanvas(400, 400);
  player = new Player();
  frameRate(80);


  backgroundSound.setVolume(0);
  splatSound.setVolume(0);

  // start playing the background audio in a loop
  backgroundSound.loop();
}



function draw() {
  if (gameState === 'cutscene') {
    drawCutscene();
  } else if (gameState === 'playing') {
    image(backgroundImage, 0, 0, width, height);
    player.show();

    if (frameCount % 50 === 0) {
      let randomIndex = floor(random(3));
      let fallingObject;

      switch (randomIndex) {
        case 0:
          fallingObject = new FallingObject(strawberryImage, 2.5);
          break;
        case 1:
          fallingObject = new FallingObject(blueberryImage, 3.5);
          break;
        case 2:
          fallingObject = new ZigZagFallingObject(raspberryImage, 1.8);
          break;
        default:
          break;
      }

      objects.push(fallingObject);
    }

    fill(255, 255, 255, 200);
    stroke(0);
    strokeWeight(1);
    rect(5, 5, 100, 30);

    fill(255, 255, 255, 200);
    stroke(0);
    strokeWeight(1);
    rect(width - 80, 5, 75, 30);

    for (let i = objects.length - 1; i >= 0; i--) {
      objects[i].fall(gameSpeed * objects[i].speed);
      objects[i].show();

      if (objects[i].hits(player)) {
        objects.splice(i, 1);
        score++;

        // play splat sound on fruit collision
        splatSound.play();

        if (score % 50 === 0 && score !== 0) {
          gameSpeed += 0.1;
        }
      } else if (objects[i].offScreen()) {
        objects.splice(i, 1);
        lives--;

        if (lives === 0) {
          endGame(false);
        }
      }
    }

    textSize(16);
    fill(0);
    textStyle(BOLD);
    text(`Fruits: ${score}`, 10, 20);
    text(`Lives: ${lives}`, width - 70, 20);

    if (score === 100) {
      gameState = 'cutscene';
      cutsceneImages = winImages.map(image => loadImage(image));
      cutsceneImages.push(loadImage('done.png'));
    }

    if (cutsceneIndex >= cutsceneImages.length) {
      restartGame();
    }
  }
}

function drawCutscene() {
  if (cutsceneImages[cutsceneIndex]) {
    image(cutsceneImages[cutsceneIndex], 0, 0, width, height);
  }
}

function keyPressed() {
  if (keyCode === 32) {
    if (gameState === 'cutscene') {
      cutsceneIndex++;
      if (cutsceneIndex >= cutsceneImages.length) {
        gameState = 'playing';
        cutsceneIndex = 0;
      }
    }
  } else if (keyCode === 82) {
    restartGame();
  }
}

function mouseMoved() {
  if (gameState === 'playing') {
    player.setPosition(mouseX);
  }
}

function endGame(win) {
  noLoop();
  textSize(32);
  fill(0);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  if (win) {
    text('You Win!', width / 2, height / 2);
  } else {
    fill(255, 255, 255, 200);
    stroke(0);
    strokeWeight(1);
    rect(width / 2 - 150, height / 2 - 60, 300, 120);

    fill(0);
    noStroke();
    textSize(24);
    text('You lost too many fruits', width / 2, height / 2 - 20);
    textSize(16);
    text('Press R to Try Again', width / 2, height / 2 + 20);

    textSize(16);
    textStyle(NORMAL);
  }
}

function restartGame() {
  window.location.reload();
}

class Player {
  constructor() {
    this.width = 60;
    this.height = 20;
    this.handleWidth = 15;
    this.handleHeight = 10;
    this.borderThickness = 4;
    this.position = createVector(width / 2 - this.width / 2, height - 20);
  }

  show() {
    fill(139, 69, 19);
    stroke(0);
    strokeWeight(this.borderThickness);
    rect(this.position.x, this.position.y, this.width, this.height);
    rect(this.position.x - this.handleWidth / 2, this.position.y, this.handleWidth, this.handleHeight);
    rect(this.position.x + this.width - this.handleWidth / 2, this.position.y, this.handleWidth, this.handleHeight);
    noStroke();
  }

  setPosition(x) {
    this.position.x = constrain(x - this.width / 2, 0, width - this.width);
  }
}

class FallingObject {
  constructor(image, speed) {
    this.size = 40;
    this.position = createVector(random(width - this.size), 0);
    this.image = image;
    this.speed = speed;
  }

  fall(speed) {
    this.position.y += speed;
  }

  show() {
    image(this.image, this.position.x, this.position.y, this.size, this.size);
  }

  hits(player) {
    return (
      this.position.x < player.position.x + player.width &&
      this.position.x + this.size > player.position.x &&
      this.position.y + this.size > player.position.y
    );
  }

  offScreen() {
    return this.position.y > height;
  }
}

class ZigZagFallingObject extends FallingObject {
  constructor(image, speed) {
    super(image, speed);
    this.direction = random() > 0.5 ? 1 : -1;
    this.zigzagChance = 0.02;
  }

  fall(speed) {
    super.fall(speed);

    if (random() < this.zigzagChance) {
      this.direction *= -1;
    }

    this.position.x += this.direction * 2;
    this.position.x = constrain(this.position.x, 0, width - this.size);
  }
}

function toggleMenu() {
  var dropdownContent = document.getElementById("dropdownContent");
  dropdownContent.style.display === "none" ? dropdownContent.style.display = "block" : dropdownContent.style.display = "none";
}

