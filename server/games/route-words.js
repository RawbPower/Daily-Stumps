const random = require('../utils/random');
const Grid = require("../utils/grid").Grid;

let routeGrid = new Grid(5, 5);

function isValidDirection(index, direction)
{
    if (direction == 0)
    {
        return false;
    }

    const neighbour = getNeighbourInDirection(index, direction);
    if (neighbour == -1)
    {
        return false;
    }

    if (routeGrid.get(neighbour) != -1)
    {
        return false;
    }

    return true;
}

function getNeighbourInDirection(index, direction)
{
    if (direction == 1)
    {
        if (index >= 5)
        {
            return index - 5;
        }
        else
        {
            return -1;
        }
    }
    else if (direction == 2)
    {
        if (index >= 5 && index % 5 != 4)
        {
            return index - 5 + 1;
        }
        else
        {
            return -1;
        }
    } 
    else if (direction == 3)
    {
        if (index % 5 != 4)
        {
            return index + 1;
        }
        else
        {
            return -1;
        }
    } 
    else if (direction == 4)
    {
        if (index < routeGrid.length() - 5 && index % 5 != 4)
        {
            return index + 5 + 1;
        }
        else
        {
            return -1;
        }
    } 
    else if (direction == 5)
    {
        if (index < routeGrid.length() - 5)
        {
            return index + 5;
        }
        else
        {
            return -1;
        }
    } 
    else if (direction == 6)
    {
        if (index < routeGrid.length() - 5 && index % 5 != 0)
        {
            return index + 5 - 1;
        }
        else
        {
            return -1;
        }
    } 
    else if (direction == 7)
    {
        if (index % 5 != 0)
        {
            return index - 1;
        }
        else
        {
            return -1;
        }
    } 
    else if (direction == 8)
    {
        if (index >= 5 && index % 5 != 0)
        {
            return index - 5 - 1;
        }
        else
        {
            return -1;
        }
    } 
    else
    {
        return index;
    }
}

function isDeadEnd(index)
{
    for (let dir = 0; dir < 8; dir++)
    {
        if (isValidDirection(index, dir+1))
        {
            return false;
        }
    }

    return true;
}

function countDeadEndNeighbours(index)
{
    let count = 0;
    for (let dir = 0; dir < 8; dir++)
    {
        if (!isValidDirection(index, dir+1))
        {
            continue;
        }

        const neighbour = getNeighbourInDirection(index, dir+1);

        if (isDeadEnd(neighbour))
        {
            count++;
        }
    }

    return count;
}

function generateDailyPuzzle()
{
    routeGrid.fill(-1);

    const startingIndex = (routeGrid.length()-1)/2
    routeGrid.set(0, startingIndex);
    routeGrid.log();

    let currentIndex = startingIndex
    const wordSizes = [7, 6, 6, 5, 5];

    for (let i = 0; i < wordSizes.length; i++)
    {
        let letterCount = wordSizes[i];
        for (let letter = 1; letter < letterCount; letter++)
        {
            let direction = random.rangeInt(1, 9);
            for (let dir = 0; dir < 8; dir++)
            {
                if (!isValidDirection(currentIndex, direction))
                {
                    direction = (direction) % 8 + 1;
                    continue;
                }

                const neighbourIndex = getNeighbourInDirection(currentIndex, direction);

                if (countDeadEndNeighbours(currentIndex) > 0 && !isDeadEnd(neighbourIndex))
                {
                    direction = (direction + 1) % 8;
                    continue;
                }

                routeGrid.set(i+1, neighbourIndex);

                const deadEndCount = countDeadEndNeighbours(neighbourIndex);

                if (deadEndCount > 1)
                {
                    routeGrid.set(-1, neighbourIndex);
                    direction = (direction + 1) % 8;
                    continue;
                }

                routeGrid.log();
                currentIndex = neighbourIndex;

                if (deadEndCount == 1 && letter+1 == letterCount)
                {
                    letterCount++;
                    wordSizes[i+1]--;
                }

                break;
            }
        }
        currentIndex = startingIndex;
    }

    routeGrid.log();
}

function startGame(dailySeedPrefix)
{
    const dailySeed = dailySeedPrefix + "_RouteWords";
    random.initSeed(dailySeed);
    generateDailyPuzzle();
    console.log("Done");

    return {
        wordGrid: [
            "I", "D", "E", "V", "L",
            "O", "A", "T", "E", "O", 
            "T", "I", "R", "S", "V", 
            "U", "A", "E", "E", "E", 
            "A", "L", "R", "Q", "U"
        ],
        intendedSolution: ["REQUEST", "REVOLVE", "RADIO", "RITUAL", "REAR"]
    };
      
}

module.exports = {
    startGame
}