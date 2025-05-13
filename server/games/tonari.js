const random = require('../utils/random');
const polyomino = require("../utils/polyomino");
const Grid = require("../utils/grid").Grid;

const dimension = 5;
const verticalLineCount = dimension * (dimension - 1);
const horizontalLineCount = dimension * (dimension - 1);
let grid = new Grid(5, 5);
let lineSolution = new Array(verticalLineCount + horizontalLineCount).fill(false);

function calculateDivisions()
{
    let divisions = new Map();

    for (let i = 0; i < grid.length(); i++)
    {
        const key = grid.get(i);
        if (!divisions.has(key))
        {
            divisions.set(key, 1);
        }
        else
        {
            divisions.set(key, divisions.get(key)+1);
        }
    }

    return divisions;
}

function getRandomShape(minSize, maxSize)
{
    const randomSizeIndex = random.range(minSize - 1, maxSize);
    const randomShapeIndex = random.range(0, polyomino.getSizeCount(randomSizeIndex));
    return polyomino.getShape(randomSizeIndex, randomShapeIndex);
}

function areDivisionValid(divisions)
{
    for (let [key, value] of  divisions.entries()) 
    {
        if (value > 5)
        {
            return false;
        }
    }

    return true;
}

function generateDailyPuzzle()
{
    let divisions = calculateDivisions();

    let count = 1;
    while (!areDivisionValid(divisions))
    {
        let trimmedPolyomino = [];
        let randomX = 0;
        let randomY = 0;

        let isOverlapping = true;
        let attempts = 0;
        while (isOverlapping && attempts < 100)
        {
            const newPolyomino = getRandomShape(1, 5);
            polyomino.replacePolyominoNumber(newPolyomino.shape, count);
    
            trimmedPolyomino = polyomino.trim(newPolyomino.shape, newPolyomino.size, newPolyomino.size);
            const transpositions = random.range(0, 2);
            const rotations = random.range(0, 4);
            trimmedPolyomino = polyomino.getOrientation(trimmedPolyomino, transpositions, rotations);

            randomX = random.range(0, grid.cols - trimmedPolyomino.width + 1);
            randomY = random.range(0, grid.rows - trimmedPolyomino.height + 1);

            isOverlapping = grid.checkForOverlap(trimmedPolyomino.value, randomX, randomY, trimmedPolyomino.width, trimmedPolyomino.height);
            attempts++;
        }

        if (attempts >= 1000)
        {
            console.log("Error");
        }

        grid.placePolyomino(trimmedPolyomino.value, randomX, randomY, trimmedPolyomino.width, trimmedPolyomino.height);
        grid.log();

        divisions = calculateDivisions()
        count++;
    }

    console.log(divisions);
    grid.log();
}

function startGame(dailySeedPrefix)
{
    const dailySeed = dailySeedPrefix + "_Tonari";
    random.initSeed(dailySeed);
    generateDailyPuzzle();
    console.log("Done");

    return {
        numberGrid: grid.value,
        lineGridSolution: lineSolution
    };
      
}

module.exports = {
    startGame
}

startGame();