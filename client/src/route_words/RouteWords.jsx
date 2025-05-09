import React from "react"
import clsx from 'clsx'
import AssistButtons from "../common/AssistButtons"

export default function RouteWords(props)
{
    const wordGrid = props.puzzleData.wordGrid;
    const intendedSolution = props.puzzleData.intendedSolution;
    
    const routeColors = ["lavender", "khaki", "peachpuff", "palegreen", "salmon"];

    const centerLetterIndex = Math.floor(wordGrid.length / 2);

    const gridRef = React.useRef();
    const animationRef = React.useRef([]);

    const [currentWord, setCurrentWord] = React.useState(wordGrid[centerLetterIndex]);
    const [currentWordRoute, setCurrentWordRoute] = React.useState([centerLetterIndex]);
    const [previousWordRoute, setPreviousWordRoute] = React.useState([centerLetterIndex]);
    const [words, setWords] = React.useState([]);
    const [wordRoutes, setWordRoutes] = React.useState([]);
    const [letterCoords, setLetterCoords] = React.useState([]);

    function reset()
    {
        setCurrentWord(wordGrid[centerLetterIndex]);
        setCurrentWordRoute([centerLetterIndex]);
        setPreviousWordRoute([centerLetterIndex]);
        setWords([]);
        setWordRoutes([]);
        setLetterCoords([]);
    }

    const polylineForwardSpeed = 0.2;
    const polylineReverseSpeed = 0.1;
    const polylineSpeed = previousWordRoute > currentWordRoute ? polylineReverseSpeed : polylineForwardSpeed;

    const gameWon = intendedSolution.every(word => words.includes(word));
    if (gameWon)
    {
        console.log("game won!");
    }

    React.useEffect(() => {
        if (gridRef.current) {
            setLetterCoords([])
            const rect = gridRef.current.getBoundingClientRect();
            const cellWidth = rect.width / 5;
            const cellLength = rect.height / 5;
            for (let row = 0; row < 5; row++)
            {
                for (let col = 0; col < 5; col++)
                {
                    const letterCoord = {
                        x: (col + 0.5) * cellWidth,
                        y: (row + 0.5) * cellLength
                    }
                    setLetterCoords((prevCoords) => ([...prevCoords, letterCoord]))
                }
            }
        }
    }, []);

    React.useEffect(() => {
        for (let i = 0; i < animationRef.current.length; i++)
        {
            if (animationRef.current[i]) 
            {
                animationRef.current[i].beginElementAt(i * polylineSpeed)
            }
        }
    }, [currentWordRoute])

    function isIndexInAddedRoutes(index)
    {
        for (let i = 0; i < wordRoutes.length; i++)
        {
            for (let j = 0; j < wordRoutes[i].length; j++)
            {
                if (wordRoutes[i][j] == index)
                {
                    return true;
                }
            }
        }

        return false;
    }

    const wordGridComponents = wordGrid.map((letter, index) => {
        const isInCurrentRoute = currentWordRoute.includes(index);
        const isInAddedRoute = isIndexInAddedRoutes(index);
        const keyClassName = clsx("letter", {
            "letter-current-route" : isInCurrentRoute,
            "letter-added-route" : isInAddedRoute && !isInCurrentRoute
        })
        return (
            <button key={index} className={keyClassName} onClick={() => addLetterToWordRoute(letter, index)}>
                <p key={index}>{letter}</p>
            </button>
        );
    });

    let currentWords = words.map((word, index) => {
        return (
        <div key={index} className="current-word-section">
            <span key={index}>{word}</span>
            <button className="remove-current-word" onClick={() => removeWord(word)}>x</button>
        </div>
        );
    });

    function isNeighbouringCell(index)
    {
        const currentCell = currentWordRoute[currentWord.length-1];

        // Check top
        if (index == currentCell-5)
        {
            return true;
        }

        // Check bottom
        if (index == currentCell+5)
        {
            return true;
        }
    
        // Check right
        if (index == currentCell+1 && currentCell % 5 != 4)
        {
            return true;
        }

        // Check left
        if (index == currentCell-1 && currentCell % 5 != 0)
        {
            return true;
        }

        // Check top right
        if (index == currentCell-5+1 && currentCell % 5 != 4)
        {
            return true;
        }
    
        // Check top left
        if (index == currentCell-5-1 && currentCell % 5 != 0)
        {
            return true;
        }
        
        // Check bottom right
        if (index == currentCell+5+1 && currentCell % 5 != 4)
        {
            return true;
        }
    
        // Check bottom left
        if (index == currentCell+5-1 && currentCell % 5 != 0)
        {
            return true;
         }

        return false;
    }

    function addLetterToWordRoute(letter, index)
    {
        const isInCurrentRoute = currentWordRoute.includes(index);
        const isInAddedRoute = isIndexInAddedRoutes(index);
        const isNeighbour = isNeighbouringCell(index);
        if (isNeighbour && !isInCurrentRoute && !isInAddedRoute)
        {
            setPreviousWordRoute(currentWordRoute);
            setCurrentWord(prevWord => prevWord + letter);
            setCurrentWordRoute(prevRoute => ([...prevRoute, index]));
        }
        else if (isInCurrentRoute)
        {
            let routeIndex = -1;
            for (let i = 0; i < currentWordRoute.length; i++)
            {
                if (currentWordRoute[i] == index)
                {
                    routeIndex = i;
                }
            }

            setPreviousWordRoute(currentWordRoute);
            setCurrentWord(prevWord => prevWord.slice(0, routeIndex+1));
            setCurrentWordRoute(prevRoute => prevRoute.slice(0, routeIndex+1));
        }
    }

    function addWord()
    {
        setWords(prevWords => [...prevWords, currentWord]);
        setWordRoutes(prevRoutes => [...prevRoutes, currentWordRoute])
        clearCurrentWordRoute();
    }

    function clearCurrentWordRoute()
    {
        setPreviousWordRoute(wordGrid[centerLetterIndex]);
        setCurrentWord(wordGrid[centerLetterIndex]);
        setCurrentWordRoute([centerLetterIndex]);
    }

    function removeWord(word)
    {
        var index = words.indexOf(word);
        if (index > -1)
        {
            setWords(prevWords => {
                let result = [];
                for (let i = 0; i < prevWords.length; i++)
                {
                    if (index != i)
                    {
                        result = [...result, prevWords[i]];
                    }
                }
                return result;
            });

            setWordRoutes(prevRoutes => {
                let result = [];
                for (let i = 0; i < prevRoutes.length; i++)
                {
                    if (index != i)
                    {
                        result = [...result, prevRoutes[i]];
                    }
                }
                return result;
            });
        }
    }

    // Tracing line
    function createPointsString(route)
    {
        let pointsString = "";
        if (letterCoords.length > 0)
        {
            if (route.length > 1)
            {
                for (let i = 0; i < route.length; i++)
                {
                    const currentIndex = route[i];
                    pointsString += String(letterCoords[currentIndex].x) +"," + String(letterCoords[currentIndex].y) + " ";
                }
            }
            else if (route.length == 1)
            {
                const currentIndex = route[0];
                pointsString += String(letterCoords[currentIndex].x) +"," + String(letterCoords[currentIndex].y) + " " +String(letterCoords[currentIndex].x) +"," + String(letterCoords[currentIndex].y + " ");
            }
        }
        pointsString = pointsString.slice(0,-1);
        return pointsString;
    }

    function createPolyline(route, color, key, opacity) 
    {
        var newRoute = route;
        var newPath = createPointsString(newRoute);
        return (
            <g key={key} opacity={opacity}>
                <polyline points={newPath} fill="none" stroke={color} strokeLinejoin="round" strokeWidth="48" strokeLinecap="round">
                </polyline>
            </g>
        )
    }

    function createAnimatedPolyline(route, color, key, opacity) 
    {
        var newRoute = route;
        var oldRoute = previousWordRoute;
        var numberOfSteps = 0;
        var routeSteps = [];
        if (newRoute.length > oldRoute.length)
        {
            numberOfSteps = newRoute.length - oldRoute.length;
            for (let i = 0; i < numberOfSteps; i++)
            {
                routeSteps = [...routeSteps,
                    {
                        old: [...newRoute.slice(0, newRoute.length-(numberOfSteps-i)), newRoute[newRoute.length-(numberOfSteps-i)-1]],
                        new: newRoute.slice(0, newRoute.length-(numberOfSteps-1-i))
                    }
                ]
            }
        }
        else
        {
            numberOfSteps = oldRoute.length - newRoute.length;
            for (let i = 0; i < numberOfSteps; i++)
            {
                routeSteps = [...routeSteps,
                    {
                        old: oldRoute.slice(0, oldRoute.length-i),
                        new: [...oldRoute.slice(0, oldRoute.length-i-1), oldRoute[oldRoute.length-i-2]]
                    }
                ]
            }
        }

        const routeStepAnimations = routeSteps.map((routeStep, index) =>
            {
                const durationString = polylineSpeed + "s";
                return (
                    <animate key={index} ref={ref => (animationRef.current[index] = ref)} attributeName="points" dur={durationString} repeatCount="1" fill="freeze" from={createPointsString(routeStep.old)} to={createPointsString(routeStep.new)} />
                )
            }
        )

        var newPath = createPointsString(newRoute);
        return (
            <g key={key} opacity={opacity}>
                <polyline points={newPath} fill="none" stroke={color} strokeLinejoin="round" strokeWidth="48" strokeLinecap="round">
                    {routeStepAnimations.length > 0 && routeStepAnimations}
                </polyline>
            </g>
        )
    }

    let addedWordRoutesPolylines = wordRoutes.map((route, index) => {
        return createPolyline(route, "	#b6b6b6", index, 0.95);
    });

    return (
        <div>
            <h1 className="title">Route Words</h1>
            <AssistButtons handleReset={reset} />
            <div className="grid-and-guesses">
                <div ref={gridRef} className="letter-grid">
                    {wordGridComponents}
                    <svg style={{zIndex: 2}} className="line" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                        {createAnimatedPolyline(currentWordRoute, "#2b2b27", 0, 1.0)}
                    </svg>
                    <svg style={{zIndex: 1}} className="line" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                        {addedWordRoutesPolylines}
                    </svg>
                </div>
                <div className="current-words">
                    {currentWords}
                </div>
            </div>
            {gameWon ?
                <h2 className="game-won">Game Won!</h2>
                :
                <>
                    <h2 className="current-word">{currentWord}</h2>
                    <div className="button-bar">
                        <button onClick={addWord}>Add Word</button>
                        <button onClick={clearCurrentWordRoute}>Clear Word</button>
                    </div>
                </>
            }
        </div>
    )
}