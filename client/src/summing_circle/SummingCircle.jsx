import React from "react"
import clsx from 'clsx'
import AssistButtons from "../common/AssistButtons"

export default function SummingCircle(props)
{
    const initialIcons = props.puzzleData.initialIcons;
    const iconBar = props.puzzleData.iconBar;
    const solutionIcons = props.puzzleData.solutionIcons;

    const iconCount = initialIcons.length;
    const PI = 3.1415;
    const radius = 50;

    function getInitialSummingCircleIcons() {
        let retArray = new Array(initialIcons.length)

        for (let i = 0; i < initialIcons.length; i++)
        {
            retArray[i] = initialIcons[i]
        }

        return retArray;
    }

    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [summingCircleIcons, setSummingCircleIcons] = React.useState(() => getInitialSummingCircleIcons());
    const [guessedBarIndices, setGuessedBarIndices] = React.useState([]);

    function reset()
    {
        setSelectedIndex(0);
        setSummingCircleIcons(() => getInitialSummingCircleIcons());
        setGuessedBarIndices([]);
    }

    let gameWon = true;
    for (let i = 0; i < solutionIcons.length; i++)
    {
        if (solutionIcons[i] != summingCircleIcons[i])
        {
            gameWon = false;
            break;
        }
    }

    if (gameWon)
    {
        console.log("game won!");
    }

    function selectSlot(index)
    {
        if (initialIcons[index] != "")
        {
            return false;
        }

        setSelectedIndex(index);

        return true;
    }

    function selectNextSlot()
    {
        let nextSlot = selectedIndex + 1;
        while(!selectSlot(nextSlot))
        {
            nextSlot = (nextSlot + 1) % solutionIcons.length;
        }
    }

    const summingCircleElements = summingCircleIcons.map((icon, index) => {
        const angleDelta = (2 * PI) / iconCount;
        const angle = index * angleDelta;
        const x = -radius * Math.sin(angle) + 5;
        const y = radius * Math.cos(angle) + 5;
        const percentagePositionX = 50 - x;
        const percentagePositionY = 50 - y;

        const keyClassName = clsx("summing-circle-slot", {
            "summing-circle-slot-selected" : index == selectedIndex,
            "summing-circle-slot-guess" : initialIcons[index] == ""
        })

        const styles = {
            position: "absolute",
            top: percentagePositionY + "%",
            left: percentagePositionX + "%"
        }

        return (
            <button key={index} className={keyClassName} style={styles} onClick={() => selectSlot(index)}>
                <p key={index}>{icon}</p>
            </button>
        );
    });

    function clearIcon(barIndex)
    {
        let circleIndex = 0;
        for (let i = 0; i < guessedBarIndices.length; i++)
        {
            if (guessedBarIndices[i][0] == barIndex)
            {
                circleIndex = guessedBarIndices[i][1];
                break;
            }
        }

        setSummingCircleIcons((prevValue) => {
            let retArray = new Array(prevValue.length)

            for (let i = 0; i < prevValue.length; i++)
            {
                if (i == circleIndex)
                {
                    retArray[i] = "";
                }
                else
                {
                    retArray[i] = prevValue[i];
                }
            }
            return retArray;
        })

        setGuessedBarIndices((prevValue) => {
            let retArray = new Array(prevValue.length-1)

            for (let i = 0; i < prevValue.length; i++)
            {
                if (prevValue[i][0] != barIndex)
                {
                    retArray[i] = prevValue[i];
                }
            }
            return retArray;
        })
    }

    function guessIcon(icon, index) 
    {
        if (guessedBarIndices.some(e => e[0] === index))
        {
            clearIcon(index)
        }

        for (let i = 0; i < guessedBarIndices.length; i++)
        {
            if (guessedBarIndices[i][1] == selectedIndex)
            {
                guessedBarIndices.splice(i, 1)
                break;
            }
        }

        setSummingCircleIcons((preValue) => {
            let retArray = new Array(preValue.length)

            for (let i = 0; i < preValue.length; i++)
            {
                if (i == selectedIndex)
                {
                    retArray[i] = icon;
                }
                else
                {
                    retArray[i] = preValue[i];
                }
            }
            return retArray;
        })

        setGuessedBarIndices((prevValue) => ([...prevValue, [index, selectedIndex]]));

        selectNextSlot();
    }

    const summingCircleBarElements = iconBar.map((icon, index) => {

        const keyClassName = clsx("summing-circle-slot", {
            "summing-circle-slot-guessed" : guessedBarIndices.some(e => e[0] === index)
        })

        return (
            <button key={index} className={keyClassName} onClick={() => guessIcon(icon, index)}>
                <p key={index}>{icon}</p>
            </button>
        );
    });

    return (
        <div>
            <h1 className="title">Summing Circle</h1>
            <AssistButtons handleReset={reset} />
            <section className="summing-circle-section">
                <div className="summing-circle">
                    {summingCircleElements}
                </div>
                <div className="summing-circle-bar">
                    {summingCircleBarElements}
                </div>
                {gameWon && <h2>Game Won!</h2>}
            </section>
        </div>
    )
}