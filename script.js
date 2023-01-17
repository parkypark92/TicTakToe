const players = (function () {
  const playerOneInput = document.getElementById("player1");
  playerOneInput.classList.add("current-turn");
  const playerTwoInput = document.getElementById("player2");
  const addPlayerOne = document.querySelector(".add-player-one");
  const addPlayerTwo = document.querySelector(".add-player-two");

  addPlayerOne.addEventListener("click", createFirstPlayer);

  function createFirstPlayer() {
    playerOne = newPlayer(playerOneInput.value);
  }

  addPlayerTwo.addEventListener("click", createSecondPlayer);

  function createSecondPlayer() {
    playerTwo = newPlayer(playerTwoInput.value);
  }

  function togglePlayerTurn() {
    playerOneInput.classList.toggle("current-turn");
    playerTwoInput.classList.toggle("current-turn");
    playerOneTurn = !playerOneTurn;
  }

  return { nextTurn: togglePlayerTurn };
})();

const gameBoard = (function () {
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
    if (playerOneTurn) {
      e.target.textContent = "X";
    } else {
      e.target.textContent = "O";
    }
    players.nextTurn();
  }
})();

let playerOneTurn = true;

const newPlayer = function (name) {
  return { name };
};

let playerOne;
let playerTwo;
