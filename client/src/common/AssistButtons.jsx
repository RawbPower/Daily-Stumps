export default function AssistButtons(props)
{
    return (
    <div className="assist-icons">
        <button className="assist-button" onClick={props.handleReset}>
            <img src="resources/reset.jpg" alt="Reset" />
        </button>
        <button className="assist-button">
              <img src="resources/tips_tricks.jpg" alt="Tips and tricks" />
        </button>
         <button className="assist-button">
               <img src="resources/help.jpg" alt="Help" />
         </button>
     </div>
     )
}