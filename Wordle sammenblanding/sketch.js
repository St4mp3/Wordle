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
  board = new DrawBoard();
  api = new Api();
  score = new Score();
  bruger = new Bruger();

  createCanvas(420, 620);
  textAlign(CENTER, CENTER);
  textFont("Arial");

  board.makeBoard();
  api.wordLists();
}

function draw() {
  background(220);

  board.drawBoard();
  board.text();
}

function keyPressed() {
  bruger.keyPressed();
}
