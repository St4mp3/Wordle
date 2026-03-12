const WORDLIST_URL =
  "https://raw.githubusercontent.com/fraabye/Danish-wordlists/master/20200419-Danish-words.txt";

const FREQ_URL =
  "https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2016/da/da_50k.txt";

// Design fra kode 1
const COLS = 5;
const ROWS = 6;
const SIZE = 64;
const GAP = 10;

let words5 = [];
let wordsSet = new Set();
let target = "";

let currentGuess = "";
let row = 0;
let gameOver = false;
let statusText = "Loader...";

let guesses = [];
let scores = [];

let shakeFrames = 0;

function setup() {
  createCanvas(420, 620);
  textAlign(CENTER, CENTER);
  textFont("Arial");

  resetBoard();
  loadWordLists();
}

function draw() {
  background(220);

  drawTitle();
  drawStatus();
  drawBoard();
  drawInputInfo();
}

function drawTitle() {
  fill(20);
  noStroke();
  textSize(28);
  textStyle(BOLD);
  text("Dansk Wordle", width / 2, 35);

  textSize(16);
  textStyle(NORMAL);
  text("(5 bogstaver)", width / 2, 60);
}

function drawStatus() {
  fill(40);
  textSize(18);
  text(statusText, width / 2, 95);
}

function drawBoard() {
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

function drawInputInfo() {
  fill(60);
  textSize(16);
  textStyle(NORMAL);
  text("Skriv dit gæt og tryk ENTER", width / 2, 580);
  textSize(14);
  text("Backspace sletter", width / 2, 600);
}

async function loadWordLists() {
  statusText = "Henter danske ordlister...";

  try {
    const [wRes, fRes] = await Promise.all([
      fetch(WORDLIST_URL),
      fetch(FREQ_URL),
    ]);

    const [wText, fText] = await Promise.all([wRes.text(), fRes.text()]);

    const freq = new Set();
    for (const line of fText.split("\n")) {
      const w = line.trim().split(/\s+/)[0];
      if (w) freq.add(w.toLowerCase());
    }

    const set = new Set();
    const arr = [];

    for (const line of wText.split("\n")) {
      const w = line.trim().toLowerCase();

      if (w.length !== 5) continue;
      if (!/^[a-zæøå]+$/.test(w)) continue;
      if (!freq.has(w)) continue;

      if (!set.has(w)) {
        set.add(w);
        arr.push(w);
      }
    }

    words5 = arr;
    wordsSet = set;

    statusText = "Klar: " + words5.length + " danske ord";
    startGame();
  } catch (err) {
    console.error(err);
    statusText = "Fejl ved hentning af ordlister";
  }
}

function resetBoard() {
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

function startGame() {
  row = 0;
  gameOver = false;
  currentGuess = "";
  shakeFrames = 0;

  resetBoard();

  if (words5.length > 0) {
    target = random(words5);
    statusText = "Gæt et dansk ord";
    console.log("Target word:", target);
  }
}

function scoreGuess(guess, answer) {
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

function submitGuess() {
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

  const result = scoreGuess(word, target);

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

function keyPressed() {
  if (gameOver) return;

  if (keyCode === ENTER) {
    submitGuess();
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
