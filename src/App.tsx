import React, { useEffect, useState } from "react";
import Picker from "./ui/Picker";
import Schedule from "./ui/Schedule";

import "./App.scss";

// "The Expanse",
// "the%20book%20of%20boba%20fett",
// "the%20expanse",
// "the%20witcher",
// "hawkeye",
// "battlebots",

const storageKey = "tvSpyShows";

function App() {
  const [shows, setShows] = useState<string[]>(() => {
    const savedShows = localStorage.getItem(storageKey);

    if (savedShows) {
      return JSON.parse(savedShows);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(shows));
  }, [shows]);

  return (
    <div className="ts-app ts-theme">
      <header className="ts-app__header">
        <img
          className="ts-app__logo"
          src={process.env.PUBLIC_URL + "/favicon.svg"}
          alt="TVSpy logo"
        />
        <h1>TVSpy</h1>
      </header>
      <Picker shows={shows} onSetShows={setShows} />
      <Schedule shows={shows} onSetShows={setShows} />
    </div>
  );
}

export default App;
