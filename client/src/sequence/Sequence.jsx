import React from "react"
import clsx from 'clsx'
import AssistButtons from "../common/AssistButtons"

export default function Sequence(props)
{
    const word = props.puzzleData.word;
    const initialLetterIndices = props.puzzleData.initialLetterIndices;

    const alphabet = "abcdefghijklmnopqrstuvwxyz"
    const wordArray = word.split('');

    function setInitialLetters()
    {
        var initialArray = new Array(word.length);
        for (let i = 0; i < word.length; i++)
        {
            if (initialLetterIndices.includes(i))
            {
                initialArray[i] = word.substring(i, i+1);
            }
            else
            {
                initialArray[i] = "";
            }
        }
        return initialArray;
    }

    const [visibleLetters, setVisibleLetters] = React.useState(() => setInitialLetters());
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    function reset()
    {
        setVisibleLetters(() => setInitialLetters());
        setSelectedIndex(0);
    }

    let gameWon = true;
    for (let i = 0; i < wordArray.length; i++)
    {
        if (wordArray[i] != visibleLetters[i])
        {
            gameWon = false;
            break;
        }
    }

    if (gameWon)
    {
        console.log("game won!");
    }

    function setSelectedLetter(index)
    {
        if (!initialLetterIndices.includes(index))
        {
            setSelectedIndex(index);
        }
    }

    const wordButtons = visibleLetters.map((letter, index) => {
        const keyClassName = clsx("sequence-letter", {
            "sequence-letter-selected" : index == selectedIndex
        })
        return (
            <button key={index} className={keyClassName} onClick={() => setSelectedLetter(index)}>
                <p key={index}>{letter}</p>
            </button>
        );
     });

     let currentOrderingIndex = 0;
     let wordOrdering = new Array(wordArray.length).fill(0);
     let sortedWordArray = wordArray.slice();
     sortedWordArray.sort();
     for (let i = 0; i < sortedWordArray.length; i++)
     {
        let repeatedLetterCount = 0;
        let currentLetterIndex = i;
        while (currentLetterIndex > 0)
        {
            if (sortedWordArray[currentLetterIndex] == sortedWordArray[currentLetterIndex-1])
            {
                repeatedLetterCount++;
                currentLetterIndex--;
            }
            else
            {
                break;
            }
        }

        if (repeatedLetterCount == 0)
        {
            currentOrderingIndex++;
        }

        for (let j = 0; j < wordArray.length; j++)
        {
            if (wordArray[j] == sortedWordArray[i])
            {
                if (repeatedLetterCount > 0)
                {
                    repeatedLetterCount--;
                }
                else
                {
                    wordOrdering[j] = currentOrderingIndex;
                    break;
                }
            }
        }
     }

     const wordOrderingElements = wordOrdering.map((ordering, index) => {
        return (
            <p key={index}>{ordering}</p>
        );
     });

     function getNextOpenIndex(currentIndex)
     {
        let newIndex = (currentIndex+1)%visibleLetters.length;
        let count = 1;
        while (visibleLetters[newIndex] != "" && count <= visibleLetters.length)
        {
            newIndex = (newIndex+1)%visibleLetters.length;
            count++;
        }

        return newIndex;
     }

     function guessLetter(letter)
     {
        if (visibleLetters.includes(letter) && letter != "")
        {
            return;
        }

        const selectedIndexOrder = wordOrdering[selectedIndex];
        var newVisibleLetters = new Array(visibleLetters.length);
        for (let i = 0; i < newVisibleLetters.length; i++)
        {
            if (wordOrdering[i] == selectedIndexOrder)
            {
                newVisibleLetters[i] = letter;
            }
            else
            {
                newVisibleLetters[i] = visibleLetters[i];
            }
        }

        setVisibleLetters(newVisibleLetters);

        if (letter != "")
        {
            setSelectedIndex((prevSelectedIndex) => getNextOpenIndex(prevSelectedIndex));
        }
     }

     const selectedOrder = wordOrdering[selectedIndex];
     let validRangeMin = "A";
     let validRangeMax = "Z";
     
     for (let i = 0; i < visibleLetters.length; i++)
     {
        if (selectedOrder == wordOrdering[i])
        {
            continue;
        }

        if (visibleLetters[i] == "")
        {
            continue;
        }

        if (selectedOrder < wordOrdering[i] && visibleLetters[i] < validRangeMax)
        {
            validRangeMax = visibleLetters[i];
        }
        else if (selectedOrder > wordOrdering[i] && visibleLetters[i] > validRangeMin)
        {
            validRangeMin = visibleLetters[i];
        }
     }

     function clearLetter()
     {
        if (visibleLetters[selectedIndex] = "")
        {
            return;
        }

        guessLetter("");
     }

     const keyboardElements = alphabet.split('').map((letterKey) => {
        const inRange = letterKey.toUpperCase() <= validRangeMax && letterKey.toUpperCase() >= validRangeMin;
        const isUsed = letterKey.toUpperCase() != visibleLetters[selectedIndex] && visibleLetters.includes(letterKey.toUpperCase());
        const keyClassName = clsx("letter-key", {
            "letter-key-used" : isUsed,
            "letter-key-out-of-range" : !isUsed && !inRange,
            "letter-key-in-range" : !isUsed && inRange
        })
        return (
            <button 
                key={letterKey} 
                className={keyClassName}
                onClick={() => guessLetter(letterKey.toUpperCase())}>
                    {letterKey.toUpperCase()}
            </button>
        )
    })

    return (
        <div>
            <h1 className="title">Sequence</h1>
            <AssistButtons handleReset={reset} />
            <div className="ordering">
                {wordOrderingElements}
            </div>
            <div className="word-buttons">
                {wordButtons}
            </div>
            <section className="keyboard">
                {keyboardElements}
                <button 
                className="clear"
                onClick={clearLetter}>
                    CLEAR
                </button>
            </section>
            {gameWon && <h2>Game Won!</h2>}
        </div>
    )
}