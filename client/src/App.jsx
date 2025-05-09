import React from "react"
import Header from "./common/Header"
import RouteWords from './route_words/RouteWords'
import Sequence from './sequence/Sequence'
import SummingCircle from './summing_circle/SummingCircle'
import Tonari from './tonari/Tonari'
import Crossings from './crossings/Crossings'
import Sumominoes from './sumominoes/Sumominoes'
import axios from "axios"

export default function App() {

    const [dailyPuzzleData, setDailyPuzzleData] = React.useState(null);

    React.useEffect(() => {
        axios.get("http://localhost:8080/api")
          .then((res) => res.data)
          .then((data) => setDailyPuzzleData(data.puzzleData));
    }, []);
    
    return (
        <>
            <Header />
            <main>
            { dailyPuzzleData &&
                <div className="game-page">
                    <RouteWords puzzleData={dailyPuzzleData.RouteWords} />
                    <SummingCircle puzzleData={dailyPuzzleData.SummingCircle} />
                    <Sumominoes puzzleData={dailyPuzzleData.Sumominoes} />
                    <Tonari puzzleData={dailyPuzzleData.Tonari} />
                    <Sequence puzzleData={dailyPuzzleData.Sequence} />
                    <Crossings puzzleData={dailyPuzzleData.Crossings} />
                </div>
            }
            </main>
            <footer></footer>
        </>
    )
}