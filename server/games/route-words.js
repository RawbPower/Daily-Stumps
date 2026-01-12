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

function findEmptySectionRecursive(index, searchedCells)
{
    let emptySection = [];
    if (searchedCells.includes(index))
    {
        return emptySection;
    }

    searchedCells.push(index);

    // Exclude starting index
    if (index == (routeGrid.length()-1)/2)
    {
        return emptySection;
    }

    if (routeGrid.get(index) != -1)
    {
        return emptySection;
    }

    emptySection.push(index);
    for (let dir = 0; dir < 8; dir++)
    {
        if (isValidDirection(index, dir))
        {
            const neighbour = getNeighbourInDirection(index, dir);
            const neighbourSection = findEmptySectionRecursive(neighbour, searchedCells);
            emptySection.push.apply(emptySection, neighbourSection);
        }
    }

    return emptySection;
}

function getEmptySections()
{
    let sections = [];
    let searchedCells = [];

    // Depth first search for separate section of unused cells (-1 valued cells)
    for (let i = 0; i < routeGrid.length(); i++)
    {
        let section = findEmptySectionRecursive(i, searchedCells);
        if (section.length > 0)
        {
            sections.push(section);
        }
    }

    return sections;
}

function hasSufficientEmptySections(currentWord, currentRouteIndex, numRemainingLetters, wordSizes)
{
    // If this is the last word then there "should" be sufficient sections
    if (currentWord == wordSizes.length-1)
    {
        return true;
    }

    const sections = getEmptySections();
    let sectionSizes = [];
    for (let i = 0; i < sections.length; i++)
    {
        sectionSizes.push(sections[i].length);
    }

    // Find the largest neighbouring section to the current point
    let largestNeighbouringSection = -1;
    for (let dir = 0; dir < 8; dir++)
    {
        if (isValidDirection(currentRouteIndex, dir))
        {
            const neighbourIndex = getNeighbourInDirection(currentRouteIndex, dir);
            for (let i = 0; i < sections.length; i++)
            {
                if (sections[i].includes(neighbourIndex))
                {
                    if (largestNeighbouringSection < 0)
                    {
                        largestNeighbouringSection = i;
                    }
                    else if (sectionSizes[i] > sectionSizes[largestNeighbouringSection])
                    {
                        largestNeighbouringSection = i;
                    }
                }
            }
        }

        if (largestNeighbouringSection >= 0)
        {
            break;
        }
    }

    // Remove the remaining letter of the current route from the largest neighbouring section
    // This allows us to get the section size once this word has finished
    if (largestNeighbouringSection >= 0)
    {
        sectionSizes[largestNeighbouringSection] -= numRemainingLetters;
    }

    // If the section size dropped to zero from the last step, them remove it
    for (let i = sectionSizes.length - 1; i >= 0; i--) 
    {
        if (sectionSizes[i] == 0) 
        { 
            sectionSizes.splice(i, 1);
        }
    }

    // Find the lowest sections size
    let lowestSectionSize = routeGrid.length();
    for (let i = 0; i < sectionSizes.length; i++) 
    {
        if (sectionSizes[i] < lowestSectionSize)
        {
            lowestSectionSize = sectionSizes[i];
        }
    }

    // Make sure the smallest word can fit into the smallest section
    return lowestSectionSize >= wordSizes[wordSizes.length-1] - 1;
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
            let failedDirections = 0;
            for (let dir = 0; dir < 8; dir++)
            {
                if (!isValidDirection(currentIndex, direction))
                {
                    direction = (direction) % 8 + 1;
                    failedDirections++;
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

                const numRemainingLetters = letterCount - letter - 1;
                if (!hasSufficientEmptySections(i, neighbourIndex, numRemainingLetters, wordSizes))
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

            if (failedDirections == 8)
            {
                console.log("Route Failed");
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

    // Fill with dashes to denote if a cell was not set
    for (let i = 0; i < wordGrid.cols * wordGrid.rows; i++)
    {
        wordGrid.set('-', i);
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