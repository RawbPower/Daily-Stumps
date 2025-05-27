const random = require('../utils/random');
const words = require("../data/common_words");
const Grid = require("../utils/grid").Grid;

let routeGrid = new Grid(5, 5);
let wordGrid = new Grid(5, 5);
let wordList = [];
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
    const wordRoutes = [[startingIndex], [startingIndex], [startingIndex], [startingIndex], [startingIndex]]

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
                wordRoutes[i].push(currentIndex);

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

    const letters = "abcdefghijklmnopqrstuvwxyz";
    const randomLetterIndex = random.rangeInt(0, 26);
    const randomLetter = letters.charAt(randomLetterIndex).toUpperCase();

    for (let i = 0; i < wordSizes.length; i++)
    {
        let letterCount = wordSizes[i];
        let validWord = false;
        while (!validWord)
        {
            const randomWord = words[random.rangeInt(0, words.length)];
            
            const firstLetter = randomWord.charAt(0).toUpperCase();
            if (randomWord.length == letterCount && firstLetter == randomLetter)
            {
                wordList.push(randomWord.toUpperCase());
                validWord = true;
            }
        }
    }

    wordGrid.set(randomLetter,startingIndex);
    for (let i = 0; i < wordRoutes.length; i++)
    {
        for (let j = 1; j < wordRoutes[i].length; j++)
        {
            const routeIndex = wordRoutes[i][j];
            const routeChar = wordList[i].charAt(j);
            wordGrid.set(routeChar, routeIndex);
        }
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
        wordGrid: wordGrid.value,
        intendedSolution: wordList
    };
      
}

module.exports = {
    startGame
}