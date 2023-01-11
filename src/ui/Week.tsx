import { default as classNames, default as classnames } from "classnames";
import {
  endOfDay,
  format,
  intervalToDuration,
  isSameDay,
  parseISO,
  startOfISOWeek,
} from "date-fns";
import { useEffect, useState } from "react";
import { ScheduledShow } from "../lib/fetchShow";
import { getToday, range } from "../lib/utils";

import "./Week.scss";

const msMult = 1000 * 60 * 60 * 24;

const getTimeToMidnight = (date: Date) => {
  const i = intervalToDuration({ start: date, end: endOfDay(date) });

  return (i.hours! * 60 + i.minutes!) * 60 + i.seconds!;
};

type ShowEvent = ScheduledShow;

type DayProps = { name: string; date: Date; showEvents: ShowEvent[] };

export const Day = ({ name, date, showEvents }: DayProps) => {
  const classes = classnames({
    "ts-day": true,
    "ts-day--is-current": isSameDay(date, getToday()),
  });

  return (
    <div className={classes}>
      <span className="ts-day__name">{name}</span>
      <span className="ts-day__day">{format(date, "dd")}</span>
      <div className="ts-day__events">
        {showEvents.map((event) => (
          <div key={event.name} className="ts-day__event">
            <span className="ts-day__event-showname">{event.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

type Props = { showEvents: ShowEvent[] };

export const Week = ({ showEvents }: Props) => {
  const [now, setNow] = useState(getToday());
  const weekStart = startOfISOWeek(now.getTime() - 7 * msMult);

  useEffect(() => {
    const secsToMidnight = getTimeToMidnight(getToday());

    console.log(`midnight in ${secsToMidnight}`);
    const handle = globalThis.setTimeout(() => {
      setNow(getToday());
    }, secsToMidnight * 1000);

    return () => globalThis.clearTimeout(handle);
  });

  return (
    <div
      className={classNames([
        "ts-week",
        "grid",
        "gap-1",
        "[grid-template-columns:repeat(7,_1fr)]",
        "[grid-template-rows:repeat(3,_8em)]",
      ])}
    >
      {range(21).map((day) => {
        const currentTs = new Date(weekStart.getTime() + day * msMult);

        const todayShows = showEvents.filter((ev) => {
          return (
            isSameDay(currentTs, parseISO(ev.prevEpDate || "")) ||
            isSameDay(currentTs, parseISO(ev.nextEpDate || ""))
          );
        });

        return (
          <Day
            key={currentTs.getTime()}
            name={format(currentTs, "iii")}
            date={currentTs}
            showEvents={todayShows}
          />
        );
      })}
    </div>
  );
};

export default Week;
