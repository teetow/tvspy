import classNames from "classnames";
import { ComponentProps, useEffect, useState } from "react";
import { Route, Routes, useSearchParams } from "react-router-dom";
import { ScheduledShow, getShowById, searchShows } from "./lib/fetchShow";
import Footer from "./ui/Footer";
import Manager from "./ui/Manager";
import Picker from "./ui/Picker";
import Week from "./ui/Week";
import { getShow } from "./lib/show";

const storageKey = "tvSpyShows";

const MainPage = () => {
  const [favIds, setFavIds] = useState<number[]>(() => {
    const savedFavorites = localStorage.getItem(storageKey);

    if (savedFavorites) {
      return JSON.parse(savedFavorites);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(favIds));
  }, [favIds]);

  let [searchParams, setSearchParams] = useSearchParams();
  const byid = searchParams.get("byid");
  const bytitle = searchParams.get("bytitle");
  const [previewId] = useState<number>();
  const [previewShow, setPreviewShow] = useState<ScheduledShow>();

  useEffect(() => {
    const fetchPreviewShow = async () => {
      if (previewId) {
        let previewShow = await getShow(previewId);
        if (previewShow) {
          setPreviewShow(previewShow);
        }
      }
    };

    fetchPreviewShow();
  }, [previewId]);

  const addPreviewToFavs = (id: number) => {
    setFavIds((prev) => [...prev, id]);
    setSearchParams({});
  };

  return (
    <div
      className={classNames([
        "ts-app",
        "ts-theme",
        "grid",
        "gap-8",
        "[width:min(60em,_100%)]",
        `[grid-template-areas:"banner"_"header"_"week"_"manager"_"footer"]`,
        `[grid-template-rows:auto_auto_auto_1fr_auto]`,
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
      {previewShow && (
        <div>
          Add {previewShow.name} to your favorites?{" "}
          <a
            href=""
            onClick={() => addPreviewToFavs(previewShow.id)}
            className={classNames(["text-brand-700"])}
          >
            Yes
          </a>{" "}
          <a href="">Hide this</a>
        </div>
      )}
      <Picker
        className="[grid-area:header] justify-self-end"
        onSetShows={setFavIds}
      />
      <Week showIds={previewId ? [...favIds, previewId] : favIds} />
      <Manager
        showIds={favIds}
        onRemoveShow={(id) => {
          setFavIds((prev) => prev.filter((f) => f !== id));
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
