const random = require('../utils/random');
const polyomino = require("../utils/polyomino");

let shapeGrid = [0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 
            0, 0, 0, 0, 0, 0, 
            0, 0, 0, 0, 0, 0, 
            0, 0, 0, 0, 0, 0, 
            0, 0, 0, 0, 0, 0 ];

let numberGrid = [0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 
            0, 0, 0, 0, 0, 0, 
            0, 0, 0, 0, 0, 0, 
            0, 0, 0, 0, 0, 0, 
            0, 0, 0, 0, 0, 0 ];

let initialGrid = [0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 
            0, 0, 0, 0, 0, 0, 
            0, 0, 0, 0, 0, 0, 
            0, 0, 0, 0, 0, 0, 
            0, 0, 0, 0, 0, 0 ];

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

function replaceShapeNumber(shape, number)
{
    for (let i = 0; i < shape.length; i++)
    {
        if (shape[i] > 0)
        {
            shape[i] = number;
        }
    }
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

function placeSumomino(sumomino, x, y, width, height)
{
    const gridDimension = Math.sqrt(shapeGrid.length);

    for (let i = 0; i < width; i++) 
    {
        for (let j = 0; j < height; j++) 
        {
            let num = sumomino[i + j * width];
            if (sumomino[i + j * width] > 0)
            {
                shapeGrid[(i+x) + (j+y) * gridDimension] = sumomino[i + j * width];
            }
        }
    }
}

function checkForOverlap(sumomino, x, y, width, height)
{
    const gridDimension = Math.sqrt(shapeGrid.length);

    for (let i = 0; i < width; i++) 
    {
        for (let j = 0; j < height; j++) 
        {
            if (sumomino[i + j * width] > 0 && shapeGrid[(i+x) + (j+y) * gridDimension] > 0)
            {
                return true;
            }
        }
    }

    return false;
}

function getCenterOffset(sumominoLength)
{
    let offsetX = Math.sqrt(shapeGrid.length) / 2 - (Math.sqrt(sumominoLength) / 2);
    let offsetY = offsetX;
    if (offsetX % 1 != 0)
    {
        offsetX = random.rand() >= 0.5 ? Math.floor(offsetX) : Math.ceil(offsetX);
        offsetY = random.rand() >= 0.5 ? Math.floor(offsetY) : Math.ceil(offsetY);
    }

    return {x: offsetX, y: offsetY};
}

function trim(sumomino, width, height)
{
    const dimension = Math.sqrt(sumomino.length);

    let trimRows = [];
    let trimCols = [];
    for (let i = 0; i < dimension; i++) 
    {
        let rowSum = 0;
        for (let j = 0; j < dimension; j++) 
        {
            rowSum += sumomino[j + i * dimension];
        }
        if (rowSum == 0)
        {
            trimRows.push(i);
        }
    }

    for (let j = 0; j < dimension; j++) 
    {
        let colSum = 0;
        for (let i = 0; i < dimension; i++) 
        {
            colSum += sumomino[j + i * dimension];
        }
        if (colSum == 0)
        {
            trimCols.push(j);
        }
    }

    console.log(trimRows);
    console.log(trimCols);

    let res = [];
    for (let i = 0; i < dimension; i++) 
    {
        if (trimRows.includes(i))
        {
            continue;
        }

        for (let j = 0; j < dimension; j++) 
        {
            if (trimCols.includes(j))
            {
                continue;
            }

            res.push(sumomino[j + i * dimension])
        }
    }

    width -= trimCols.length;
    height -= trimRows.length;

    return {
        value: res,
        width: width, 
        height: height
    }
}

function tryPlaceSumominoes(sumominoes)
{
    for (let i = 0; i < sumominoes.length; i++)
    {
        offset = getCenterOffset(sumominoes[i].length);

        let trimmedSumomino = {
            value: sumominoes[i].slice(""),
            width: Math.sqrt(sumominoes[i].length), 
            height: Math.sqrt(sumominoes[i].length)
        }

        getSumominoString(sumominoes[i], Math.sqrt(sumominoes[i].length));

        trimmedSumomino = trim(sumominoes[i], Math.sqrt(sumominoes[i].length), Math.sqrt(sumominoes[i].length));

        getSumominoString(trimmedSumomino.value, trimmedSumomino.width);

        const transpositions = random.range(0, 2);
        const rotations = random.range(0, 4);
        trimmedSumomino = polyomino.getOrientation(trimmedSumomino, transpositions, rotations);

        getSumominoString(trimmedSumomino.value, trimmedSumomino.width);

        if (i > 0)
        {
            const offsetLimitX = Math.sqrt(shapeGrid.length) - trimmedSumomino.width;
            const offsetLimitY = Math.sqrt(shapeGrid.length) - trimmedSumomino.height;
            let isOverlapping = true;
            let count = 0;
            while (isOverlapping && count < 100)
            {
                offset.x = random.range(0, offsetLimitX+1);
                offset.y = random.range(0, offsetLimitY+1);
                isOverlapping = checkForOverlap(trimmedSumomino.value, offset.x, offset.y, trimmedSumomino.width, trimmedSumomino.height);
                count++;
            }

            // Figure out what to actually do here
            if (count >= 100)
            {
                return false;
            }
        }

        placeSumomino(trimmedSumomino.value, offset.x, offset.y, trimmedSumomino.width, trimmedSumomino.height);

        getSumominoString(shapeGrid, Math.sqrt(shapeGrid.length));
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
        replaceShapeNumber(sumominoes[i], i+1);
    }

    shuffle(sumominoes);

    let hasValidGrid = false;
    let attempts = 0;
    while (!hasValidGrid && attempts < 100)
    {
        shapeGrid = [0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 
                0, 0, 0, 0, 0, 0, 
                0, 0, 0, 0, 0, 0, 
                0, 0, 0, 0, 0, 0, 
                0, 0, 0, 0, 0, 0 ];

        attempts++;
        hasValidGrid = tryPlaceSumominoes(sumominoes);
    }

    if (attempts >= 100)
    {
        console.error("Error! No valid puzzle found.");
    }

    numberGrid = shapeGrid.slice("");

    for (let i = 0; i < shapeGrid.length; i++)
    {
        if (shapeGrid[i] > 0)
        {
            numberGrid[i] = numberOrders[shapeGrid[i]-1][currentIndex[shapeGrid[i]-1]];
            initialGrid[i] = shownIndex[shapeGrid[i]-1] == currentIndex[shapeGrid[i]-1] ? numberGrid[i] : -1;
            currentIndex[shapeGrid[i]-1]++;
        }
        else
        {
            numberGrid[i] = 0;
            initialGrid[i] = 0;
        }
    }

    getSumominoString(numberGrid, Math.sqrt(numberGrid.length));
    getSumominoString(initialGrid, Math.sqrt(initialGrid.length));

    const gridDimension = Math.sqrt(shapeGrid.length);
    for (let i = 0; i < gridDimension; i++) 
    {
        for (let j = 0; j < gridDimension; j++) 
        {
            if (numberGrid[j + i * gridDimension] > 0)
            {
                const cellCount = numberGrid[j + i * gridDimension];
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
		initialSumominoes: initialGrid,
		sumominoShapes: shapeGrid,
        solutionSumominoes: numberGrid,
        colHints: colHints,
		rowHints: rowHints
	}
	  
}

module.exports = {
	startGame
}
