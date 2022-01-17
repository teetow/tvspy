import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { getShow, ScheduledShow } from "./lib/fetchShow";
import Manager from "./ui/Manager";
import Picker from "./ui/Picker";
import Week from "./ui/Week";

import "./App.scss";

const storageKey = "tvSpyShows";

// type ShowMap = Record<number, ScheduledShow>;

function App() {
  const [shows, setShows] = useState<ScheduledShow[]>([]);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const savedFavorites = localStorage.getItem(storageKey);

    if (savedFavorites) {
      return JSON.parse(savedFavorites);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    favorites.forEach((show) => {
      getShow(show).then((res) => {
        setShows((prev) => [...prev.filter((s) => s.id !== res.id), res]);
      });
    });
  }, [favorites, setShows]);

  return (
    <div
      className={classNames([
        "ts-app",
        "ts-theme",
        "grid",
        "gap-2",
      ])}
    >
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
        onSetShows={setFavorites}
      />
      <Week showEvents={shows} />
      <Manager
        shows={shows}
        onRemoveShow={(id) =>
          setShows((prev) => prev.filter((s) => s.id !== id))
        }
      />

      {/* <Schedule className={} shows={shows} onSetShows={setShows} /> */}
    </div>
  );
}

export default App;
