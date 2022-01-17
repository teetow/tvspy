import { format, isWithinInterval, startOfISOWeek } from "date-fns";
import { parseISO } from "date-fns/esm";
import { FunctionComponent } from "react";

import { ScheduledShow } from "../lib/fetchShow";
import { getToday } from "../lib/utils";

import "./Manager.scss";

type Props = {
  shows: ScheduledShow[];
  onRemoveShow: (id: number) => void;
};

const msMult = 1000 * 60 * 60 * 24;

const Manager: FunctionComponent<Props> = ({ shows, onRemoveShow }) => {
  const now = getToday();
  const calendarStart = startOfISOWeek(now.getTime() - 7 * msMult);

  const calendarBounds = {
    start: calendarStart,
    end: new Date(calendarStart.getTime() + 21 * msMult),
  };

  const getNextEp = (show: ScheduledShow) => {
    if (
      show.nextEpDate &&
      !isWithinInterval(parseISO(show.nextEpDate), calendarBounds)
    ) {
      const returnMonth = format(parseISO(show.nextEpDate), "dd MMMM");
      return <>(Back {returnMonth})</>;
    }
  };

  return (
    <ul className="ts-manager">
      {shows.map((show) => (
        <li key={show.id} className="ts-manager__show">
          <span
            className="ts-manager__showimage"
            style={{ backgroundImage: `url(${show.image})` }}
          />
          <span className="ts-manager__showname">{show.name}</span>
          <span className="ts-manager__showtime">{getNextEp(show)}</span>
          <span
            className="ts-manager__showclear"
            onClick={() => onRemoveShow(show.id)}
          >
            Remove
          </span>
        </li>
      ))}
    </ul>
  );
};

export default Manager;
