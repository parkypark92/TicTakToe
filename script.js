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
    square.addEventListener("click", drawX);
  }

  function drawX(e) {
    e.target.textContent = "X";
    console.log("yo");
  }

  //   return { drawX };
})();

const newPlayer = function (name) {
  return { name };
};
