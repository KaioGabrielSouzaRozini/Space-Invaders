const canvas = document.getElementById("space");
let gameOver = document.getElementById("gameover");

const pincel = canvas.getContext("2d");

document.body.addEventListener("keydown", (key) => {
  drive(key);
});

class Player {
  constructor(x, y, size) {
    (this.x = x),
      (this.y = y),
      (this.size = size),
      (this.recharge = true),
      (this.rechargeTime = 800),
      (this.shoots = []);
  }
}

class Enemy {
  constructor(name, x, y, sizeX, sizeY) {
    (this.name = name),
      (this.x = x),
      (this.y = y),
      (this.sizeX = sizeX),
      (this.sizeY = sizeY),
      (this.side = true);
  }
}

let level = 4;
let player = new Player(285, 550, 30);

let enemys = [
  new Enemy(0, 20, 100, 60, 30),
  new Enemy(1, 100, 100, 60, 30),
  new Enemy(2, 180, 100, 60, 30),
];

function drive(key) {
  switch (key.key) {
    case "ArrowRight":
      if (player.x < 540) {
        player.x += 20;
      }
      break;
    case "ArrowLeft":
      if (player.x > 40) {
        player.x -= 20;
      }
      break;
    case "a":
      if (player.recharge) {
        player.shoots.push({ x: player.x, y: player.y });
        shootDaley();
      }
      break;
  }
}

function shootDaley() {
  player.recharge = false;

  setTimeout(() => {
    player.recharge = true;
  }, player.rechargeTime);
}

function addLevel() {
  let positionX = 0;
  let positionY = 100;
  for (var i = 0; i < level; i++) {
    if (positionX > 400) {
      positionX = 0;
      positionY += 45;
    }
    enemys.push(new Enemy(i, positionX + 80, positionY, 60, 30));
    positionX += 80;
  }

  level += 2;
  if (level == 20) {
    player.rechargeTime = 500;
  }
  if (level == 40) {
    player.rechargeTime = 250;
  }
}

function drawReact(x, y, sizeX, sizeY, color) {
  pincel.fillStyle = color;
  pincel.fillRect(x, y, sizeX, sizeY);
}

function update() {
  drawReact(0, 0, 600, 800, "black");
  for (var i = 0; i < enemys.length; i++) {
    if (enemys[i].x == player.x && enemys[i].y == player.y) {
      gameOver.innerText = "Game Over";
      clearInterval(interval);
    }
  }

  player.shoots.forEach((v) => {
    enemys.forEach((j) => {
      if (v.y == j.y && v.x >= j.x - 20 && v.x <= j.x + 60) {
        player.shoots.shift();
        let index = enemys.indexOf(j);
        enemys.splice(index, 1);
      }
    });
  });

  if (enemys.length == 0) {
    addLevel();
  }
}

function draw() {
  drawReact(player.x, player.y, player.size, player.size, "greenyellow");

  for (var i = 0; i < enemys.length; i++) {
    drawReact(
      enemys[i].x,
      enemys[i].y,
      enemys[i].sizeX,
      enemys[i].sizeY,
      "red"
    );
    if (enemys[i].side == true) {
      enemys[i].x += 5;
      if (enemys[i].x == 540) {
        enemys[i].side = false;
        enemys[i].y += 45;
      }
    } else if (enemys[i].side == false) {
      enemys[i].x -= 5;
      if (enemys[i].x == 0) {
        enemys[i].side = true;
        enemys[i].y += 45;
      }
    }
  }

  for (var i = 0; i < player.shoots.length; i++) {
    drawReact(
      player.shoots[i].x + 9,
      player.shoots[i].y,
      player.size - 15,
      player.size,
      "greenyellow"
    );
    player.shoots[i].y -= 15;
    if (player.shoots[i].y < 0) {
      player.shoots.shift();
    }
  }
}

function game() {
  update();
  draw();
}

function gameLoop() {
  interval = setInterval(game, 1000 / 60);
}
gameLoop();
