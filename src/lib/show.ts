import { isWithinInterval } from "date-fns";
import {
  Ep,
  ScheduledShow,
  Season,
  fetchJson,
  getSeasonEpisodes,
  searchShows,
} from "./fetchShow";

const apiUrl = "https://api.tvmaze.com";

const getShowById = async (show: number) => {
  return (await fetchJson(`${apiUrl}/shows/${show}`)) as ScheduledShow;
};

export const getSeasonsByShowId = async (id: string | number) => {
  return (await fetchJson<Season[]>(
    `${apiUrl}/shows/${id}/seasons`
  )) as Season[];
};

export const getShow = async (show: string | number) => {
  if (typeof show === "number") return await getShowById(show);
  else {
    const shows = await searchShows(show);
    if (shows.length > 0) {
      return await getShowById(shows[0].show.id);
    }
  }
};

export const getShowSeasonAt = async (show: string | number, date: Date) => {
  const foundShow = await getShow(show);
  if (!foundShow) return;

  const seasons = await getSeasonsByShowId(foundShow.id);

  const currentSeason = seasons.find((season) => {
    return isWithinInterval(date, {
      start: new Date(season.premiereDate),
      end: new Date(season.endDate),
    });
  });

  return currentSeason;
};

export const getEpisodesWithin = async (
  show: string | number,
  startDate: Date,
  endDate: Date
) => {
  if (!show) {
    return;
  }
  const foundShow = await getShow(show);

  if (foundShow) {
    const seasons = await getSeasonsByShowId(foundShow.id);

    const episodes = (
      await Promise.all(
        seasons.map(async (s) => (await getSeasonEpisodes(s.id)) as Ep[])
      )
    ).flat();

    return episodes.filter((ep) =>
      isWithinInterval(new Date(ep.airdate), { start: startDate, end: endDate })
    );
  }
};
