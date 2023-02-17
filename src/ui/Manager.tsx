import classNames from "classnames";
import {
  addDays,
  format,
  isSameYear,
  isWithinInterval,
  parseISO,
  startOfISOWeek,
  subDays,
} from "date-fns";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { getShowById, ScheduledShow } from "../lib/fetchShow";
import useClickAway from "../lib/useClickAway";
import "./Manager.scss";

const fmt = (date?: string) => {
  if (date) {
    return isSameYear(Date.now(), parseISO(date))
      ? format(parseISO(date), "MMM d")
      : format(parseISO(date), "MMM d, YYY");
  }
};

const getShowStatus = (show: ScheduledShow) => {
  let status;
  if (show.status === "Ended")
    return `${format(parseISO(show.premiereDate || ""), "yyyy")} - ${format(
      parseISO(show.prevSeason?.endDate || ""),
      "yyyy"
    )}`;
  if (show.status === "Running")
    return `${format(parseISO(show.premiereDate || ""), "yyyy")}`;
  return status;
};

const getStatus = (show: ScheduledShow) => {
  if (show.status === "Ended") {
    return "";
  }

  if (show.seasonStatus === "Hiatus" && show.prevSeason !== null) {
    return `ended on ${show.prevSeason?.endDate}`;
  }

  if (show.seasonStatus === "Running") {
    if (show.nextSeason) {
      return `starting on ${show.nextSeason.premiereDate}`;
    }

    return `started on ${fmt(show.currentSeason?.premiereDate || "")}`;
  }

  return `ended on ${show.prevSeason?.endDate}`;
};

const ShowDetails = ({ show }: { show: ScheduledShow }) => {
  return (
    <div
      className={classNames([
        `ts-manager__details`,
        `grid`,
        `gap-2`,
        `[grid-template-areas:"info_image"]`,
        `[grid-template-columns:3fr_1fr]`,
      ])}
    >
      <ul className="ts-manager__details__info [grid-area:info] grid">
        <li className="text-2xl leading-8">{show.name}</li>
        <span className="text-brand-600">{getShowStatus(show)}</span>
        <li className="grid grid-flow-col items-baseline justify-start gap-2">
          <span className="">
            Season{" "}
            {show.nextSeason?.number ||
              show.currentSeason?.number ||
              show.prevSeason?.number}
          </span>
          <span className="text-brand-600">{getStatus(show)}</span>
        </li>
        {show.nextEpDate && <li>Next episode {fmt(show.nextEpDate)}</li>}
        {show.prevEpDate && <li>Previous episode {fmt(show.prevEpDate)}</li>}
        <li className="grid grid-flow-col justify-start gap-2">
          <span>
            <a
              className={classNames("text-brand-700")}
              href={show.url.replace("api.tvmaze", "www.tvmaze")}
              target="_blank"
            >
              View on TVMaze
            </a>
          </span>
        </li>
      </ul>
      <div
        className={classNames([
          "ts-manager__sidepanel",
          `[grid-area:image]`,
          `grid`,
          `[grid-template-rows:1fr_auto]`,
        ])}
      >
        <div
          className={classNames([
            `ts-manager__details__image`,
            `[background-size:contain]`,
            "bg-no-repeat",
          ])}
          style={{ backgroundImage: `url(${show.image})` }}
        ></div>
      </div>
    </div>
  );
};

const getShowComment = (show: ScheduledShow) => {
  const calendarStart = subDays(startOfISOWeek(Date.now()), 7);
  const calendarBounds = {
    start: calendarStart,
    end: addDays(calendarStart, 21),
  };

  if (show.prevEpDate && show.status === "Ended") {
    return <>ended {fmt(show.prevEpDate)}</>;
  }

  if (
    show.status !== "Ended" &&
    show.nextSeason &&
    show.nextEpDate &&
    !isWithinInterval(parseISO(show.nextEpDate), calendarBounds)
  ) {
    const returnMonth = fmt(show.nextEpDate);
    return <>back {returnMonth}</>;
  }
};

type Props = {
  shows: ScheduledShow[];
  onRemoveShow: (id: number) => void;
};

const Manager: FunctionComponent<Props> = ({ shows, onRemoveShow }) => {
  const [selectedShowId, setSelectedShowId] = useState<number>();
  const [showData, setShowData] = useState<ScheduledShow>();
  const containerRef = useRef<HTMLDivElement>(null);

  useClickAway(containerRef, () => setSelectedShowId(undefined));

  useEffect(() => {
    if (
      selectedShowId === undefined ||
      shows.find((s) => s.id === selectedShowId) === undefined
    ) {
      setShowData(undefined);
      return;
    }

    const fetchSelectedShow = async () => {
      setShowData(await getShowById(selectedShowId));
    };
    fetchSelectedShow();
  }, [selectedShowId, setSelectedShowId, shows]);

  return (
    <div
      ref={containerRef}
      className={classNames([
        "ts-manager",
        "grid",
        "gap-8",
        "list-none",
        "m0",
        "p0",
        "justify-self-stretch",
        `[grid-template-areas:"list_details""list_empty"]`,
        `[grid-template-columns:2fr_2fr]`,
      ])}
    >
      {showData && <ShowDetails show={showData} />}
      <ul className="ts-manager__showlist [grid-area:list] [align-self:start]">
        {shows.map((show) => (
          <li
            key={show.id}
            className={classNames(
              ["ts-manager__show", "cursor-default", "p-2"],
              {
                "bg-brand-300": show.id === selectedShowId,
              }
            )}
            onClick={() => setSelectedShowId(show.id)}
          >
            <span
              className="ts-manager__showimage rounded-4 aspect-square"
              style={{ backgroundImage: `url(${show.image})` }}
            />
            <span className="ts-manager__showname">{show.name}</span>
            <span className="ts-manager__showtime text-brand-700">
              {getShowComment(show)}
            </span>
            <span
              className="ts-manager__showclear"
              onClick={() => onRemoveShow(show.id)}
            >
              Remove
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Manager;
