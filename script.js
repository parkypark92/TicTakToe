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
  const gameplayArea = document.querySelector(".game-play-area");
  gameplayArea.classList.add("hidden");
  const tl = { square: document.getElementById("top-left") };
  const tc = { square: document.getElementById("top-center") };
  const tr = { square: document.getElementById("top-right") };
  const lc = { square: document.getElementById("left-center") };
  const c = { square: document.getElementById("center") };
  const rc = { square: document.getElementById("right-center") };
  const bl = { square: document.getElementById("bottom-left") };
  const bc = { square: document.getElementById("bottom-center") };
  const br = { square: document.getElementById("bottom-right") };

  const gameSquares = [
    [tl, tc, tr],
    [lc, c, rc],
    [bl, bc, br],
  ];

  for (let row of gameSquares) {
    for (let data of row) {
      data.square.addEventListener("click", draw);
    }
  }

  function draw() {
    if (this.textContent !== "") {
      return;
    }
    if (players.playerOneTurn) {
      this.textContent = "X";
    } else {
      this.textContent = "O";
    }
    players.nextPlayerTurn();
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
(function () {
  const buttons = {
    init: function () {
      this.cacheDom();
      this.bindEvents();
    },
    cacheDom: function () {
      this.reset = document.querySelector(".reset-button");
      this.join1 = document.querySelector(".add-player-one");
      this.join2 = document.querySelector(".add-player-two");
    },
    bindEvents: function () {
      this.reset.addEventListener("click", resetGame);
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
  }

  buttons.init();
})();
