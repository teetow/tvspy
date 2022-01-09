import { useEffect, useState } from "react";
import { getShow, ScheduledShow } from "../lib/fetchShow";
import Week from "./Week";

console.clear();

type ShowProps = {
  show: ScheduledShow;
};

const Show = ({ show }: ShowProps) => {
  return (
    <div className="ts-show">
      <pre>{JSON.stringify(show, null, 2)}</pre>
    </div>
  );
};

type Props = {
  shows: string[];
};

type ShowMap = Record<number, ScheduledShow>;

const Schedule = ({ shows }: Props) => {
  const [showData, setShowData] = useState<ShowMap>({});

  useEffect(() => {
    shows.forEach((show) => {
      getShow(show).then((res) => {
        setShowData((prev) => ({ ...prev, [res.id]: res }));
      });
    });
  }, [shows, setShowData]);

  return (
    <div className="ts-schedule">
      <Week showEvents={Object.values(showData)} />
      <pre style={{ fontSize: "0.3em" }}>
        {Object.values(showData).map((show) => (
          <Show key={show.id} show={show} />
        ))}
      </pre>
    </div>
  );
};

export default Schedule;
