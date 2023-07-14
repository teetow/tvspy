import classnames from "classnames";
import { useEffect, useState } from "react";
import { Route, Routes, useSearchParams } from "react-router-dom";
import { ScheduledShow } from "./lib/fetchShow";
import { getShow } from "./lib/show";
import Footer from "./ui/Footer";
import Manager from "./ui/Manager";
import Picker from "./ui/Picker";
import Week from "./ui/Week";

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
  const bytitle = searchParams.get("search");
  useEffect(() => {
    const findPreviewShow = async () => {
      if (bytitle) {
        const foundShow = await getShow(bytitle);
        setPreviewShow(foundShow);
      }
    };

    findPreviewShow();
  });
  const [previewShow, setPreviewShow] = useState<ScheduledShow>();

  const addPreviewToFavs = (id: number) => {
    setFavIds((prev) => [...prev, id]);
    setSearchParams({});
  };

  return (
    <div
      className={classnames([
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
        className={classnames([
          "flex",
          "items-center",
          "justify-self-start",
          "text-2xl",
          "gap-2",
          "[grid-area:header]",
        ])}
      >
        <img className="h-8" src="./favicon.svg" alt="TVSpy logo" />
        <h1>TVSpy</h1>
      </header>

      {previewShow && (
        <div
          className={classnames([
            "flex",
            "gap-2",
            "bg-brand-100",
            `[grid-area: banner]`,
          ])}
        >
          Add {previewShow.name} to your favorites?{" "}
          <a
            href=""
            onClick={() => addPreviewToFavs(previewShow.id)}
            className={classnames(["text-brand-700"])}
          >
            Yes
          </a>{" "}
          <a href="" className={classnames(["text-brand-700"])}>
            Dismiss
          </a>
        </div>
      )}

      <Picker
        className="[grid-area:header] justify-self-end"
        onSetShows={setFavIds}
      />

      <Week
        className={classnames(["[grid-area:week]"])}
        showIds={previewShow ? [...favIds, previewShow.id] : favIds}
      />

      <Manager
        className={classnames(["[grid-area:manager]"])}
        showIds={favIds}
        onRemoveShow={(id) => {
          setFavIds((prev) => prev.filter((f) => f !== id));
        }}
      />

      <Footer className={classnames(["[grid-area:footer]"])} />
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
