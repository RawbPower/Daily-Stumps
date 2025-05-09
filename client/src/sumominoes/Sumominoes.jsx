import React from "react"
import clsx from 'clsx'
import AssistButtons from "../common/AssistButtons"

export default function Sumominoes(props)
{
    const numPadCount = 9;

    const initialSumominoes = props.puzzleData.initialSumominoes;
    const sumominoShapes = props.puzzleData.sumominoShapes;
    const solutionSumominoes = props.puzzleData.solutionSumominoes;
    const rowHints = props.puzzleData.rowHints;
    const colHints = props.puzzleData.colHints;

    const width = colHints.length;
    const height = rowHints.length;

    const [currentSumominoes, setCurrentSumominoes] = React.useState(() => initialSumominoes.slice(""));
    const [selectedCell, setSelectedCell] = React.useState(-1);

    function reset()
    {
        let resetValue = initialSumominoes.slice("");
        setCurrentSumominoes(() => initialSumominoes.slice(""));
        setSelectedCell(-1);
    }

    let gameWon = true;

    for (var i = 0; i < currentSumominoes.length; ++i) 
    {
        if (currentSumominoes[i] != solutionSumominoes[i]) 
        {
            gameWon = false;
            break;
        }

        // Also check sum for alternate solution
    }

    if (gameWon)
    {
        console.log("game won!");
    }

    function getCellBorderStyles(index)
    {
        const topNeighbour = index - width >= 0 ? sumominoShapes[index - width] : -1;
        const bottomNeighbour = index + width < sumominoShapes.length ? sumominoShapes[index + width] : -1;
        const leftNeighbour = index - 1 >= 0 && ((index - 1) % width) != width-1 ? sumominoShapes[index - 1] : -1;
        const rightNeighbour = index + 1 < sumominoShapes.length && ((index + 1) % width) != 0 ? sumominoShapes[index + 1] : -1;
        return {
            borderTopStyle: sumominoShapes[index] > 0 ? (topNeighbour >= 0 && topNeighbour == sumominoShapes[index] ? "dashed" : "solid") : "none",
            borderBottomStyle: sumominoShapes[index] > 0? (bottomNeighbour >= 0 && bottomNeighbour == sumominoShapes[index] ? "dashed" : "solid") : "none",
            borderLeftStyle: sumominoShapes[index] > 0 ? (leftNeighbour >= 0 && leftNeighbour == sumominoShapes[index] ? "dashed" : "solid") : "none",
            borderRightStyle: sumominoShapes[index] > 0 ? (rightNeighbour >= 0 && rightNeighbour == sumominoShapes[index] ? "dashed" : "solid") : "none",
            borderTopColor: sumominoShapes[index] > 0 ? (topNeighbour >= 0 && topNeighbour == sumominoShapes[index] ? "var(--grey)" : "var(--black)") : "none",
            borderBottomColor: sumominoShapes[index] > 0? (bottomNeighbour >= 0 && bottomNeighbour == sumominoShapes[index] ? "var(--grey)" : "var(--black)") : "none",
            borderLeftColor: sumominoShapes[index] > 0 ? (leftNeighbour >= 0 && leftNeighbour == sumominoShapes[index] ? "var(--grey)" : "var(--black)") : "none",
            borderRightColor: sumominoShapes[index] > 0 ? (rightNeighbour >= 0 && rightNeighbour == sumominoShapes[index] ? "var(--grey)" : "var(--black)") : "none",
            borderTopWidth: topNeighbour <= 0 ? "4px" : "2px",
            borderBottomWidth: bottomNeighbour <= 0 ? "4px" : "2px",
            borderLeftWidth: leftNeighbour <= 0 ? "4px" : "2px",
            borderRightWidth: rightNeighbour <= 0 ? "4px" : "2px"
        }
    }

    function setSelectedCellTo(num)
    {
        if (selectedCell < 0)
        {
            return;
        }

        setCurrentSumominoes((prevValue) =>
        {
            let result = prevValue.slice("");
            result[selectedCell] = num;
            return result;
        })
    }

    let numPadElement = [];
    for (let i = 0; i < numPadCount; i++)
    {
        const gridAreaString = "num"+(i+1).toString();
        const styles = {
            gridArea: {gridAreaString}
        }
        numPadElement.push(
            <button key={i} style={styles} className="numpad-number" onClick={() => setSelectedCellTo(i+1)}>
                <p key={i}>{i+1}</p>
            </button>
        )
    }
    numPadElement.push(
        <button key={numPadCount} styles={{gridArea: "clear"}} className="numpad-number" onClick={() => setSelectedCellTo(-1)}>
            <p key={numPadCount}>X</p>
        </button>
    )

    const cellElements = currentSumominoes.map((num, index) => {

        let styles = getCellBorderStyles(index);
        if (index == selectedCell)
        {
            styles = {...styles, backgroundColor: "var(--yellow)"}
        }
        const validCell = num != 0;
        let cellElement;
        if (validCell)
        {
            cellElement = <button key={index} style={styles} className="sumominoes-cell" onClick={() => setSelectedCell(index)}>{num > 0 && num}</button>;
        }
        else
        {
            cellElement = <div key={index} style={styles} className="sumominoes-cell"></div>
        }

        return (
            cellElement
        );
    });

    for (let i = 0; i < rowHints.length; i++)
    {
        cellElements.splice((colHints.length+2)*i, 0, <p className="sumominoes-hint" key={solutionSumominoes.length+i}>{rowHints[i]}</p>);
        cellElements.splice((colHints.length+2)*(i+1)-1, 0, <p className="sumominoes-hint" key={100+solutionSumominoes.length+i}></p>);
    }
    
    cellElements.push(<p className="sumominoes-hint" key={solutionSumominoes.length+rowHints.length}></p>);
    
    for (let i = 0; i < colHints.length; i++)
    {
        cellElements.push(<p className="sumominoes-hint" key={solutionSumominoes.length+rowHints.length+1+i}>{colHints[i]}</p>);
    }

    cellElements.push(<p className="sumominoes-hint" key={200+solutionSumominoes.length+rowHints.length}></p>);

    /*
    <button className="sumominoes-clear">
        <p>CLEAR</p>
    </button>
    */

    return (
        <div className="sumominoes-section">
            <h1 className="title">Sumominoes</h1>
            <AssistButtons handleReset={() => reset()} />
            <section className="sumominoes-grid">
                {cellElements}
            </section>
            {!gameWon &&
            <section className="numpad">
                {numPadElement}
            </section>}
            {gameWon && <h2>Game Won!</h2>}
        </div>
    )
}