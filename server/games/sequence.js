const random = require('../utils/random');
const words = require("../data/common_words");

let chosenWord = "";
let initialIndices = [];

function generateDailyPuzzle()
{
    let validWord = false;
    while (!validWord)
    {
        const randomWord = words[random.rangeInt(0, words.length)];
            
        if (randomWord.length >= 6)
        {
            chosenWord = randomWord.toUpperCase();
            validWord = true;
        }
    }

    const numberOfInitialLetters = chosenWord.length > 7 ? 2 : 1;

    for (let i = 0; i < numberOfInitialLetters; i++)
    {
        let validIndex = false;
        while (!validIndex)
        {
            let randomIndex = random.rangeInt(1, chosenWord.length-1);

            if (!initialIndices.includes(randomIndex))
            {
                validIndex = true;
                initialIndices.push(randomIndex);
                for (let j = 0; j < chosenWord.length; j++)
                {
                    if (j == randomIndex)
                    {
                        continue;
                    }

                    if (chosenWord[j] == chosenWord[randomIndex])
                    {
                        initialIndices.push(j);
                    }
                }
            }
        }
    }

    console.log(chosenWord);
}

function startGame(dailySeedPrefix)
{
    const dailySeed = dailySeedPrefix + "_Sequence";
    random.initSeed(dailySeed);
    generateDailyPuzzle();
    console.log("Done");

    return {
       word: chosenWord,
        initialLetterIndices: initialIndices
    };
      
}

module.exports = {
    startGame
}