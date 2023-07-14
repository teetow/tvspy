import classNames from "classnames";
import { useEffect, useState } from "react";
import { Route, Routes, useSearchParams } from "react-router-dom";
import { ScheduledShow, getShowById, searchShows } from "./lib/fetchShow";
import Footer from "./ui/Footer";
import Manager from "./ui/Manager";
import Picker from "./ui/Picker";
import Week from "./ui/Week";

const storageKey = "tvSpyShows";

type MainPageProps = {
  byid?: string;
  bytitle?: string;
};

const MainPage = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  const byid = searchParams.get("byid");
  const bytitle = searchParams.get("bytitle");

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
    const fetchShows = async () => {
      let showData = await Promise.all(
        favorites.map(async (favorite) => getShowById(favorite))
      );

      if (byid) {
        console.log("asdfasdf");
        showData.push(await getShowById(Number(byid)));
      }

      if (bytitle) {
        const shows = await searchShows(bytitle);
        if (shows.length > 0) {
          showData.push(await getShowById(shows[0].show.id));
        }
      }

      setShows(showData.sort((a, b) => a.id - b.id));
    };
    fetchShows();
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
        <img className="h-8" src="./favicon.svg" alt="TVSpy logo" />
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
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
    </Routes>
  );
}

export default App;
