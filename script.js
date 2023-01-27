//PLAYERS MODULE
const players = (function () {
  const player = function (inputDisplayClass, inputNameId, nameDisplayClass) {
    return {
      name: "",
      inputDisplay: document.querySelector(inputDisplayClass),
      inputName: document.querySelector(inputNameId),
      nameDisplay: document.querySelector(nameDisplayClass),
      displayName: function () {
        this.nameDisplay.textContent = this.name;
      },
      toggleHidden: function () {
        this.nameDisplay.classList.toggle("hidden");
        this.inputDisplay.classList.toggle("hidden");
      },
      hasWon: false,
    };
  };

  let playersAdded = 0;
  let playerOneTurn = true;

  const playerOne = player(
    ".player1-input-display",
    "#player1-input",
    ".player1-name"
  );
  playerOne.nameDisplay.classList.add("hidden");
  playerOne.nameDisplay.classList.add("current-turn");

  const playerTwo = player(
    ".player2-input-display",
    "#player2-input",
    ".player2-name"
  );
  playerTwo.nameDisplay.classList.add("hidden");

  function addPlayer() {
    this.name = this.inputName.value;
    this.displayName();
    this.toggleHidden();
    playersAdded++;
    gameBoard.displayBoard(playersAdded);
  }

  function nextPlayerTurn() {
    playerOne.nameDisplay.classList.toggle("current-turn");
    playerTwo.nameDisplay.classList.toggle("current-turn");
    players.playerOneTurn = !players.playerOneTurn;
  }

  function resetPlayers() {
    playerOne.toggleHidden();
    playerTwo.toggleHidden();
    playersAdded = 0;
  }

  return {
    playerOneTurn,
    playersAdded,
    nextPlayerTurn,
    resetPlayers,
    addPlayer,
    playerOne,
    playerTwo,
  };
})();

//GAME BOARD MODULE
const gameBoard = (function () {
  let winner = false;
  const gameplayArea = document.querySelector(".game-play-area");
  gameplayArea.classList.add("hidden");
  const winnerDisplay = document.querySelector(".winner-display");

  const gameSquare = function (elementID) {
    return {
      square: document.getElementById(elementID),
      X: false,
      O: false,
      isFilled: false,
    };
  };

  const tl = gameSquare("top-left");
  const tc = gameSquare("top-center");
  const tr = gameSquare("top-right");
  const lc = gameSquare("left-center");
  const c = gameSquare("center");
  const rc = gameSquare("right-center");
  const bl = gameSquare("bottom-left");
  const bc = gameSquare("bottom-center");
  const br = gameSquare("bottom-right");

  const gameSquares = [
    [tl, tc, tr],
    [lc, c, rc],
    [bl, bc, br],
  ];

  for (let row of gameSquares) {
    for (let data of row) {
      data.square.addEventListener("click", draw.bind(data));
    }
  }

  function draw() {
    if (this.square.textContent !== "" || winner === true) {
      return;
    }
    if (players.playerOneTurn) {
      this.square.textContent = "X";
      this.X = true;
      this.isFilled = true;
      checkWin("X");
    } else {
      this.square.textContent = "O";
      this.O = true;
      this.isFilled = true;
      checkWin("O");
    }
    players.nextPlayerTurn();
  }

  function checkWin(marker) {
    if (
      (tl[marker] && tc[marker] && tr[marker]) ||
      (lc[marker] && c[marker] && rc[marker]) ||
      (bl[marker] && bc[marker] && br[marker]) ||
      (tl[marker] && lc[marker] && bl[marker]) ||
      (tc[marker] && c[marker] && bc[marker]) ||
      (tr[marker] && rc[marker] && br[marker]) ||
      (tl[marker] && c[marker] && br[marker]) ||
      (tr[marker] && c[marker] && bl[marker])
    ) {
      if (marker === "X") {
        players.playerOne.hasWon = true;
        winnerDisplay.textContent = `${players.playerOne.name} WINS!`;
      } else {
        players.playerTwo.hasWon = true;
        winnerDisplay.textContent = `${players.playerTwo.name} WINS!`;
      }
      winner = true;
    } else if (
      tl.isFilled &&
      tc.isFilled &&
      tr.isFilled &&
      lc.isFilled &&
      c.isFilled &&
      rc.isFilled &&
      bl.isFilled &&
      bc.isFilled &&
      br.isFilled
    ) {
      winnerDisplay.textContent = `It's a TIE!`;
    }
  }

  function displayBoard(numberOfPlayers) {
    if (numberOfPlayers === 2) {
      gameplayArea.classList.toggle("hidden");
    }
  }

  function hideBoard() {
    gameplayArea.classList.toggle("hidden");
  }

  function clear() {
    for (let row of gameSquares) {
      for (let data of row) {
        data.square.textContent = "";
        data.X = false;
        data.O = false;
        data.isFilled = false;
      }
    }
    winnerDisplay.textContent = "";
    winner = false;
  }

  return { displayBoard, hideBoard, clear };
})();

//CONTROLS MODULE
(function () {
  const buttons = {
    init: function () {
      this.cacheDom();
      this.bindEvents();
    },
    cacheDom: function () {
      this.reset = document.querySelector(".reset-button");
      this.playAgain = document.querySelector(".play-again");
      this.join1 = document.querySelector(".add-player-one");
      this.join2 = document.querySelector(".add-player-two");
    },
    bindEvents: function () {
      this.reset.addEventListener("click", resetGame);
      this.playAgain.addEventListener("click", gameBoard.clear);
      this.join1.addEventListener(
        "click",
        players.addPlayer.bind(players.playerOne)
      );
      this.join2.addEventListener(
        "click",
        players.addPlayer.bind(players.playerTwo)
      );
    },
  };

  function resetGame() {
    players.resetPlayers();
    gameBoard.clear();
    gameBoard.hideBoard();
  }

  buttons.init();
})();
