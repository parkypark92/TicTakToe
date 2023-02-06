//---------------------------PLAYERS MODULE
const players = (function () {
  let playersAdded = 0;
  let playerOneTurn = true;
  let goFirst = true;
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
    players.goFirst = true;
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
    goFirst,
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
    level: "",
  };

  AI.nameDisplay.classList.add("hidden");

  function checkTurn() {
    if (computer.AI.init === false) {
      gameBoard.clickable();
      return;
    } else if (computer.AI.nameDisplay.classList.contains("current-turn")) {
      buttons.reset.disabled = true;
      takeTurn();
    }
  }

  function makeMove(square, moves) {
    const draw = gameBoard.draw.bind(square);
    if (moves.length > 0) {
      setTimeout(draw, 1500);
    }
  }

  function takeTurn() {
    if (gameBoard.finished === true) {
      buttons.reset.disabled = false;
      return;
    }
    const availableMoves = gameBoard.gameSquares.filter(
      (item) => !item.isFilled
    );
    const randomNumber = Math.random();
    const randomSquare = Math.floor(Math.random() * availableMoves.length);
    if (
      (computer.AI.level === "easy" && randomNumber > 0.3) ||
      (computer.AI.level === "hard" && randomNumber > 0.7)
    ) {
      makeMove(availableMoves[randomSquare], availableMoves);
      return;
    }
    const bestMove = minimax(gameBoard.gameSquares, "O");
    makeMove(gameBoard.gameSquares[bestMove.index], availableMoves);
  }

  function minimax(currBrdSt, currMark) {
    const availableSquares = currBrdSt.filter((item) => !item.isFilled);

    if (gameBoard.winState("O")) {
      return { score: 1 };
    } else if (gameBoard.winState("X")) {
      return { score: -1 };
    } else if (availableSquares.length === 0) {
      return { score: 0 };
    }

    const allTestPlays = [];

    for (let i = 0; i < availableSquares.length; i++) {
      let currentTestPlay = {};
      currentTestPlay.index = availableSquares[i].index;
      availableSquares[i][currMark] = true;
      availableSquares[i].isFilled = true;

      if (currMark === "O") {
        let result = minimax(currBrdSt, "X");
        currentTestPlay.score = result.score;
      } else if (currMark === "X") {
        let result = minimax(currBrdSt, "O");
        currentTestPlay.score = result.score;
      }
      availableSquares[i][currMark] = false;
      availableSquares[i].isFilled = false;
      allTestPlays.push(currentTestPlay);
    }

    let bestTestPlay = null;

    if (currMark === "O") {
      let bestScore = -Infinity;
      for (let i = 0; i < allTestPlays.length; i++) {
        if (allTestPlays[i].score > bestScore) {
          bestScore = allTestPlays[i].score;
          bestTestPlay = i;
        }
      }
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < allTestPlays.length; i++) {
        if (allTestPlays[i].score < bestScore) {
          bestScore = allTestPlays[i].score;
          bestTestPlay = i;
        }
      }
    }

    return allTestPlays[bestTestPlay];
  }

  function resetComputer() {
    AI.nameDisplay.classList.add("hidden");
    AI.init = false;
    AI.level = "";
  }

  return { AI, checkTurn, resetComputer };
})();

//------------------------------GAME BOARD MODULE
const gameBoard = (function () {
  let finished = false;
  const gameplayArea = document.querySelector(".game-play-area");
  gameplayArea.classList.add("hidden");
  const winnerDisplay = document.querySelector(".winner-display");
  winnerDisplay.classList.add("hidden");

  const gameSquare = function (elementID, i) {
    return {
      square: document.getElementById(elementID),
      X: false,
      O: false,
      isFilled: false,
      index: i,
    };
  };
  const tl = gameSquare("top-left", 0);
  const tc = gameSquare("top-center", 1);
  const tr = gameSquare("top-right", 2);
  const lc = gameSquare("left-center", 3);
  const c = gameSquare("center", 4);
  const rc = gameSquare("right-center", 5);
  const bl = gameSquare("bottom-left", 6);
  const bc = gameSquare("bottom-center", 7);
  const br = gameSquare("bottom-right", 8);
  const gameSquares = [tl, tc, tr, lc, c, rc, bl, bc, br];

  for (let data of gameSquares) {
    data.square.addEventListener("click", draw.bind(data));
  }

  function draw() {
    if (gameBoard.finished === true || this.square.textContent !== "") {
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
      buttons.reset.disabled = false;
      checkWin("O");
    }
    players.nextPlayerTurn();
    computer.checkTurn();
  }

  function winState(marker) {
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
      return true;
    } else {
      return false;
    }
  }

  function setFinishedState() {
    gameBoard.finished = true;
    players.goFirst = !players.goFirst;
    winnerDisplay.classList.remove("hidden");
    buttons.playAgain.classList.toggle("hidden");
    players.versesDisplay.classList.add("hidden");
  }

  function checkWin(marker) {
    if (winState(marker)) {
      if (marker === "X") {
        winnerDisplay.textContent = `${players.playerOne.name} WINS!`;
      } else if (computer.AI.init === true) {
        winnerDisplay.textContent = `Computer WINS!`;
      } else {
        winnerDisplay.textContent = `${players.playerTwo.name} WINS!`;
      }
      setFinishedState();
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
      setFinishedState();
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
    gameBoard.finished = false;
    buttons.playAgain.classList.add("hidden");
    players.versesDisplay.classList.remove("hidden");
    if (players.goFirst !== players.playerOneTurn) {
      players.nextPlayerTurn();
    }
    if (players.goFirst === true) {
      clickable();
    }
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
    finished,
    draw,
    winState,
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
  const playComputerEasy = document.querySelector(".easy");
  const playComputerHard = document.querySelector(".hard");
  const playComputerUnbeatable = document.querySelector(".unbeatable");

  reset.addEventListener("click", resetGame);
  playAgain.addEventListener("click", gameBoard.clear);
  join1.addEventListener("click", players.addPlayer.bind(players.playerOne));
  join2.addEventListener("click", players.addPlayer.bind(players.playerTwo));
  playComputerEasy.addEventListener(
    "click",
    () => (computer.AI.level = "easy")
  );
  playComputerEasy.addEventListener(
    "click",
    players.addPlayer.bind(computer.AI)
  );
  playComputerHard.addEventListener(
    "click",
    () => (computer.AI.level = "hard")
  );
  playComputerHard.addEventListener(
    "click",
    players.addPlayer.bind(computer.AI)
  );
  playComputerUnbeatable.addEventListener(
    "click",
    players.addPlayer.bind(computer.AI)
  );

  playAgain.classList.add("hidden");

  function resetGame() {
    players.resetPlayers();
    gameBoard.clear();
    gameBoard.hideBoard();
    computer.resetComputer();
  }

  return { playAgain, reset };
})();
