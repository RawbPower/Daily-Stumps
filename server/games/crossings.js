const random = require('../utils/random');
const Grid = require("../utils/grid").Grid;

const dimension = 10;
let grid = new Grid(dimension, dimension);
const downProb = 0.58;

function generateDailyPuzzle()
{
    grid.fill(false);

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

        /*for (let i = 0; i < 10; i++)
        {
            if (i <= swapIndex)
            {
                if (source < 2)
                {
                    grid.set(true, start[0], start[1] + i);
                }
                else
                {
                    grid.set(true, start[0] + i, start[1]);
                }
            }

            if (i >= swapIndex)
            {
                if (source < 2)
                {
                    grid.set(true, end[0], start[1] + i);
                }
                else
                {
                    grid.set(true, start[0] + i, end[1]);
                }
            }
        }*/
    }

    console.log(riverSources);
}

function startGame(dailySeedPrefix)
{
    const dailySeed = dailySeedPrefix + "_Crossings";
    random.initSeed(dailySeed);
    generateDailyPuzzle();
    console.log("Done");

    return {
        islandGrid: grid.value,
        rowHints: [-1, -1, 0, 2, 0, 0, -1, -1, 1, -1],
        colHints: [0, -1, 2, -1, -1, -1, -1, 3, -1, 1],
        bridgeSolutionGrid: [
            "", "", "h", "h", "h", "", "", "", "", "",
            "", "", "", "", "", "", "", "h", "h", "",
            "", "", "", "", "", "", "", "", "", "",
            "", "h", "", "", "", "", "", "h", "", "",
            "", "", "", "", "", "", "", "", "", "",
            "", "", "", "", "", "", "", "", "", "",
            "", "", "", "", "", "v", "", "", "" , "",
            "", "", "v", "", "", "", "h", "h" ,"" , "",
            "", "", "", "", "", "", "", "", "", "v",
            "", "", "", "", "h", "", "", "", "", ""
        ]
    };
      
}

module.exports = {
    startGame
}