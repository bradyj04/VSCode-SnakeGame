//import Vibrant from '/node_modules/node-vibrant/dist/vibrant.js';
//const colors = await Vibrant.from('./nft.jpg').getPalette();
document.getElementById('nftimage').onload = getImageColor();
function getImageColor() {
    var canvas = document.getElementById('img-canvas');
    var ctx = canvas.getContext("2d");
    var img = document.getElementById('nftimage');
    ctx.drawImage(img, 0, 0);
    var imgData = ctx.getImageData(0, 0, 1, 1);
    console.log(imgData);
    console.log(imgData.data);
}
document.getElementById('nftimage').setAttribute('src', 'nft.jpg');

function rnd(m) {
    let x = Math.random() * m;
    return x - (x % 1);
  }

  class Graphics {
    constructor(canvas) {
      this.context = canvas.getContext('2d');
      this.preferences = {
        bgSize: 441,
        bgColor: 'rgb(0,0,0)',
        snakeColor: 'rgb(255, 255, 200)',
        foodColor: 'rgb(255, 0, 200)',
      };
      this.context.fillStyle = this.preferences.bgColor;
      this.context.fillRect(
        0,
        0,
        this.preferences.bgSize,
        this.preferences.bgSize
      );
    }

    drawSquare(x, y, color) {
      this.context.fillStyle = color;
      this.context.fillRect(x * 11 + 1, y * 11 + 1, 10, 10);
    }

    drawFood(x, y) {
      this.drawSquare(x, y, this.preferences.foodColor);
    }

    drawSnake(snake) {
      snake.forEach(({ x, y }) =>
        this.drawSquare(x, y, this.preferences.snakeColor)
      );
    }

    drawGameArea() {
      this.context.fillStyle = this.preferences.bgColor;
      this.context.fillRect(
        0,
        0,
        this.preferences.bgSize,
        this.preferences.bgSize
      );
    }

    drawPauseScreen() {
      this.context.fillStyle = 'rgb(0,0,0)';
      this.context.fillRect(0, 0, 441, 441);
      this.context.fillStyle = 'rgb(255,255,255)';
      this.context.font = 'bold 20px sans-serif';
      this.context.fillText('Pause. Press spacebar', 110, 220);
    }
  }

  function loadGame() {
    let gfx = new Graphics(document.getElementById('game')),
      food,
      snake = [],
      direction = rnd(4),
      canChangeDirection = true,
      game = {};

    //spawns food and snake
    food = {
      x: rnd(40),
      y: rnd(40),
    };
    do {
      console.log('spawning snake...');
      snake.pop();
      snake.unshift({
        x: rnd(40),
        y: rnd(40),
      });
    } while (snake[0].x === food.x && snake[0].y === food.y);

    game.score = 0;
    game.isRunning = false;

    game.draw = function () {
      gfx.drawGameArea();
      gfx.drawFood(food.x, food.y);
      gfx.drawSnake(snake);
    };

    game.update = function () {
      canChangeDirection = true;
      const [{ x, y }, ...tail] = snake;
      switch (direction) {
        case 0:
          snake.unshift({ x: x - 1, y });
          break;
        case 1:
          snake.unshift({ x, y: y - 1 });
          break;
        case 2:
          snake.unshift({ x: x + 1, y });
          break;
        case 3:
          snake.unshift({ x, y: y + 1 });
          break;
        default:
          break;
      }

      if (x !== food.x || y !== food.y) {
        snake.pop();
      } else {
        game.score += 100;
        food = {
          x: rnd(40),
          y: rnd(40),
        };
      }
      tail.forEach(({ xi, yi }) => {
        if (x === xi && y === yi) clearInterval(game.intervalId);
      });

      if (x === 40 || x === -1 || y === 40 || y === -1) {
        clearInterval(game.intervalId);
      }
    };
    game.run = function () {
      if (game.isRunning) {
        game.update();
        game.draw();
      } else {
        gfx.drawPauseScreen();
      }
      document.getElementById('score').innerHTML = 'Score: ' + game.score;
    };
    //starts game
    game.intervalId = setInterval(game.run, 1000 / 9);
    document.onkeydown = function (e) {
      let code = e.keyCode - 37;
      if (code === -5) {
        console.log('pressed -> space bar');
        game.isRunning = !game.isRunning;
      }
      if (0 <= code && code <= 3) {
        // case a cobra tenha mais de 1 nó, ela não pode voltar. Por isso o uso de Math.abs.
        if (
          Math.abs(code - direction) !== 2 &&
          snake.length !== 1 &&
          canChangeDirection
        ) {
          direction = code;
        } else if (snake.length === 1) {
          direction = code;
        }
        canChangeDirection = false;
      }
    };
  }
  window.onload = loadGame;