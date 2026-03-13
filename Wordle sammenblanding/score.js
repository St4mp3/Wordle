class Score {
  constructor() {}

  scoreGuess(guess, answer) {
    let result = Array(COLS).fill("absent");
    let remain = {};

    // Først: rigtige placeringer
    for (let i = 0; i < COLS; i++) {
      if (guess[i] === answer[i]) {
        result[i] = "correct";
      } else {
        remain[answer[i]] = (remain[answer[i]] || 0) + 1;
      }
    }

    // Så: findes bogstavet et andet sted?
    for (let i = 0; i < COLS; i++) {
      if (result[i] === "correct") continue;

      if (remain[guess[i]]) {
        result[i] = "present";
        remain[guess[i]]--;
      }
    }

    return result;
  }
  submitGuess() {
  if (gameOver) return;

  if (currentGuess.length !== 5) {
    statusText = "Du skal skrive 5 bogstaver";
    shakeFrames = 8;
    return;
  }

  const word = currentGuess.toLowerCase();

  if (!wordsSet.has(word)) {
    statusText = "Ikke et gyldigt dansk ord";
    shakeFrames = 8;
    return;
  }

  const result = score.scoreGuess(word, target);

  for (let i = 0; i < COLS; i++) {
    guesses[row][i] = word[i];
    scores[row][i] = result[i];
  }

  if (word === target) {
    statusText = "Rigtigt!";
    gameOver = true;
    return;
  }

  row++;
  currentGuess = "";

  if (row >= ROWS) {
    statusText = "Slut! Ordet var: " + target.toUpperCase();
    gameOver = true;
    return;
  }

  statusText = "Prøv igen";
}

}
