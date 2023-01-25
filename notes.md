//PLAYERS MODULE
const players = (function () {
const player = function (
inputDisplayClass,
inputNameId,
nameDisplayClass,
joinButtonClass
) {
return {
name: "",
inputDisplay: document.querySelector(inputDisplayClass),
inputName: document.querySelector(inputNameId),
nameDisplay: document.querySelector(nameDisplayClass),
displayName: function () {
this.nameDisplay.textContent = this.name;
},
add: document.querySelector(joinButtonClass),
toggleHidden: function () {
this.nameDisplay.classList.toggle("hidden");
this.inputDisplay.classList.toggle("hidden");
},
};
};

let playersAdded = 0;
let playerOneTurn = true;

const playerOne = player(
".first-player",
"#player1-input",
".player1-name",
".add-player-one"
);

playerOne.nameDisplay.classList.add("hidden");
playerOne.nameDisplay.classList.add("current-turn");
playerOne.add.addEventListener("click", addPlayer.bind(playerOne));

const playerTwo = player(
".second-player",
"#player2-input",
".player2-name",
".add-player-two"
);

playerTwo.nameDisplay.classList.add("hidden");
playerTwo.add.addEventListener("click", addPlayer.bind(playerTwo));

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
const gameControls = (function () {
const resetButton = document.querySelector(".reset-button");
resetButton.addEventListener("click", resetGame);

function resetGame() {
players.resetPlayers();
gameBoard.clear();
}
})();
