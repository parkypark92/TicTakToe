//PLAYERS MODULE
const players = (function () {
  let playerOne;
  let playerTwo;
  let playersAdded = 0;
  const newPlayer = function (name) {
    return { name };
  };

  let playerOneTurn = true;
  const inputDisplay1 = document.querySelector(".first-player");
  const inputDisplay2 = document.querySelector(".second-player");
  const playerOneName = document.querySelector(".player1-name");
  playerOneName.classList.add("current-turn");
  playerOneName.classList.add("hidden");
  const playerTwoName = document.querySelector(".player2-name");
  playerTwoName.classList.add("hidden");
  const playerOneInput = document.getElementById("player1");
  const playerTwoInput = document.getElementById("player2");
  const addPlayerOne = document.querySelector(".add-player-one");
  const addPlayerTwo = document.querySelector(".add-player-two");

  addPlayerOne.addEventListener("click", createFirstPlayer);

  function createFirstPlayer() {
    playerOne = newPlayer(playerOneInput.value);
    playersAdded++;
    displayPlayerName(playerOneName, playerOneInput, inputDisplay1);
    gameBoard.displayBoard(playersAdded);
    console.log(playerOne);
  }

  addPlayerTwo.addEventListener("click", createSecondPlayer);

  function createSecondPlayer() {
    playerTwo = newPlayer(playerTwoInput.value);
    playersAdded++;
    displayPlayerName(playerTwoName, playerTwoInput, inputDisplay2);
    gameBoard.displayBoard(playersAdded);
    console.log(playerTwo);
  }

  function displayPlayerName(playerName, input, inputDisplay) {
    playerName.textContent = input.value;
    playerName.classList.toggle("hidden");
    inputDisplay.classList.toggle("hidden");
  }

  function nextTurn() {
    playerOneName.classList.toggle("current-turn");
    playerTwoName.classList.toggle("current-turn");
    players.playerOneTurn = !players.playerOneTurn;
  }

  function resetPlayers() {
    playerOne = {};
    playerTwo = {};
    playerOneName.classList.toggle("hidden");
    playerTwoName.classList.toggle("hidden");
    inputDisplay1.classList.toggle("hidden");
    inputDisplay2.classList.toggle("hidden");
    playersAdded = 0;
  }

  return {
    playerOne,
    playerTwo,
    playerOneTurn,
    playersAdded,
    nextTurn,
    resetPlayers,
  };
})();

//GAME BOARD MODULE
const gameBoard = (function () {
  const gameplayArea = document.querySelector(".game-play-area");
  gameplayArea.classList.add("hidden");
  const tl = document.getElementById("top-left");
  const tc = document.getElementById("top-center");
  const tr = document.getElementById("top-right");
  const lc = document.getElementById("left-center");
  const c = document.getElementById("center");
  const rc = document.getElementById("right-center");
  const bl = document.getElementById("bottom-left");
  const bc = document.getElementById("bottom-center");
  const br = document.getElementById("bottom-right");

  const gameSquares = [tl, tc, tr, lc, c, rc, bl, bc, br];

  for (let square of gameSquares) {
    square.addEventListener("click", draw);
  }

  function draw(e) {
    if (e.target.textContent !== "") {
      return;
    }
    if (players.playerOneTurn) {
      e.target.textContent = "X";
    } else {
      e.target.textContent = "O";
    }
    players.nextTurn();
  }

  function displayBoard(numberOfPlayers) {
    if (numberOfPlayers === 2) {
      gameplayArea.classList.toggle("hidden");
    }
  }

  function clear() {
    for (let square of gameSquares) {
      square.textContent = "";
    }
    gameplayArea.classList.toggle("hidden");
  }

  return { displayBoard, clear };
})();

//CONTROLS MODULE
const gameControls = (function () {
  const resetButton = document.querySelector(".reset-button");
  resetButton.addEventListener("click", resetGame);

  function resetGame() {
    players.resetPlayers();
    gameBoard.clear();
  }
})();
