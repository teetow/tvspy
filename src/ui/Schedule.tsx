import { useEffect, useState } from "react";
import { getShow, ScheduledShow } from "../lib/fetchShow";
import Week from "./Week";

import "./Schedule.scss";

type Props = {
  shows: string[];
  onSetShows: React.Dispatch<React.SetStateAction<string[]>>;
};

type ShowMap = Record<number, ScheduledShow>;

const Schedule = ({ shows, onSetShows }: Props) => {
  const [showData, setShowData] = useState<ShowMap>({});

  useEffect(() => {
    shows.forEach((show) => {
      getShow(show).then((res) => {
        setShowData((prev) => ({ ...prev, [res.id]: res }));
      });
    });
  }, [shows, setShowData]);

  const filteredShows = Object.values(showData).filter((sd) =>
    shows.includes(sd.name)
  );

  return (
    <div className="ts-schedule">
      <Week showEvents={filteredShows} />

      <ul className="ts-schedule__showlist">
        {filteredShows.map((show) => (
          <li key={show.id} className="ts-schedule__show">
            <span
              className="ts-schedule__showimage"
              style={{ backgroundImage: `url(${show.image})` }}
            />
            <span className="ts-schedule__showname">{show.name}</span>
            <span
              className="ts-schedule__showclear"
              onClick={() => {
                onSetShows((prev) => prev.filter((item) => item !== show.name));
              }}
            >
              Remove
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Schedule;
