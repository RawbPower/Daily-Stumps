const summingCircle = require("./games/summing-circle");
const sumominoes = require("./games/sumominoes");
const tonari = require("./games/tonari");
const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = {
  origin: ["http://localhost:5173"],
};
app.use(cors(corsOptions))

const PORT = process.env.PORT || 8080;

let DailyPuzzleData = new Object();

DailyPuzzleData.RouteWords = {

  wordGrid: [
    "I", "D", "E", "V", "L",
    "O", "A", "T", "E", "O", 
    "T", "I", "R", "S", "V", 
    "U", "A", "E", "E", "E", 
    "A", "L", "R", "Q", "U"
  ],

  intendedSolution: ["REQUEST", "REVOLVE", "RADIO", "RITUAL", "REAR"]
};

DailyPuzzleData.Sequence = {

  word: "CHICKEN",

  initialLetterIndices: [4]
}

DailyPuzzleData.Crossings = {

  islandGrid: [
    false, false, true, true, true, false, false, false, true, false,
    false, false, true, false, false, false, false, true, true, false,
    true, true, true, true, true, true, true, true, true, false,
    false, true, false, true, true, false, false, true, false, false,
    false, true, false, true, false, false ,false, true, true, true,
    true, true, false, true, false, false, true, true, true, false,
    false, true, false, true, true, true, true, false, false , false,
    false, true, true, true, true, false, true, true ,false , false,
    false, false, false, true, true, false, false, true, true, true,
    false, false, false, false, true, false, false, true, false, false
  ],
  rowHints: [-1, -1, 0, 2, 0, 0, -1, -1, 1, -1],
  colHints: [0, -1, 2, -1, -1, -1, -1, 3, -1, 1],

  bridgeSolutionGrid: [
    "", "", "h", "h", "h", "", "", "", "", "",
    "", "", "", "", "", "", "", "h", "h", "",
    "", "", "", "", "", "", "", "", "", "",
    "", "h", "", "", "", "", "", "h", "", "",
    "", "", "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "", "", "",
    "", "", "", "", "", "v", "", "", "" , "",
    "", "", "v", "", "", "", "h", "h" ,"" , "",
    "", "", "", "", "", "", "", "", "", "v",
    "", "", "", "", "h", "", "", "", "", ""
  ]
}

DailyPuzzleData.SummingCircle = {
  initialIcons: ["", "", "5", "=", "", "", "2", "=", "", "+", "", "=", "", "/", "", "=", "", "", "2", "=", "", "+", "", "="],
  iconBar: ["1", "2", "12", "13", "17", "18", "19", "26", "38", "-", "x", "/"],

  solutionIcons: ["18", "-", "5", "=", "13", "x", "2", "=", "26", "+", "12", "=", "38", "/", "19", "=", "2", "/", "2", "=", "1", "+", "17", "="]
}

DailyPuzzleData.Sumominoes = {
  initialSumominoes: [
    0, -1, 0, 5, -1, -1,
    0, -1, 1, -1, 0, -1,
    -1, 4, -1, -1, 0, -1,
    0, -1, -1, -1, -1, -1,
    -1, -1, -1, 1, -1, -1,
    0, 0, -1, 0, 0, -1
  ],
  sumominoShapes: [
    0, 1, 0, 2, 2, 0,
    0, 1, 1, 2, 0, 0,
    3, 3, 1, 2, 0, 0,
    0, 3, 3, 2, 2, 0,
    3, 3, 4, 4, 4, 0,
    0, 0, 4, 0, 0, 0
  ],

  solutionSumominoes: [
    0, 4, 0, 5, 2, 0,
    0, 2, 1, 6, 0, 0,
    5, 4, 3, 3, 0, 0,
    0, 1, 6, 4, 1, 0,
    2, 3, 3, 1, 4, 0,
    0, 0, 2, 0, 0, 0,
  ],

  rowHints: [11, 9, 15, 12, 13, 2],
  colHints:[7, 14, 15, 19, 7, 0]
}

DailyPuzzleData.Tonari = {
  numberGrid: [
    1, 1, 1, 2, 2,
    1, 2, 4, 3, 1, 
    1, 2, 2, 1, 2, 
    0, 2, 2, 1, 2, 
    0, 1, 2, 1, 0 
  ],

  lineGridSolution: [
    true, false, false, true,
    false, true, true, false,
    true, true, false, true,
    false, true, false, true,
    false, true, false, false,

    false, true, true, true, true,
    true, false, true, true, false,
    false, true, false, false, true,
    false, false, true, true, false
  ]
}

const dailySeed = "07052025";
DailyPuzzleData.SummingCircle = summingCircle.startGame(dailySeed);
DailyPuzzleData.Sumominoes = sumominoes.startGame(dailySeed);
DailyPuzzleData.Tonari = tonari.startGame(dailySeed);

app.get("/api", (req, res) => {
    res.json({ puzzleData: DailyPuzzleData });
  });

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});