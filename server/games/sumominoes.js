const random = require('../utils/random');
const polyomino = require("../utils/polyomino");
const Grid = require("../utils/grid").Grid;

let shapeGrid = new Grid(6, 6);

let numberGrid = new Grid(6, 6);

let initialGrid = new Grid(6, 6);

const rowHints = [0, 0, 0, 0, 0, 0];
const colHints = [0, 0, 0, 0, 0, 0];

function getRandomShape(minSize, maxSize)
{
    const randomSizeIndex = random.range(minSize - 1, maxSize);
    const randomShapeIndex = random.range(0, polyomino.getSizeCount(randomSizeIndex));
    return polyomino.getShape(randomSizeIndex, randomShapeIndex);
}

function range(lower, upper)
{
    let res = []
    for (let i = lower; i <= upper; i++)
    {
        res.push(i);
    }

    return res;
}

function shuffle(array) 
{
    let currentIndex = array.length;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) 
    {
  
      // Pick a remaining element...
      let randomIndex = random.range(0, currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
}

function getSumominoString(shape, width)
{
    let sumominoString = "";
    for (let i = 0; i < shape.length; i++)
    {
        sumominoString += shape[i] + ", ";
        if (i % width == width - 1)
        {
            sumominoString += "\n";
        }
    }

    console.log(sumominoString);
}

function getCenterOffset(sumominoLength)
{
    let offsetX = shapeGrid.cols / 2 - (Math.sqrt(sumominoLength) / 2);
    let offsetY = shapeGrid.rows / 2 - (Math.sqrt(sumominoLength) / 2);
    if (offsetX % 1 != 0)
    {
        offsetX = random.rand() >= 0.5 ? Math.floor(offsetX) : Math.ceil(offsetX);
        offsetY = random.rand() >= 0.5 ? Math.floor(offsetY) : Math.ceil(offsetY);
    }

    return {x: offsetX, y: offsetY};
}

function tryPlaceSumominoes(sumominoes)
{
    for (let i = 0; i < sumominoes.length; i++)
    {
        getSumominoString(sumominoes[i], Math.sqrt(sumominoes[i].length));

        trimmedSumomino = polyomino.trim(sumominoes[i].slice(""), Math.sqrt(sumominoes[i].length), Math.sqrt(sumominoes[i].length));

        getSumominoString(trimmedSumomino.value, trimmedSumomino.width);

        const transpositions = random.range(0, 2);
        const rotations = random.range(0, 4);
        trimmedSumomino = polyomino.getOrientation(trimmedSumomino, transpositions, rotations);

        getSumominoString(trimmedSumomino.value, trimmedSumomino.width);

        let offset = getCenterOffset(trimmedSumomino.value.length);

        if (i > 0)
        {
            // Need to check for sumominoes overflowing off side of grid (maybe)
            const offsetLimitX = shapeGrid.cols - trimmedSumomino.width;
            const offsetLimitY = shapeGrid.rows - trimmedSumomino.height;
            let isOverlapping = true;
            let count = 0;
            while (isOverlapping && count < 100)
            {
                offset.x = random.range(0, offsetLimitX+1);
                offset.y = random.range(0, offsetLimitY+1);
                isOverlapping = shapeGrid.checkForOverlap(trimmedSumomino.value, offset.x, offset.y, trimmedSumomino.width, trimmedSumomino.height);
                count++;
            }

            // Figure out what to actually do here
            if (count >= 100)
            {
                return false;
            }
        }

        shapeGrid.placePolyomino(trimmedSumomino.value, offset.x, offset.y, trimmedSumomino.width, trimmedSumomino.height);

        shapeGrid.log();
    }

    return true;
}

function generateDailyPuzzle()
{
    //const sumominoes = [getRandomShape(4, 4), getRandomShape(5, 5), getRandomShape(6, 6), getRandomShape(6, 6), getRandomShape(3, 3)];
    //const numberOrders = [shuffle(range(1,4)), shuffle(range(1,5)), shuffle(range(1,6)), shuffle(range(1,6)), shuffle(range(1,3))];
    const shapesAndSizes = [getRandomShape(3, 6), getRandomShape(3, 6), getRandomShape(3, 6), getRandomShape(3, 6), getRandomShape(3, 6)];
    const sumominoes = [shapesAndSizes[0].shape, shapesAndSizes[1].shape, shapesAndSizes[2].shape, shapesAndSizes[3].shape, shapesAndSizes[4].shape];
    const numberOrders = [shuffle(range(1,shapesAndSizes[0].size)), shuffle(range(1,shapesAndSizes[1].size)), shuffle(range(1,shapesAndSizes[2].size)), shuffle(range(1,shapesAndSizes[3].size)), shuffle(range(1,shapesAndSizes[4].size))];
    let currentIndex = new Array(numberOrders.length).fill(0);
    let shownIndex = [random.range(0, shapesAndSizes[0].size), random.range(0, shapesAndSizes[1].size), random.range(0, shapesAndSizes[2].size), random.range(0, shapesAndSizes[3].size), random.range(0, shapesAndSizes[4].size)]

    for (let i = 0; i < sumominoes.length; i++)
    {
        polyomino.replacePolyominoNumber(sumominoes[i], i+1);
    }

    shuffle(sumominoes);

    let hasValidGrid = false;
    let attempts = 0;
    while (!hasValidGrid && attempts < 100)
    {
        shapeGrid = new Grid(6, 6);

        attempts++;
        hasValidGrid = tryPlaceSumominoes(sumominoes);
    }

    if (attempts >= 100)
    {
        console.error("Error! No valid puzzle found.");
    }

    numberGrid.set(shapeGrid.get().slice(""));

    for (let i = 0; i < shapeGrid.length(); i++)
    {
        if (shapeGrid.get(i) > 0)
        {
            numberGrid.set(numberOrders[shapeGrid.get(i)-1][currentIndex[shapeGrid.get(i)-1]], i);
            let x = shownIndex[shapeGrid.get(i)-1] == currentIndex[shapeGrid.get(i)-1] ? numberGrid.get(i) : -1;
            initialGrid.set(x, i);
            currentIndex[shapeGrid.get(i)-1]++;
        }
        else
        {
            numberGrid.set(0, i);
            initialGrid.set(0, 1);
        }
    }

    numberGrid.log();
    initialGrid.log();

    for (let i = 0; i < numberGrid.rows; i++) 
    {
        for (let j = 0; j < numberGrid.cols; j++) 
        {
            if (numberGrid.get(i, j) > 0)
            {
                const cellCount = numberGrid.get(i, j);
                colHints[j] += cellCount;
                rowHints[i] += cellCount;
            }
        }
    }

    console.log(colHints);
    console.log(rowHints);
}

function startGame(dailySeedPrefix)
{
    const dailySeed = dailySeedPrefix + "_Sumominoes";
    random.initSeed(dailySeed);
    generateDailyPuzzle();
	console.log("Done");

	return {
		initialSumominoes: initialGrid.get(),
		sumominoShapes: shapeGrid.get(),
        solutionSumominoes: numberGrid.get(),
        colHints: colHints,
		rowHints: rowHints
	}
	  
}

module.exports = {
	startGame
}
