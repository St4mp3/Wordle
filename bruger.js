class Bruger {
  constructor() {}

  keyPressed() {
    //Gør intet
    if (gameOver) return;

    //Send ordet
    if (keyCode === ENTER) {
      score.submitGuess();
      return;
    }

    //Slet bogstavet
    if (keyCode === BACKSPACE) {
      currentGuess = currentGuess.slice(0, -1);
      return;
    }

    //Viser de nuværende bud
    if (currentGuess.length < COLS) {
      const k = key.toLowerCase();
      if (/^[a-zæøå]$/.test(k)) {
        currentGuess += k;
      }
    }
  }
}
