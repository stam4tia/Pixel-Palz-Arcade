let magic;
let magicImg;
let magicShootImg;
let bullets = [];
let invaders = [];
let invaderImg;
let backgroundImg;
let startScreenImg;
let isShooting = false;

let isGameStarted = false;
let isGameOver = false;

let isMovingUp = false;
let isMovingDown = false;
let isMovingLeft = false;
let isMovingRight = false;

let currentStage = 1;
const maxStages = 6; // updated to include 6 stages
const invaderIncrement = 2;
let stageTextTimer = 100; // timer for displaying stage text

let gameOverImg;
let gameFinishImg;

let laserSound;
let startScreenSound;


let bossInvader;
let pixeloidFont;

let isMuted = true; // audio starts muted


function preload() {
  magicImg = loadImage('/Magic_the_Butterfly/magic.gif');
  magicShootImg = loadImage('/Magic_the_Butterfly/magic_shoot.png');
  invaderImg = loadImage('/Magic_the_Butterfly/moth.gif');
  backgroundImg = loadImage('/Magic_the_Butterfly/stars.gif');
  startScreenImg = loadImage('/Magic_the_Butterfly/MagicStart.gif');
  gameOverImg = loadImage('/Magic_the_Butterfly/MagicGameOver.png');
  gameFinishImg = loadImage('/Magic_the_Butterfly/MagicFinish.gif');

  laserSound = loadSound('/Magic_the_Butterfly/laser.mp3');
  startScreenSound = loadSound('/Magic_the_Butterfly/light.mp3');
  pixeloidFont = loadFont('/Magic_the_Butterfly/PixeloidSans.ttf');

}

function setup() {
  createCanvas(650, 650);



  laserSound.setVolume(0);
  startScreenSound.setVolume(0);


  magic = new Magic();
  initializeInvaders();

}


function toggleMute() {
  if (isMuted) {
    laserSound.setVolume(0.1);
    startScreenSound.setVolume(0.1);
    document.getElementById('muteButton').innerText = 'Mute';
  } else {
    laserSound.setVolume(0);
    startScreenSound.setVolume(0);
    document.getElementById('muteButton').innerText = 'Unmute';
  }
  isMuted = !isMuted;
}


  // add event listener for keydown event
  document.addEventListener('keydown', function(event) {
    if (event.key === 'r') {
      window.location.reload(); // refresh the page when 'R' is pressed
    }
  });


function initializeInvaders() {
  bullets = [];
  invaders = [];

  if (currentStage < 6) {
    // normal stages with default invaders
    const numInvaders = 3 + (currentStage - 1) * invaderIncrement;
    const rows = Math.ceil(numInvaders / 5);
    const rowSpacing = 70;
    const columnSpacing = 100;
    const invaderSpeed = 2 + (currentStage - 1) * 0.5;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < 5; col++) {
        if (invaders.length < numInvaders) {
          const x = columnSpacing * col + 50;
          const y = rowSpacing * row + 50;
          invaders.push(new Invader(x, y, invaderSpeed));
        } else {
          break;
        }
      }
    }
  } else {
    // 6th stage boss invader
    const bossSpeed = 1;
    const bossSize = 80;
    const bossX = random(width - bossSize);
    const bossY = 0;
    const bossHealth = 300; // increased health for the boss invader
    bossInvader = new BossInvader(bossX, bossY, bossSpeed, bossSize, bossHealth);
    invaders.push(bossInvader);
  }
}

function draw() {
  if (!isGameStarted) {
    displayStartScreen();
    if (!startScreenSound.isPlaying()) {
      startScreenSound.loop();
    }
    return;
  }

  textFont(pixeloidFont);

  if (isGameOver) {
    displayGameOver();
    return;
  }

  background(backgroundImg);

  textAlign(LEFT, TOP);
  textSize(20);
  fill(255);
  text(`Wave: ${currentStage}/${maxStages}`, 10, 10);

  if (stageTextTimer > 0) {
    fill(255, 200);
    rect(0, 0, width, height);
    displayStageText();
    stageTextTimer--;
    return;
  }

  if (isMovingUp) {
    magic.move(0, -10);
  }
  if (isMovingLeft) {
    magic.move(-10, 0);
  }
  if (isMovingDown) {
    magic.move(0, 10);
  }
  if (isMovingRight) {
    magic.move(10, 0);
  }

  if (isShooting) {
    image(magicShootImg, magic.x, magic.y, magic.width, magic.height);
  } else {
    image(magicImg, magic.x, magic.y, magic.width, magic.height);
  }

  for (let bullet of bullets) {
    bullet.update();
    bullet.show();
  }

  for (let invader of invaders) {
    invader.update();
    invader.show();

    if (invader.hits(magic)) {
      gameOver();
      return;
    }
  }

  // handle bullet collisions with invaders
  for (let i = bullets.length - 1; i >= 0; i--) {
    for (let j = invaders.length - 1; j >= 0; j--) {
      if (bullets[i].hits(invaders[j])) {
        bullets[i].explode();
        if (invaders[j] instanceof BossInvader) {
          invaders[j].takeDamage(); // reduce boss invader's health
          if (invaders[j].health <= 0) {
            invaders.splice(j, 1); // remove boss invader if health is depleted
          }
        } else {
          invaders.splice(j, 1);
        }
        break;
      }
    }
  }

  for (let i = bullets.length - 1; i >= 0; i--) {
    if (bullets[i].offscreen()) {
      bullets.splice(i, 1);
    }
  }

  if (currentStage === 6 && bossInvader) {
    bossInvader.update();
    bossInvader.show();
  }

  if (invaders.length === 0 && currentStage < maxStages) {
    currentStage++;
    stageTextTimer = 100;
    initializeInvaders();
  } else if (invaders.length === 0 && currentStage === maxStages) {
    gameWon();
  }
}

function keyPressed() {
  if (!isGameStarted) {
    if (keyCode === ENTER) {
      isGameStarted = true;
    }

    userStartAudio();  // ensures audio can be played after interaction

  } else if (!isGameOver) {
    if (keyCode === UP_ARROW || key === 'w') {
      isMovingUp = true;
    } else if (keyCode === LEFT_ARROW || key === 'a') {
      isMovingLeft = true;
    } else if (keyCode === DOWN_ARROW || key === 's') {
      isMovingDown = true;
    } else if (keyCode === RIGHT_ARROW || key === 'd') {
      isMovingRight = true;
    } else if (key === ' ') {
      isShooting = true;
      bullets.push(new Bullet(magic.x + magic.width / 2, magic.y));
      
      laserSound.play();
    }
  }
  if (key === 'r') {
    restartGame();
  }
}

function keyReleased() {
  if (keyCode === UP_ARROW || key === 'w') {
    isMovingUp = false;
  } else if (keyCode === LEFT_ARROW || key === 'a') {
    isMovingLeft = false;
  } else if (keyCode === DOWN_ARROW || key === 's') {
    isMovingDown = false;
  } else if (keyCode === RIGHT_ARROW || key === 'd') {
    isMovingRight = false;
  } else if (key === ' ') {
    isShooting = false;
  }
}

function displayStartScreen() {
  image(startScreenImg, 0, 0, width, height);
}

function displayStageText() {
  textAlign(CENTER);
  textSize(32);
  fill(0);
  text("Wave " + currentStage, width / 2, height / 2);
}

function displayGameOver() {
  background(gameOverImg);
}

function gameWon() {
  background(gameFinishImg);
}

function gameOver() {
  isGameOver = true;
}

function restartGame() {
  isGameOver = false;
  isGameStarted = false;
  currentStage = 1;
  stageTextTimer = 100;
  bullets = [];
  magic = new Magic();
  initializeInvaders();
}

class Magic {
  constructor() {
    this.width = 140;
    this.height = 140;
    this.x = width / 2 - this.width / 2;
    this.y = height - this.height - 10;
  }

  move(xdir, ydir) {
    this.x += xdir;
    this.y += ydir;
    this.x = constrain(this.x, 0, width - this.width);
    this.y = constrain(this.y, 0, height - this.height);
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 4;
    this.speed = 10;
    this.toDelete = false;
    this.hitInvader = false;
  }

  update() {
    this.y -= this.speed;
  }

  show() {
    fill(255, 255, 0);
    ellipse(this.x, this.y, this.r * 2);
  }

  hits(invader) {
    if (invader instanceof BossInvader) {
      let d = dist(this.x, this.y, invader.x + invader.r, invader.y + invader.r);
      if (d < invader.r) {
        return true;
      }
      return false;
    } else {
      let d = dist(this.x, this.y, invader.x + invader.r, invader.y + invader.r);
      if (d < invader.r) {
        this.hitInvader = true;
        return true;
      }
      return false;
    }
  }

  explode() {
    this.toDelete = true;
  }

  offscreen() {
    return this.y < 0;
  }
}

class Invader {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.r = 60; // reduced size for regular invaders
    this.speed = speed;
    this.directionX = 1;
    this.directionY = 1;
  }

  show() {
    image(invaderImg, this.x, this.y, this.r * 2, this.r * 2);
  }

  update() {
    this.x += this.speed * this.directionX;
    this.y += this.speed * this.directionY;

    if (this.x + this.r >= width || this.x <= 0) {
      this.directionX *= -1;
    }

    if (this.y + this.r >= height || this.y <= 0) {
      this.directionY *= -1;
    }
  }

  hits(magic) {
    let d = dist(this.x, this.y, magic.x + magic.width / 2, magic.y + magic.height / 2);
    return d < this.r + magic.width / 2;
  }
}

class BossInvader extends Invader {
  constructor(x, y, speed, size, health) {
    super(x, y, speed);
    this.r = size;
    this.health = health;
    this.maxHealth = health;
  }

  show() {
    super.show();
    // display health bar
    let healthBarWidth = this.r * 2 * (this.health / this.maxHealth);
    fill(255, 0, 0);
    rect(this.x, this.y - 10, this.r * 2, 5); // background
    fill(0, 255, 0);
    rect(this.x, this.y - 10, healthBarWidth, 5); // health bar
  }

  update() {
    this.x += this.speed * this.directionX;
    this.y += this.speed * this.directionY;

    if (this.x + this.r >= width || this.x <= 0) {
      this.directionX *= -1;
    }

    if (this.y + this.r >= height || this.y <= 0) {
      this.directionY *= -1;
    }
  }

  takeDamage() {
    this.health--;
  }
}
