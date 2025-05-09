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

module.exports = {
	getShape,
    getSizeCount,
    transpose,
    rotate,
    getOrientation
}