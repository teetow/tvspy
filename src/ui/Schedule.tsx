import { ScheduledShow } from "../lib/fetchShow";
import Week from "./Week";

import "./Schedule.scss";

type Props = {
  shows: ScheduledShow[];
};

const Schedule = ({ shows }: Props) => {
  return (
    <div className="ts-schedule">
      <Week showEvents={shows} />
    </div>
  );
};

export default Schedule;
