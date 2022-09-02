import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { getShowById, ScheduledShow } from "./lib/fetchShow";
import Footer from "./ui/Footer";
import Manager from "./ui/Manager";
import Picker from "./ui/Picker";
import Week from "./ui/Week";

const storageKey = "tvSpyShows";

function App() {
  const [shows, setShows] = useState<ScheduledShow[]>([]);
  const [favorites, setFavorites] = useState<number[]>(() => {
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
      getShowById(show).then((res) => {
        setShows((prev) =>
          [...prev.filter((s) => s.id !== res.id), res].sort(
            (a, b) => a.id - b.id
          )
        );
      });
    });
  }, [favorites, setShows]);

  return (
    <div
      className={classNames([
        "ts-app",
        "ts-theme",
        "grid",
        "gap-8",
        "[width:min(60em,_100%)]",
        `[grid-template-areas:"header"_"week"_"manager"_"footer"]`,
        `[grid-template-rows:auto_auto_1fr_auto]`,
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
        <img className="h-8" src="/favicon.svg" alt="TVSpy logo" />
        <h1>TVSpy</h1>
      </header>
      <Picker
        className="[grid-area:header] justify-self-end"
        onSetShows={setFavorites}
      />
      <Week showEvents={shows} />
      <Manager
        shows={shows}
        onRemoveShow={(id) => {
          setShows((prev) => prev.filter((s) => s.id !== id));
          setFavorites((prev) => prev.filter((f) => f !== id));
        }}
      />
      <Footer />
    </div>
  );
}

export default App;
