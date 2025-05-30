const random = require('../utils/random');
const Grid = require("../utils/grid").Grid;

const dimension = 10;
let grid = new Grid(dimension, dimension);
let islandGrid = new Grid(dimension, dimension);
let connectionGrid = new Grid(dimension, dimension);
let islandCoords = [];
let islandCount = 0;
let islandTree = null;
let connections = [];
let rowConnectionCount = new Array(dimension).fill(0);
let colConnectionCount = new Array(dimension).fill(0);
let rowHints = new Array(dimension).fill(-1);
let colHints = new Array(dimension).fill(-1);

const downProb = 0.58;

class IslandTreeNode {
    constructor(value) {
        this.value = value;
        this.children = [];
    }
}

function getNeighbourIndices(index)
{
    let neighbours = new Array(4);
    neighbours[0] = (index % grid.cols != grid.cols-1) ? index+1 : -1;                  // Right
    neighbours[1] = (index % grid.cols != 0) ? index-1 : -1;                  // Left
    neighbours[2] = (index > grid.cols - 1) ? index-grid.cols : -1;               // Above
    neighbours[3] = (index < grid.length() - grid.cols) ? index+grid.cols : -1;     // Bottom
    return neighbours;
}

function addIsland(i, value)
{
    let test = islandCoords[value-1];
    islandCoords[value-1].push(i);
    islandGrid.set(value, i);
}

function setAllNeighbours(i, value)
{
    const neighbours = getNeighbourIndices(i);
    for (let n = 0; n < neighbours.length; n++)
    {
        if (neighbours[n] >= 0 && !grid.get(neighbours[n]) && islandGrid.get(neighbours[n]) == 0)
        {
            addIsland(neighbours[n], value);
            setAllNeighbours(neighbours[n], value);
        }
    }
}

function detectIslands()
{
    islandCount = 0;
    for (let i = 0; i < islandGrid.length(); i++)
    {
        if (!grid.get(i) && islandGrid.get(i) == 0)
        {
            islandCount++;
            islandCoords.push([]);
            addIsland(i, islandCount);
            setAllNeighbours(i, islandCount);
        }
    }

    return islandGrid;
}

function getPossibleConnections(islandIndex)
{
    let paths = [];
    for (let i = 0; i < islandCoords[islandIndex-1].length; i++)
    {
        const startIndex = islandCoords[islandIndex-1][i];
        const startCoords = [Math.floor(startIndex/grid.cols), startIndex % grid.cols]
        const directions = [[1,0], [-1,0], [0,1], [0,-1]];
        for (let d = 0; d < directions.length; d++)
        {
            const dir = directions[d];
            let currentCoords = startCoords;
            let isValid = true;
            while (isValid)
            {
                currentCoords = [currentCoords[0] + dir[0], currentCoords[1] + dir[1]];
                if (currentCoords[0] < 0 || currentCoords[1] < 0 || currentCoords[0] >= grid.rows || currentCoords[1] >= grid.cols)
                {
                    isValid = false;
                    break;
                }

                const currentIsland = islandGrid.get(currentCoords[0], currentCoords[1]);
                if (currentIsland == islandIndex)
                {
                    isValid = false;
                    break;
                }

                if (connectionGrid.get(currentCoords[0], currentCoords[1]) != "")
                {
                    isValid = false;
                    break;
                }

                if (currentIsland > 0)
                {
                    paths.push([startIndex, currentCoords[0] * grid.cols + currentCoords[1]]);
                    break;
                }
            }
        }
    }

    return paths;
}

function getPossibleNeighboursFromConnections(connections)
{
    let neighbours = [];

    for (let i = 0; i < connections.length; i++)
    {
        if (!neighbours.includes(islandGrid.get(connections[i][1])))
        {
            neighbours.push(islandGrid.get(connections[i][1]));
        }
    }

    return neighbours;
}

function removeUsedNeighbours(neighbours, rootIsland)
{
    if (neighbours.includes(rootIsland.value))
    {
        neighbours.splice(neighbours.indexOf(rootIsland.value), 1);
    }

    for (let i = 0; i < rootIsland.children.length; i++)
    {
        removeUsedNeighbours(neighbours, rootIsland.children[i]);
    }
}

function getRandomConnectionToNeighbour(connections, neighbour)
{
    let paths = [];

    for (let i = 0; i < connections.length; i++)
    {
        if (neighbour == islandGrid.get(connections[i][1]))
        {
            paths.push(connections[i]);
        }
    }

    return paths[random.rangeInt(0, paths.length)]
}

function addConnection(newConnection)
{
    connections.push(newConnection);
    const startCoords = [Math.floor(newConnection[0]/grid.cols), newConnection[0] % grid.cols];
    const endCoords = [Math.floor(newConnection[1]/grid.cols), newConnection[1] % grid.cols];
    let direction = [0, 0];
    let directionChar = "";
    if (startCoords[0] == endCoords[0])
    {
        directionChar = "h";
        if (startCoords[1] > endCoords[1])
        {
            direction = [0, -1];
        }
        else
        {
            direction = [0, 1];
        }
    }
    else
    {
        directionChar = "v";
        if (startCoords[0] > endCoords[0])
        {
            direction = [-1, 0];
        }
        else
        {
            direction = [1, 0];
        }
    }

    let currentCoords = [startCoords[0] + direction[0], startCoords[1] + direction[1]];
    while (currentCoords[0] != endCoords[0] || currentCoords[1] != endCoords[1])
    {
        connectionGrid.set(directionChar, currentCoords[0], currentCoords[1]);
        currentCoords = [currentCoords[0] + direction[0], currentCoords[1] + direction[1]];
    }
}

function generateDailyPuzzle()
{
    grid.fill(false);
    connectionGrid.fill("");

    const riverSources = [[random.rangeInt(1, 5), 0], [random.rangeInt(5, 9), 9], [0, random.rangeInt(1, 5)], [9, random.rangeInt(5, 9)]];

    for (let source = 0; source < 4; source++)
    {
        let pos = riverSources[source];
        let currentOffset = 0;
        let lastMoveDir = 0;

        while (currentOffset < 10)
        {
            grid.set(true, pos[0], pos[1]);
            const rng = random.rand();
            if (rng < downProb)
            {
                let direction = source % 2 == 0 ? 1 : -1;

                if (source < 2)
                {
                    pos[1] = pos[1] + direction;
                }
                else
                {
                    pos[0] = pos[0] + direction;
                }
                currentOffset++;
                lastMoveDir = 0;
            }
            else
            {
                let direction = 0;
                if (lastMoveDir != 0)
                {
                    if (source < 2)
                    {
                        if ((pos[0] == 9 && lastMoveDir > 0) || (pos[0] == 0 && lastMoveDir < 0))
                        {
                           continue;
                        }
                    }
                    else
                    {
                        if ((pos[1] == 9 && lastMoveDir > 0) || (pos[1] == 0 && lastMoveDir < 0))
                        {
                            continue;
                        }
                    }

                    direction = lastMoveDir;
                }
                else
                {
                    direction = random.rand() > 0.5 ? 1 : -1;
                }

                if (source < 2)
                {
                    if ((pos[0] == 9 && direction > 0) || (pos[0] == 0 && direction < 0))
                    {
                        direction = -direction;
                    }
                    pos[0] = pos[0] + direction;
                }
                else
                {
                    if ((pos[1] == 9 && direction > 0) || (pos[1] == 0 && direction < 0))
                    {
                        direction = -direction;
                    }
                    pos[1] = pos[1] + direction;
                }
                lastMoveDir = direction;
            }
        }
    }

    const islandGrid = detectIslands();

    const rootIsland = new IslandTreeNode(random.rangeInt(1, islandCount+1));
    let connectedIslands = [rootIsland];
    let connectedIslandCount = 1;
    let currentIsland = rootIsland;

    while (connectedIslandCount < islandCount)
    {
        const possibleConnections = getPossibleConnections(currentIsland.value);
        let possibleNeighbours = getPossibleNeighboursFromConnections(possibleConnections);
        removeUsedNeighbours(possibleNeighbours, rootIsland);
        if (possibleNeighbours.length == 0)
        {
            currentIsland = connectedIslands[random.rangeInt(0, connectedIslands.length-1)];
            continue;
        }
        const randomNeighbour = possibleNeighbours[random.rangeInt(0, possibleNeighbours.length)];
        currentIsland.children.push(new IslandTreeNode(randomNeighbour));
        connectedIslands.push(currentIsland.children[currentIsland.children.length-1]);
        const chosenConnection = getRandomConnectionToNeighbour(possibleConnections, randomNeighbour);
        addConnection(chosenConnection);
        connectedIslandCount++;
        currentIsland = connectedIslands[random.rangeInt(0, connectedIslands.length-1)];
    }

    for (let i = 0; i < dimension; i++)
    {
        for (let j = 0; j < dimension; j++)
        {
            if (connectionGrid.get(i,j) != "")
            {
                if (connectionGrid.get(i,j) == "v")
                {
                    if (i > 0 && connectionGrid.get(i-1,j) != "v")
                    {
                        colConnectionCount[j]++;
                    }
                    rowConnectionCount[i]++;
                }      
                else if (connectionGrid.get(i,j) == "h" && j > 0)
                {
                    if (connectionGrid.get(i,j-1) != "h")
                    {
                        rowConnectionCount[i]++;
                    }
                    colConnectionCount[j]++;
                }
            }
        }
    }

    const rowHintCount = 3;
    const colHintCount = 3;
    let nonZeroRows = [];
    let nonZeroCols = [];

    for (let i = 0; i < dimension; i++)
    {
        if (colConnectionCount[i] == 0)
        {
            colHints[i] = 0;
        }
        else
        {
            nonZeroCols.push(i);
        }

        if (rowConnectionCount[i] == 0)
        {
            rowHints[i] = 0;
        }
        else
        {
            nonZeroRows.push(i);
        }
    }

    let prevRandomRow = -10;
    for (let i = 0; i < rowHintCount; i++)
    {
        let randomRow = nonZeroRows[random.rangeInt(0, nonZeroRows.length)];
        while (rowHints[randomRow] > 0 || Math.abs(randomRow - prevRandomRow) <= 1)
        {
            randomRow = nonZeroRows[random.rangeInt(0, nonZeroRows.length)];
        }

        rowHints[randomRow] = rowConnectionCount[randomRow];
        prevRandomRow = randomRow;
    }

    let prevRandomCol = -10;
    for (let i = 0; i < colHintCount; i++)
    {
        let randomCol = nonZeroCols[random.rangeInt(0, nonZeroCols.length)];
        while (colHints[randomCol] > 0 || Math.abs(randomCol - prevRandomCol) <= 1)
        {
            randomCol = nonZeroCols[random.rangeInt(0, nonZeroCols.length)];
        }

        colHints[randomCol] = colConnectionCount[randomCol];
        prevRandomCol = randomCol;
    }

    islandGrid.log();
}

function startGame(dailySeedPrefix)
{
    const dailySeed = dailySeedPrefix + "_Crossings";
    random.initSeed(dailySeed);
    generateDailyPuzzle();
    console.log("Done");

    return {
        islandGrid: grid.value,
        rowHints: rowHints,
        colHints: colHints,
        bridgeSolutionGrid: connectionGrid.value
    };
      
}

module.exports = {
    startGame
}