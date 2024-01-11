//Snake go Here
//Original code project is built from found here:
//https://www.freecodecamp.org/news/how-to-build-a-snake-game-in-javascript/

let grid = document.querySelector(".grid");
let popup = document.querySelector(".popup");
let playAgain = document.querySelector(".playAgain");
let scoreDisplay = document.querySelector(".scoreDisplay");
let topScoreDisplay = document.querySelector(".topScoreDisplay");
let left = document.querySelector(".left");
let bottom = document.querySelector(".bottom");
let right = document.querySelector(".right");
let up = document.querySelector(".top");
let boardWidth = 10;
let currentIndex = 0;
let appleIndex = 0;
let bombIndex = 0;
let forbiddenBomb = [1,8,10,19,80,91,89,98];
let currentSnake = [2, 1, 0]; //The snake with positions labelled from 1 to 100
let direction = 1;
let score = 0;
let topScore = 0;
let speed = 0.8;
let intervalTime = 0;
let interval = 0;

//Waits for the HTML doc to be completely parsed before running the game
document.addEventListener("DOMContentLoaded", function() {
    document.addEventListener("keyup", control);
    createBoard();
    startGame();
    playAgain.addEventListener("click", replay);
  });

  //Creates the 10*10 grid that snake will be played on
  function createBoard() {
    popup.style.display = "none";
    for (let i = 0; i < 100; i++) {
      let div = document.createElement("div");
      grid.appendChild(div);
    }
  }
  
  //Starts the game
  function startGame() {
    console.log("Started")
    let squares = document.querySelectorAll(".grid div");
    randomApple(squares);
    //random apple
    direction = 1;
    score = 0;
    scoreDisplay.innerHTML = getScore();
    intervalTime = 1000;
    currentSnake = [2, 1, 0];
    currentIndex = 0;
    currentSnake.forEach((index) => squares[index].classList.add("snake"));
    interval = setInterval(moveOutcome, intervalTime);
  }
  
  //Computes the snakes movement result
  function moveOutcome() {
    let squares = document.querySelectorAll(".grid div");
    if (checkForHits(squares)) {
      gameover();
    } else {
      checkForPowerUp(squares);
      moveSnake(squares);
    }
  }
  
  function gameover() {
    alert("you hit something");
    topScore = score > topScore ? score : topScore;
    topScoreDisplay.textContent = getTopScore();
    popup.style.display = "flex";
    clearInterval(interval);
  }

  //Moves the snake at increasingly short intervals in the specified direction
  function moveSnake(squares) {
    let tail = currentSnake.pop();
    squares[tail].classList.remove("snake");
    currentSnake.unshift(currentSnake[0] + direction);
    // movement ends here
    eatApple(squares, tail);
    squares[currentSnake[0]].classList.add("snake");
  }
  
  //Checks whether the snake has hit an obstacle
  function checkForHits(squares) {
    if (
      //The snake hits the bottom wall
      (currentSnake[0] + boardWidth >= boardWidth * boardWidth && direction === boardWidth) ||
      //The snake hits the right wall
      (currentSnake[0] % boardWidth === boardWidth - 1 && direction === 1) ||
      //The snake hits the left wall
      (currentSnake[0] % boardWidth === 0 && direction === -1) ||
      //The snake hits the top wall
      (currentSnake[0] - boardWidth+1 <= 0 && direction === -boardWidth) ||
      //The snake Hits itself
      (squares[currentSnake[0] + direction].classList.contains("snake"))
    ) {
      return true;
    } else {
      return false;
    }
  }

  function checkForPowerUp(squares) {
    if (    
      //Snake hits bomb
      squares[currentSnake[0] + direction].classList.contains("bomb")
      ) {
        let tail = currentSnake.pop();
        if (score >= 1)
        {
          console.log(score);
          squares[tail].classList.remove("snake");
          score--;
          scoreDisplay.textContent = getScore();
        } else {
          console.log("score: "+score);
          gameover();
        }
      }
  }
  
  //Checks whether the snake has hit an apple
  function eatApple(squares, tail) {
    if (squares[currentSnake[0]].classList.contains("apple")) {
      squares[currentSnake[0]].classList.remove("apple");
      squares[tail].classList.add("snake");
      currentSnake.push(tail);
      randomApple(squares);
      randomBomb(squares);
      score++;
      scoreDisplay.textContent = getScore();
      clearInterval(interval);
      intervalTime = intervalTime * speed;
      interval = setInterval(moveOutcome, intervalTime);
    }
  }
  
  //Creates a new apple
  function randomApple(squares) {
    do {
      appleIndex = Math.floor(Math.random() * squares.length);
    } while (squares[appleIndex].classList.contains("snake") || 
             squares[appleIndex].classList.contains("bomb"));

    squares[appleIndex].classList.add("apple");
  }

  //Create a bomb
  function randomBomb(squares) {
    do {
      bombIndex = Math.floor(Math.random() * squares.length);
      //Ensure that the block does not appear within the snake or in the forbidden sections
    } while (squares[bombIndex].classList.contains("snake") || 
             squares[bombIndex].classList.contains("apple") ||
             forbiddenBomb.includes(bombIndex))


    squares[bombIndex].classList.add("bomb");
  }
  
  //Computes user input inot snake movement direction
  function control(event)
  {
    switch (event.key) {
      case "ArrowDown":
        direction = +boardWidth; // down the snake head will instantly appear 10 divs below from the current div
        break;
      case "ArrowUp":
        direction = -boardWidth; //if we press the up arrow, the snake will go ten divs up
        break;
      case "ArrowRight":
        direction = 1; // right 
        break;
      case "ArrowLeft":
        direction = -1; // left, the snake will go left one div
        break;
      default:
        return;
    }
  }

  up.addEventListener("click", () => (direction = -boardWidth));
  bottom.addEventListener("click", () => (direction = +boardWidth));
  left.addEventListener("click", () => (direction = -1));
  right.addEventListener("click", () => (direction = 1));

  
  //Template for the Score visuals
  function getScore(){
    return `Score: ${score}`;
  }
  function getTopScore(){
    return `Top Score: ${topScore}`;
  }

  //Allows the player to replay the game
  function replay() {
    console.log("Replay")
    grid.innerHTML = "";
    createBoard();
    startGame();
    popup.style.display = "none";
  }