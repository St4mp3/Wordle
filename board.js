class DrawBoard {
  constructor() {}
  drawBoard() {
    let startX = 20;
    let startY = 130;

    let offsetX = 0;
    if (shakeFrames > 0) {
      offsetX = random(-6, 6);
      shakeFrames--;
    }

    // vis currentGuess i aktiv række
    if (!gameOver && row < ROWS) {
      for (let i = 0; i < COLS; i++) {
        if (i < currentGuess.length) {
          guesses[row][i] = currentGuess[i];
        } else if (scores[row][i] === "") {
          guesses[row][i] = "";
        }
      }
    }

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        let x = startX + c * (SIZE + GAP) + offsetX;
        let y = startY + r * (SIZE + GAP);

        let letter = guesses[r][c];
        let score = scores[r][c];

        strokeWeight(2);

        // simpelt design som kode 1, men med Wordle-farver
        if (score === "correct") {
          fill(46, 204, 113);
          stroke(46, 204, 113);
        } else if (score === "present") {
          fill(241, 196, 15);
          stroke(241, 196, 15);
        } else if (score === "absent") {
          fill(149, 165, 166);
          stroke(149, 165, 166);
        } else {
          fill(255);
          stroke(180);
        }

        rect(x, y, SIZE, SIZE);

        if (letter !== "") {
          if (score === "present") {
            fill(20);
          } else if (score === "correct" || score === "absent") {
            fill(255);
          } else {
            fill(20);
          }

          noStroke();
          textSize(32);
          textStyle(BOLD);
          text(letter.toUpperCase(), x + SIZE / 2, y + SIZE / 2);
        }
      }
    }
  }

  text() {
    fill(20);
    noStroke();
    textSize(28);
    textStyle(BOLD);
    text("Dansk Wordle", width / 2, 35);

    fill(40);
    textSize(18);
    text(statusText, width / 2, 95);
  }

  makeBoard() {
    guesses = [];
    scores = [];

    for (let r = 0; r < ROWS; r++) {
      guesses[r] = [];
      scores[r] = [];
      for (let c = 0; c < COLS; c++) {
        guesses[r][c] = "";
        scores[r][c] = "";
      }
    }
  }

  startGame() {
    row = 0;
    gameOver = false;
    currentGuess = "";
    shakeFrames = 0;

    board.makeBoard();

    if (words5.length > 0) {
      target = random(words5);
      statusText = "Gæt et dansk ord";
      console.log("Target word:", target);
    }
  }
}
