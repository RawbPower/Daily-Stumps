import React from "react"
import clsx from 'clsx'
import AssistButtons from "../common/AssistButtons"

export default function Tonari(props)
{
    const numberGrid = props.puzzleData.numberGrid;
    const lineGridSolution = props.puzzleData.lineGridSolution;

    const gridWidth = Math.sqrt(numberGrid.length);

    const [lineGrid, setLineGrid] = React.useState(new Array(lineGridSolution.length).fill(false));

    function reset()
    {
        setLineGrid(new Array(lineGridSolution.length).fill(false));
    }

    let gameWon = true;

    for (var i = 0; i < lineGrid.length; ++i) 
    {
        if (lineGrid[i] !== lineGridSolution[i]) 
        {
            gameWon = false;
            break;
        }
    }

    if (gameWon)
    {
        console.log("game won!");
    }

    function toggleLine(index)
    {
        if (index == -1)
        {
            return;
        }

        setLineGrid((preValue) => {
            let retArray = new Array(preValue.length)

            for (let i = 0; i < preValue.length; i++)
            {
                if (i == index)
                {
                    retArray[i] = !preValue[i];
                }
                else
                {
                    retArray[i] = preValue[i];
                }
            }
            return retArray;
        })
    }

    function getLineIndex(cellIndex, side)
    {
        const cellCol = cellIndex % gridWidth;
        const cellRow = Math.floor(cellIndex / gridWidth);
        if (side == "top")
        {
            if (cellRow == 0)
            {
                return -1;
            }
            else
            {
                return (gridWidth - 1)*gridWidth + ((cellRow-1)*gridWidth + cellCol);
            }
        }
        else if (side == "bottom")
        {
            if (cellRow == gridWidth-1)
            {
                return -1;
            }
            else
            {
                return (gridWidth - 1)*gridWidth + ((cellRow)*gridWidth + cellCol);
            }
        }
        else if (side == "left")
        {
            if (cellCol == 0)
            {
                return -1;
            }
            else
            {
                return cellRow * (gridWidth-1) + cellCol - 1
            }
        }
        else if (side == "right")
        {
            if (cellCol == gridWidth-1)
            {
                return -1;
            }
            else
            {
                return cellRow * (gridWidth-1) + cellCol
            }
        }

        return -1;
    }

    const tonariGridElements = numberGrid.map((count, index) => {
        const topLineIndex = getLineIndex(index, "top");
        const bottomLineIndex = getLineIndex(index, "bottom");
        const leftLineIndex = getLineIndex(index, "left");
        const rightLineIndex = getLineIndex(index, "right");

        const hasTop = index < gridWidth;
        const hasBottom = index >= numberGrid.length - gridWidth;
        const hasLeft = index % gridWidth == 0;
        const hasRight = index % gridWidth == gridWidth-1;

        const styles = {
            borderTopStyle: hasTop || (topLineIndex >= 0 && lineGrid[topLineIndex]) ? "solid" : "dashed",
            borderTopColor: hasTop || (topLineIndex >= 0 && lineGrid[topLineIndex]) ? "var(--black)" : "var(--grey)",
            borderBottomStyle: hasBottom || (bottomLineIndex >= 0 && lineGrid[bottomLineIndex]) ? "solid" : "dashed",
            borderBottomColor: hasBottom || (bottomLineIndex >= 0 && lineGrid[bottomLineIndex]) ? "var(--black)" : "var(--grey)",
            borderLeftStyle: hasLeft || (leftLineIndex >= 0 && lineGrid[leftLineIndex]) ? "solid" : "dashed",
            borderLeftColor: hasLeft || (leftLineIndex >= 0 && lineGrid[leftLineIndex]) ? "var(--black)" : "var(--grey)",
            borderRightStyle: hasRight || (rightLineIndex >= 0 && lineGrid[rightLineIndex]) ? "solid" : "dashed",
            borderRightColor: hasRight || (rightLineIndex >= 0 && lineGrid[rightLineIndex]) ? "var(--black)" : "var(--grey)"
        }

        return (
            <div key={index} className="tonari-cell" style={styles} disabled={true}>
                <p key={index}>{count}</p>
                {!hasTop && <button key={index+100} className="line-button-top" onClick={() => toggleLine(topLineIndex)}></button>}
                {!hasBottom && <button key={index+200} className="line-button-bottom" onClick={() => toggleLine(bottomLineIndex)}></button>}
                {!hasLeft && <button key={index+300} className="line-button-left" onClick={() => toggleLine(leftLineIndex)}></button>}
                {!hasRight && <button key={index+400} className="line-button-right" onClick={() => toggleLine(rightLineIndex)}></button>}
            </div>
        );
    });

    return (
        <div>
            <h1 className="title">Tonari</h1>
            <AssistButtons handleReset={reset} />
            <section className="tonari-grid">
                {tonariGridElements}
            </section>
            {gameWon && <h2>Game Won!</h2>}
        </div>
    )
}