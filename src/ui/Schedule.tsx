import { useEffect, useState } from "react";
import { Ep, fetchJson, Hit } from "../lib/fetchShow";

console.clear();

type ScheduledShow = {
  name: string;
  id: number;
  day: string;
  url: string;
  prevEpDate?: string;
  nextEpDate?: string;
};

type ShowProps = {
  query: string;
};

const parseShow = async (hit: Hit) => {
  const prevEp = await fetchJson<Ep>(hit.show._links.previousepisode.href);
  let nextEp;
  if (prevEp) {
    nextEp = await fetchJson<Ep>(
      `https://api.tvmaze.com/shows/${hit.show.id}/episodebynumber?season=${
        prevEp.season
      }&number=${prevEp.number + 1}`
    );
  }

  return {
    name: hit.show.name,
    id: hit.show.id,
    day: hit.show.schedule.days[0],
    url: hit.show._links.self.href,
    prevEpDate: prevEp.airdate,
    nextEpDate: nextEp ? nextEp.airdate : null,
  } as ScheduledShow;
};

export const getShow = async (query: string) => {
  const showData = await fetchJson<Hit[]>(
    `https://api.tvmaze.com/search/shows?q=${query}`
  );

  return parseShow(showData[0]);
};

const Show = ({ query }: ShowProps) => {
  const [showData, setShowData] = useState<ScheduledShow[]>([]);

  useEffect(() => {
    getShow(query).then((res) => {
      setShowData((prev) => [...prev, res]);
    });
  }, [query, setShowData]);

  return (
    <div className="ts-show">
      <pre>{JSON.stringify(showData[0], null, 2)}</pre>
    </div>
  );
};

type Props = {
  shows: string[];
};

const Schedule = ({ shows }: Props) => {
  return (
    <div className="ts-schedule">
      {shows.map((show) => (
        <Show key={show} query={show} />
      ))}
    </div>
  );
};

export default Schedule;
