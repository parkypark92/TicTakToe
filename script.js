//---------------------------PLAYERS MODULE
const players = (function () {
  let playersAdded = 0;
  let playerOneTurn = true;
  const versesDisplay = document.querySelector(".verses");
  const player = function (inputDisplayClass, inputNameId, nameDisplayClass) {
    return {
      name: "",
      inputDisplay: document.querySelector(inputDisplayClass),
      inputName: document.querySelector(inputNameId),
      nameDisplay: document.querySelector(nameDisplayClass),
      setName: function () {
        this.name = this.inputName.value;
      },
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

  const playerOne = player(
    ".player1-input-display",
    "#player1-input",
    ".player1-name"
  );
  const playerTwo = player(
    ".choose-player2",
    "#player2-input",
    ".player2-name"
  );
  playerOne.nameDisplay.classList.add("hidden");
  playerOne.nameDisplay.classList.add("current-turn");
  playerTwo.nameDisplay.classList.add("hidden");

  function addPlayer() {
    this.setName();
    this.displayName();
    this.toggleHidden();
    if (this === computer.AI) {
      computer.AI.init = true;
    }
    playersAdded++;
    gameBoard.displayBoard(playersAdded);
  }

  function nextPlayerTurn() {
    playerOne.nameDisplay.classList.toggle("current-turn");
    playerTwo.nameDisplay.classList.toggle("current-turn");
    computer.AI.nameDisplay.classList.toggle("current-turn");
    players.playerOneTurn = !players.playerOneTurn;
  }

  function resetPlayers() {
    playerOne.toggleHidden();
    playerTwo.nameDisplay.classList.remove("hidden");
    playerTwo.toggleHidden();
    playersAdded = 0;
    if (!playerOne.nameDisplay.classList.contains("current-turn")) {
      nextPlayerTurn();
    }
  }

  return {
    playerOneTurn,
    playersAdded,
    nextPlayerTurn,
    resetPlayers,
    addPlayer,
    playerOne,
    playerTwo,
    versesDisplay,
  };
})();

// -----------------------------COMPUTER AI MODULE
const computer = (function () {
  const AI = {
    init: false,
    name: "",
    nameDisplay: document.querySelector(".computer-name"),
    setName: function () {
      this.name = "Computer";
    },
    displayName: function () {
      this.nameDisplay.textContent = this.name;
    },
    toggleHidden: function () {
      this.nameDisplay.classList.toggle("hidden");
      players.playerTwo.inputDisplay.classList.toggle("hidden");
    },
  };

  AI.nameDisplay.classList.add("hidden");

  function checkTurn() {
    if (computer.AI.init === false) {
      gameBoard.clickable();
      return;
    } else if (computer.AI.nameDisplay.classList.contains("current-turn")) {
      takeTurn();
    }
  }

  function takeTurn() {
    if (gameBoard.winner) {
      return;
    }
    let availableMoves = gameBoard.gameSquares.filter(
      (item) => item.square.textContent === ""
    );
    let randomNum = function () {
      return Math.floor(Math.random() * availableMoves.length);
    };
    const draw = gameBoard.draw.bind(availableMoves[randomNum()]);
    setTimeout(draw, 1500);
  }

  function resetComputer() {
    AI.nameDisplay.classList.add("hidden");
    AI.init = false;
  }

  return { AI, checkTurn, resetComputer };
})();

//------------------------------GAME BOARD MODULE
const gameBoard = (function () {
  let winner = false;
  const gameplayArea = document.querySelector(".game-play-area");
  gameplayArea.classList.add("hidden");
  const winnerDisplay = document.querySelector(".winner-display");
  winnerDisplay.classList.add("hidden");

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
  const gameSquares = [tl, tc, tr, lc, c, rc, bl, bc, br];

  for (let data of gameSquares) {
    data.square.addEventListener("click", draw.bind(data));
  }

  function draw() {
    if (this.square.textContent !== "" || winner === true) {
      return;
    }
    if (players.playerOneTurn) {
      this.square.textContent = "X";
      this.X = true;
      this.isFilled = true;
      unClickable();
      checkWin("X");
    } else {
      this.square.textContent = "O";
      this.O = true;
      this.isFilled = true;
      clickable();
      checkWin("O");
    }
    players.nextPlayerTurn();
    computer.checkTurn();
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
      } else if (computer.AI.init === true) {
        winnerDisplay.textContent = `Computer WINS!`;
      } else {
        players.playerTwo.hasWon = true;
        winnerDisplay.textContent = `${players.playerTwo.name} WINS!`;
      }
      winner = true;
      winnerDisplay.classList.remove("hidden");
      buttons.playAgain.classList.toggle("hidden");
      players.versesDisplay.classList.add("hidden");
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
      winnerDisplay.classList.remove("hidden");
      players.versesDisplay.classList.add("hidden");
      buttons.playAgain.classList.remove("hidden");
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
    for (let data of gameSquares) {
      data.square.textContent = "";
      data.X = false;
      data.O = false;
      data.isFilled = false;
    }
    winnerDisplay.classList.add("hidden");
    winner = false;
    buttons.playAgain.classList.add("hidden");
    players.versesDisplay.classList.remove("hidden");
    computer.checkTurn();
  }

  function clickable() {
    for (let data of gameBoard.gameSquares) {
      data.square.classList.remove("no-click");
    }
  }

  function unClickable() {
    for (let data of gameBoard.gameSquares) {
      data.square.classList.add("no-click");
    }
  }

  return {
    gameSquares,
    winner,
    draw,
    displayBoard,
    hideBoard,
    clear,
    clickable,
  };
})();

//-----------------------------CONTROLS MODULE
const buttons = (function () {
  const reset = document.querySelector(".reset-button");
  const playAgain = document.querySelector(".play-again-button");
  const join1 = document.querySelector(".add-player-one");
  const join2 = document.querySelector(".add-player-two");
  const playComputer = document.querySelector(".play-computer");

  reset.addEventListener("click", resetGame);
  playAgain.addEventListener("click", gameBoard.clear);
  join1.addEventListener("click", players.addPlayer.bind(players.playerOne));
  join2.addEventListener("click", players.addPlayer.bind(players.playerTwo));
  playComputer.addEventListener("click", players.addPlayer.bind(computer.AI));

  playAgain.classList.add("hidden");

  function resetGame() {
    players.resetPlayers();
    gameBoard.clear();
    gameBoard.hideBoard();
    computer.resetComputer();
  }

  return { playAgain };
})();
