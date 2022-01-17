import classnames from "classnames";
import { format, isSameDay, parseISO, startOfISOWeek } from "date-fns";
import { ScheduledShow } from "../lib/fetchShow";
import { getToday, range } from "../lib/utils";

import "./Week.scss";

const msMult = 1000 * 60 * 60 * 24;

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
      {showEvents.map((event) => (
        <div key={event.name} className="ts-day__event">
          <span className="ts-day__event-showname">{event.name}</span>
        </div>
      ))}
    </div>
  );
};

type Props = { showEvents: ShowEvent[] };

export const Week = ({ showEvents }: Props) => {
  const now = getToday();
  const weekStart = startOfISOWeek(now.getTime() - 7 * msMult);

  return (
    <div className="ts-week">
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
