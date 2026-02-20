// Simple grid: 6 rows, 5 squares per row
const COLS = 5;
const ROWS = 6;
const SIZE = 64;
const GAP = 10;

// store letters later (for Wordle)
let letters = [];

function setup() {
  createCanvas(400, 600);

  // make empty 2D array
  for (let r = 0; r < ROWS; r++) {
    letters[r] = [];
    for (let c = 0; c < COLS; c++) {
      letters[r][c] = "";
    }
  }
}

function draw() {
  background(220);

  let startX = 20;
  let startY = 80;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      let x = startX + c * (SIZE + GAP);
      let y = startY + r * (SIZE + GAP);

      rect(x, y, SIZE, SIZE);

      // draw letter if there is one
      let letter = letters[r][c];
      if (letter !== "") {
        textAlign(CENTER, CENTER);
        textSize(32);
        text(letter, x + SIZE/2, y + SIZE/2);
      }
    }
  }
}
