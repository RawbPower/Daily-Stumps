var shapes = require("../data/polyominoes");

function getShape(sizeIndex, shapeIndex)
{
    return {shape: shapes[sizeIndex][shapeIndex], size: sizeIndex+1};
}

function getSizeCount(sizeIndex)
{
    return shapes[sizeIndex].length;
}

function transpose(polyomino)
{
    const mat = polyomino.value;
    let res = {value: new Array(mat.length), width: polyomino.height, height: polyomino.width};

    for (let i = 0; i < polyomino.width; i++) 
    {
        for (let j = 0; j < polyomino.height; j++) 
        {
            res.value[j + i * res.width] = mat[i + j * polyomino.width];
        }
    }

    return res;
}

function rotate(polyomino)
{
    const mat = polyomino.value;
    let res = {value: new Array(mat.length), width: polyomino.height, height: polyomino.width};

    for (let i = 0; i < polyomino.width; i++) 
    {
        for (let j = 0; j < polyomino.height; j++) 
        {
            res.value[res.width- j - 1 + i * res.width] = mat[i + j * polyomino.width];
        }
    }

    return res;
}

function getOrientation(polyomino, transpositions, rotations)
{
    for (let i = 0; i < transpositions; i++)
    {
        polyomino = transpose(polyomino);
    }

    for (let i = 0; i < rotations; i++)
    {
        polyomino = rotate(polyomino);
    }

    return polyomino;
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

function replacePolyominoNumber(polyomino, number)
{
    for (let i = 0; i < polyomino.length; i++)
    {
        if (polyomino[i] > 0)
        {
            polyomino[i] = number;
        }
    }
}

module.exports = {
	getShape,
    getSizeCount,
    transpose,
    rotate,
    getOrientation,
    trim,
    replacePolyominoNumber
}