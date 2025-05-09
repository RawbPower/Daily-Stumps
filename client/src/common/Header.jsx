export default function Header() {

    const nth = (d) => {
        if (d > 3 && d < 21) return 'th';
        switch (d % 10) {
          case 1:  return "st";
          case 2:  return "nd";
          case 3:  return "rd";
          default: return "th";
        }
    };

    const dayList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const date = new Date();
    const dd = String(date.getDate());
    const mm = date.getMonth();
    const yyyy = date.getFullYear();
    
    const day = dayList[date.getDay()-1];
    const dateMonth = dd + nth(date.getDate()) + " " + monthList[mm];
    const year = yyyy;

    return (
        <header>
            <section className="stumps-heading">
                <div className="date">
                    <h3>{day}</h3>
                    <p>{dateMonth}</p>
                    <p>{year}</p>
                </div>
                <div className="header-title">
                    <div className="title-main">
                        <img className="title-image" src="resources/Title.jpg" alt="The Daily Stumps" />
                        <div className="completion-stars">
                            <img className="starD" src="resources/star.jpg" alt="Star" />
                            <img className="starC" src="resources/star.jpg" alt="Star" />
                            <img className="starB" src="resources/star.jpg" alt="Star" />
                            <img className="starA" src="resources/star.jpg" alt="Star" />
                            <img className="starB" src="resources/star.jpg" alt="Star" />
                            <img className="starC" src="resources/star.jpg" alt="Star" />
                            <img className="starD" src="resources/star.jpg" alt="Star" />
                        </div>
                    </div>
                    <img className="logo-image" src="resources/stump.jpg" alt="Stump logo" />
                </div>
            </section>
        </header>
    )
}