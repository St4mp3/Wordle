class Bruger {
  constructor() {}

  keyPressed() {
    if (gameOver) return;

    if (keyCode === ENTER) {
      score.submitGuess();
      return;
    }

    if (keyCode === BACKSPACE) {
      currentGuess = currentGuess.slice(0, -1);
      return;
    }

    if (currentGuess.length < COLS) {
      const k = key.toLowerCase();
      if (/^[a-zæøå]$/.test(k)) {
        currentGuess += k;
      }
    }
  }
}
