import React from "react"
import clsx from 'clsx'
import AssistButtons from "../common/AssistButtons"

export default function Crossings(props)
{
    const islandGrid = props.puzzleData.islandGrid;
    const rowHints = props.puzzleData.rowHints;
    const colHints = props.puzzleData.colHints;
    const bridgeSolutionGrid = props.puzzleData.bridgeSolutionGrid;

    const gridWidth = Math.sqrt(islandGrid.length);

    const gridOptions = ["", "h", "v"]
    const [bridgeGrid, setBridgeGrid] = React.useState(new Array(islandGrid.length).fill(0));

    function reset()
    {
        setBridgeGrid(new Array(islandGrid.length).fill(0));
    }

    let gameWon = true;

    for (var i = 0; i < bridgeGrid.length; ++i) 
    {
        if (gridOptions[bridgeGrid[i]] != bridgeSolutionGrid[i]) 
        {
            gameWon = false;
            break;
        }
    }

    if (gameWon)
    {
        console.log("game won!");
    }

    function toggleBridge(index)
    {
        if (!islandGrid[index])
        {
            return;
        }

        setBridgeGrid((preValue) => {
            let result = preValue.slice();
            result[index] = (preValue[index] + 1) % gridOptions.length;
            return result;
        })
    }

    const islandGridElements = islandGrid.map((isWater, index) => {
        const styles = {
            backgroundColor: isWater ? "var(--white)" :  "var(--black)"
        }

        return (
            <button key={index} className="crossings-cell" style={styles} onClick={() => toggleBridge(index)}>
                {gridOptions[bridgeGrid[index]] == "h" && <div className="horizontal-line"></div>}
                {gridOptions[bridgeGrid[index]] == "v" && <div className="vertical-line"></div>}
            </button>
        );
    });

    for (let i = 0; i < rowHints.length; i++)
    {
        islandGridElements.splice((colHints.length+1)*i, 0, <p className="hint" key={islandGrid.length+i}>{rowHints[i] >= 0 ? rowHints[i] : ""}</p>);
    }

    islandGridElements.push(<p className="hint" key={islandGrid.length+rowHints.length}></p>);

    for (let i = 0; i < colHints.length; i++)
    {
        islandGridElements.push(<p className="hint" key={islandGrid.length+rowHints.length+1+i}>{colHints[i] >= 0 ? colHints[i] : ""}</p>);
    }

    return (
        <div>
            <h1 className="title">Crossings</h1>
            <AssistButtons handleReset={reset} />
            <section className="crossings-grid">
                {islandGridElements}
            </section>
            {gameWon && <h2>Game Won!</h2>}
        </div>
    )
}