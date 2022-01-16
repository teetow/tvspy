import classNames from "classnames";
import React, { KeyboardEventHandler, useEffect, useState } from "react";
import { getShows, Hit } from "../lib/fetchShow";
import "./Picker.scss";

type SearchResult = Hit;

type Props = {
  onSetShows: React.Dispatch<React.SetStateAction<string[]>>;
  className: string;
};

const Picker = ({ onSetShows, className }: Props) => {
  const [searchText, setSearchText] = useState<string>("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [hits, setHits] = useState<Hit[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    getShows(searchText).then((res) => setHits(res));
  }, [searchText]);

  useEffect(() => {
    setResults(hits.filter((hit) => hit.show.status !== "In Development"));
  }, [hits]);

  const handleKeyDown: KeyboardEventHandler = (ev) => {
    const numitems = results.length;

    if (ev.key === "Escape") {
      setSearchText("");
      return;
    }

    if (ev.key === "Enter") {
      onSetShows((prev) => [...prev, hits[selectedIndex].show.name]);
      setSearchText("");
      return;
    }

    const delta =
      Object.entries({ ArrowUp: -1, ArrowDown: 1 }).find(
        (key) => key[0] === ev.key
      )?.[1] || 0;

    if (delta) {
      ev.preventDefault();
      setSelectedIndex((prev) => (numitems + (prev + delta)) % numitems);
    }
  };

  return (
    <div
      className={classNames(["ts-picker", className])}
      onBlur={() => setShowResults(false)}
    >
      <input
        className={classNames([
          "ts-picker-input",
          "border-r-2",
        ])}
        id="js-showsearch"
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Add a show..."
        value={searchText}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowResults(true)}
        autoComplete="off"
      ></input>

      {showResults && (
        <ul className="ts-picker__results">
          {results.map((r, i) => (
            <li
              className="ts-picker__item"
              key={`${i}-${r.show.name}`}
              data-index={i}
              data-selected={selectedIndex === i ? "" : undefined}
              onClick={(e) =>
                onSetShows((prev: string[]) => [...prev, r.show.name])
              }
            >
              {r.show?.image?.medium && (
                <div
                  className="ts-picker__image"
                  style={{ backgroundImage: `url(${r.show.image.medium})` }}
                  title={r.show.name}
                />
              )}
              <span className="ts-picker__itemname">{r.show.name}</span>
              <span className="ts-picker__itemyear">
                {r.show?.premiered && (
                  <>({r?.show?.premiered?.split("-")?.[0]})</>
                )}
              </span>
              <span className="ts-picker__itemscore">
                {r.show.rating.average}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Picker;
