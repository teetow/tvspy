import { default as classNames, default as classnames } from "classnames";
import {
  add,
  addDays,
  endOfDay,
  format,
  intervalToDuration,
  isSameDay,
  startOfISOWeek,
  subDays,
} from "date-fns";
import { useEffect, useState } from "react";
import { getToday, range } from "../lib/utils";

import "./Week.scss";
import { getEpisodesWithin } from "../lib/show";
import { Ep, getShowById } from "../lib/fetchShow";

const msMult = 1000 * 60 * 60 * 24;

const getTimeToMidnight = (date: Date) => {
  const i = intervalToDuration({ start: date, end: endOfDay(date) });

  return (i.hours! * 60 + i.minutes!) * 60 + i.seconds!;
};

type DayProps = { name: string; date: Date; shows: string[] };

export const Day = ({ name, date, shows }: DayProps) => {
  const classes = classnames({
    "ts-day": true,
    "ts-day--is-current": isSameDay(date, getToday()),
  });

  return (
    <div className={classes}>
      <span className="ts-day__name">{name}</span>
      <span className="ts-day__day">{format(date, "dd")}</span>
      <div className="ts-day__events">
        {shows.map((show) => (
          <div key={show} className="ts-day__event">
            <span className="ts-day__event-showname">{show}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

type ScheduledEpisode = {
  showName: string;
  date: Date;
};

type Props = { showIds: number[] };

export const Week = ({ showIds }: Props) => {
  const [eps, setEps] = useState<ScheduledEpisode[]>();

  useEffect(() => {
    const fetchEps = async () => {
      const eps = (
        await Promise.all(
          showIds.map(async (show) => {
            const showInfo = await getShowById(show);
            const showEps = await getEpisodesWithin(show, start, end);

            return (showEps?.filter(Boolean) as Ep[]).map((showEp) => ({
              showName: showInfo.name,
              date: new Date(showEp.airdate),
            }));
          })
        )
      ).flat();

      setEps(eps);
    };
    fetchEps();
  }, [showIds, setEps]);

  const [today, setToday] = useState<Date>(getToday());
  const [start, setStart] = useState<Date>(new Date(subDays(today, 7)));
  const [end, setEnd] = useState<Date>(new Date(addDays(today, 7)));

  useEffect(() => {
    const weekStart = startOfISOWeek(today.getTime() - 7 * msMult);
    setStart(weekStart);
    setEnd(addDays(weekStart, 21));
  }, [today]);

  useEffect(() => {
    const secsToMidnight = getTimeToMidnight(getToday());
    let periodicHandle: NodeJS.Timer;

    const oneOffHandle = globalThis.setTimeout(() => {
      setToday(getToday());
      periodicHandle = setInterval(
        () => setToday(getToday()),
        1000 * 60 * 60 * 24
      );
    }, (secsToMidnight + 1) * 1000);

    return () => {
      globalThis.clearTimeout(oneOffHandle);
      if (periodicHandle) {
        globalThis.clearInterval(periodicHandle);
      }
    };
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
      {eps &&
        range(21).map((day) => {
          const ts = addDays(start, day);

          const todayEps = eps.filter((ep) => {
            return isSameDay(ts, ep.date);
          });

          return (
            <Day
              key={ts.getTime()}
              name={format(ts, "iii")}
              date={ts}
              shows={todayEps.map((ep) => ep.showName)}
            />
          );
        })}
    </div>
  );
};

export default Week;
