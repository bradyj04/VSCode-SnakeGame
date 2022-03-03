function runGame() {
  var imgURL = document.getElementById("nft_url").value;
  //Gets canvas elements for image, not the game
  var canvas = document.getElementById('img-canvas');
  const yCenter = 1/2 * canvas.height;
  var ctx = canvas.getContext("2d");

  //Initializes variables for all color data lists
  var firstColor = [];
  var secondColor = [];
  var thirdColor = [];
  var fourthColor = [];
  var randColorCount = 0;

  var count = 1;

  //creates image that user uploads
  var img = new Image();
  img.src= imgURL;
  img.crossOrigin = "Anonymous";
  img.style.display = "block";

  img.addEventListener("load", makeImage, false);

  function makeImage() {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    //top left center of image
    var firstData = ctx.getImageData(5/12*canvas.width, 1/6*canvas.height, 1, 1);
    //upper center of image
    var secondData = ctx.getImageData(1/2*canvas.width, 1/3*canvas.height, 1, 1);
    //top center of image
    var thirdData = ctx.getImageData(7/12*canvas.width, 1/6*canvas.height, 1, 1);
    //top right center of image
    var fourthData = ctx.getImageData(2/3*canvas.width, 1/6*canvas.height, 1, 1);
    //set all colors equal to RGBA data values on second run of makeImage function
    if (count > 1) {
      //First Color
      firstColor[0] = firstData.data[0];
      firstColor[1] = firstData.data[1];
      firstColor[2] = firstData.data[2];
      firstColor[3] = firstData.data[3];
      //Second Color
      secondColor[0] = secondData.data[0];
      secondColor[1] = secondData.data[1];
      secondColor[2] = secondData.data[2];
      secondColor[3] = secondData.data[3];
      //Third Color
      thirdColor[0] = thirdData.data[0];
      thirdColor[1] = thirdData.data[1];
      thirdColor[2] = thirdData.data[2];
      thirdColor[3] = thirdData.data[3];
      //Fourth Color
      fourthColor[0] = fourthData.data[0];
      fourthColor[1] = fourthData.data[1];
      fourthColor[2] = fourthData.data[2];
      fourthColor[3] = fourthData.data[3];
    }
    count = count + 1;
      
  }

  //Second call of function, sets all colorData varitions to correct data
  makeImage();

  //Randomly picks number 0-3 and sets color to number picked
  //Called when snake eats food and spawns in
  function snakeColor() {
    var randomNumber = Math.floor(Math.random() * 4);
    console.log(randomNumber);
    var color;
    //Creates "delay" between snake color change, keeps previous color for two frames instead of one
    if (randColorCount == 0) {
      //If 0, set color to first color RGBA
      if (randomNumber == 0) {
        color = 'rgba(' + firstColor[0] + ',' + firstColor[1] + ',' + firstColor[2] + ',' + firstColor[3] + ')';
      }
      //If 1, set color to second color RGBA
      else if (randomNumber == 1) {
        color = 'rgba(' + secondColor[0] + ',' + secondColor[1] + ',' + secondColor[2] + ',' + secondColor[3] + ')';
      }
      //If 2, set color to third color RGBA
      else if (randomNumber == 2) {
        color = 'rgba(' + thirdColor[0] + ',' + thirdColor[1] + ',' + thirdColor[2] + ',' + thirdColor[3] + ')';
      }
      //If 3, set color to fourth color RGBA
      else if (randomNumber == 3) {
        color = 'rgba(' + fourthColor[0] + ',' + fourthColor[1] + ',' + fourthColor[2] + ',' + fourthColor[3] + ')';
      }
      //Adds 1 to randColorCount to delay color change
      randColorCount = 1;
      console.log(color);
      //Returns color randomly picked for snake
      return color;
    }else{
      //Changes randColorCount back to 0 to allow color change
      randColorCount = 0;
      //If 0, set color to previous color RGBA
      return color;
    }
  }

  function rnd(m) {
      let x = Math.random() * m;
      return x - (x % 1);
    }

    class Graphics {
      constructor(canvas) {
        this.context = canvas.getContext('2d');
        this.preferences = {
          bgSize: 441,
          bgColor: 'rgb(255,255,255)',
          //Set snake block color
          snakeColor: snakeColor(),
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
          this.drawSquare(x, y, snakeColor())
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
        this.context.fillStyle = 'rgb(255,255,255)';
        this.context.fillRect(0, 0, 441, 441);
        this.context.fillStyle = 'rgb(0,0,0)';
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
    loadGame();
}