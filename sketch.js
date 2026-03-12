const WORDLIST_URL =
  "https://raw.githubusercontent.com/fraabye/Danish-wordlists/master/20200419-Danish-words.txt";

const FREQ_URL =
  "https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2016/da/da_50k.txt";

const ROWS = 6;
const COLS = 5;
const CELL_SIZE = 60;
const GAP = 8;

let words5 = [];
let wordsSet = new Set();
let target = "";

let currentGuess = "";
let row = 0;
let gameOver = false;
let statusText = "Loader...";

let guesses = Array(ROWS)
  .fill()
  .map(() => Array(COLS).fill(""));
let scores = Array(ROWS)
  .fill()
  .map(() => Array(COLS).fill(""));

let shakeFrames = 0;

function setup() {
  createCanvas(420, 620);
  textAlign(CENTER, CENTER);
  textFont("Arial");
  loadWordLists();
}

function draw() {
  background(245);

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
  text("Dansk Wordle", width / 2, 40);

  textSize(16);
  textStyle(NORMAL);
  text("(5 bogstaver)", width / 2, 70);
}

function drawStatus() {
  fill(40);
  textSize(18);
  text(statusText, width / 2, 105);
}

function drawBoard() {
  let boardWidth = COLS * CELL_SIZE + (COLS - 1) * GAP;
  let startX = (width - boardWidth) / 2;
  let startY = 140;

  let offsetX = 0;
  if (shakeFrames > 0) {
    offsetX = random(-6, 6);
    shakeFrames--;
  }

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      let x = startX + c * (CELL_SIZE + GAP) + offsetX;
      let y = startY + r * (CELL_SIZE + GAP);

      let letter = guesses[r][c];
      let score = scores[r][c];

      strokeWeight(2);

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
        stroke(200);
      }

      rect(x, y, CELL_SIZE, CELL_SIZE, 8);

      fill(score ? 255 : 20);
      if (score === "present") fill(20);

      noStroke();
      textSize(24);
      textStyle(BOLD);
      text(letter.toUpperCase(), x + CELL_SIZE / 2, y + CELL_SIZE / 2);
    }
  }

  if (!gameOver && row < ROWS) {
    for (let i = 0; i < currentGuess.length; i++) {
      guesses[row][i] = currentGuess[i];
    }
    for (let i = currentGuess.length; i < COLS; i++) {
      guesses[row][i] = "";
    }
  }
}

function drawInputInfo() {
  fill(60);
  textSize(16);
  textStyle(NORMAL);
  text("Skriv dit gæt og tryk ENTER", width / 2, 570);

  textSize(14);
  text("Backspace sletter • R starter nyt spil", width / 2, 600);
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

function startGame() {
  row = 0;
  gameOver = false;
  currentGuess = "";

  guesses = Array(ROWS)
    .fill()
    .map(() => Array(COLS).fill(""));
  scores = Array(ROWS)
    .fill()
    .map(() => Array(COLS).fill(""));

  if (words5.length > 0) {
    target = random(words5);
    statusText = "Gæt et dansk ord";
    console.log("Target word:", target);
  }
}

function scoreGuess(guess, answer) {
  let result = Array(COLS).fill("absent");
  let remain = {};

  for (let i = 0; i < COLS; i++) {
    if (guess[i] === answer[i]) {
      result[i] = "correct";
    } else {
      remain[answer[i]] = (remain[answer[i]] || 0) + 1;
    }
  }

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
    shakeFrames = 8;
    return;
  }

  const word = currentGuess.toLowerCase();

  if (!wordsSet.has(word)) {
    statusText = "❌ Ikke et dansk ord";
    shakeFrames = 8;
    return;
  }

  const result = scoreGuess(word, target);

  for (let i = 0; i < COLS; i++) {
    guesses[row][i] = word[i];
    scores[row][i] = result[i];
  }

  if (word === target) {
    statusText = "🎉 Rigtigt!";
    gameOver = true;
    return;
  }

  row++;
  currentGuess = "";

  if (row >= ROWS) {
    statusText = "Slut! Ordet var: " + target;
    gameOver = true;
    return;
  }

  statusText = "Gæt et dansk ord";
}

function keyPressed() {
  if (key === "r" || key === "R") {
    startGame();
    return;
  }

  if (gameOver) return;

  if (keyCode === ENTER) {
    submitGuess();
    return;
  }

  if (keyCode === BACKSPACE) {
    currentGuess = currentGuess.slice(0, -1);
    return;
  }

  if (currentGuess.length < 5) {
    const k = key.toLowerCase();

    if (/^[a-zæøå]$/.test(k)) {
      currentGuess += k;
    }
  }
}
