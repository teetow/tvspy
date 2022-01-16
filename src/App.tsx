import classNames from "classnames";
import React, { useEffect, useState } from "react";
import Picker from "./ui/Picker";
import Schedule from "./ui/Schedule";

import "./App.scss";

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
      <header
        className={classNames([
          "grid",
          "items-center",
          "justify-self-start",
          "text-2xl",
          "gap-2",
          "[grid-area:header]",
          '[grid-template-areas:"logo_title"]',
        ])}
      >
        <img
          className="h-8"
          src={process.env.PUBLIC_URL + "/favicon.svg"}
          alt="TVSpy logo"
        />
        <h1>TVSpy</h1>
      </header>
      <Picker
        className="[grid-area:header] justify-self-end"
        onSetShows={setShows}
      />
      <Schedule shows={shows} onSetShows={setShows} />

      {/* <Schedule className={} shows={shows} onSetShows={setShows} /> */}
    </div>
  );
}

export default App;
