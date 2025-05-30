const random = require('../utils/random');
const polyomino = require("../utils/polyomino");
const Grid = require("../utils/grid").Grid;

const dimension = 5;
const verticalLineCount = dimension * (dimension - 1);
const horizontalLineCount = dimension * (dimension - 1);
let grid = new Grid(5, 5);
let neighbourGrid = new Grid(5, 5);
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
    const randomSizeIndex = random.rangeInt(minSize - 1, maxSize);
    const randomShapeIndex = random.rangeInt(0, polyomino.getSizeCount(randomSizeIndex));
    return polyomino.getShape(randomSizeIndex, randomShapeIndex);
}

function areDivisionValid(divisions)
{
    // This needs to account for separated groups of 0
    for (let [key, value] of  divisions.entries()) 
    {
        if (value > 5)
        {
            return false;
        }
    }

    return true;
}

function getNeighbours(index)
{
    let neighbours = new Array(4);
    neighbours[0] = (index % grid.cols != grid.cols-1) ? grid.get(index+1) : -1;                  // Right
    neighbours[1] = (index % grid.cols != 0) ? grid.get(index-1) : -1;                  // Left
    neighbours[2] = (index > grid.cols - 1) ? grid.get(index-grid.cols) : -1;               // Above
    neighbours[3] = (index < grid.length() - grid.cols) ? grid.get(index+grid.cols) : -1;     // Bottom
    return neighbours;
}

function getNeighbourCount(index)
{
    const neighbours = getNeighbours(index);

    let currentUniqueNeighbours = [];
    for (const n of neighbours)
    {
        if (n < 0)
        {
            continue;
        }

        if (n == grid.get(index))
        {
            continue;
        }

        if (currentUniqueNeighbours.includes(n))
        {
            continue;
        }

        currentUniqueNeighbours.push(n);
    }

    return currentUniqueNeighbours.length;
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
        while (isOverlapping && attempts < 30)
        {
            const newPolyomino = getRandomShape(1, 5);
            polyomino.replacePolyominoNumber(newPolyomino.shape, count);
    
            trimmedPolyomino = polyomino.trim(newPolyomino.shape, newPolyomino.size, newPolyomino.size);
            const transpositions = random.rangeInt(0, 2);
            const rotations = random.rangeInt(0, 4);
            trimmedPolyomino = polyomino.getOrientation(trimmedPolyomino, transpositions, rotations);

            randomX = random.rangeInt(0, grid.cols - trimmedPolyomino.width + 1);
            randomY = random.rangeInt(0, grid.rows - trimmedPolyomino.height + 1);

            isOverlapping = grid.checkForOverlap(trimmedPolyomino.value, randomX, randomY, trimmedPolyomino.width, trimmedPolyomino.height);
            attempts++;
        }

        if (attempts >= 30)
        {
            console.log("Early Out");
            break;
        }

        grid.placePolyomino(trimmedPolyomino.value, randomX, randomY, trimmedPolyomino.width, trimmedPolyomino.height);
        grid.log();

        divisions = calculateDivisions()
        count++;
    }

    console.log(divisions);
    grid.log();

    let currentNumber = count;

    // Fill in zero with unique numbers
    for (let i = 0; i < grid.length(); i++)
    {
        if (grid.get(i) == 0)
        {
            const neighbours = getNeighbours(i);
            let foundValidNeighbour = false;
            for (const n of neighbours)
            {
                if (n >= count)
                {
                    grid.set(n, i);
                    foundValidNeighbour = true;
                    break;
                }
            }

            if (!foundValidNeighbour)
            {
                grid.set(currentNumber, i);
                currentNumber++;
            }
        }
    }

    grid.log();

    let rightNeighbourCount = 0;
    let bottomNeighbourCount = 0;
    for (let i = 0; i < grid.length(); i++)
    {
        neighbourGrid.set(getNeighbourCount(i), i);

        // Check neighbours for lines
        const neighbours = getNeighbours(i);

        // Check right
        const rightNeighbour = neighbours[0];
        if (rightNeighbour > 0)
        {
            if (rightNeighbour != grid.get(i))
            {
                lineSolution[rightNeighbourCount] = true;
            }
            rightNeighbourCount++;
        }

        // Check bottom
        const bottomNeighbour = neighbours[3];
        if (bottomNeighbour > 0)
        {
            if (bottomNeighbour != grid.get(i))
            {
                lineSolution[verticalLineCount + bottomNeighbourCount] = true;
            }
            bottomNeighbourCount++;
        }
    }

    console.log(lineSolution);

    neighbourGrid.log();
}

function startGame(dailySeedPrefix)
{
    const dailySeed = dailySeedPrefix + "_Tonari";
    random.initSeed(dailySeed);
    generateDailyPuzzle();
    console.log("Done");

    return {
        numberGrid: neighbourGrid.value,
        lineGridSolution: lineSolution
    };
      
}

module.exports = {
    startGame
}