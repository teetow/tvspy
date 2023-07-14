import {
  addSeconds,
  compareDesc,
  isWithinInterval,
  parseISO,
  startOfDay,
} from "date-fns";

const apiUrl = "https://api.tvmaze.com";

type ShowStatus = "Running" | "In Development" | "Ended" | "To Be Determined";

type Show = {
  _links: {
    self: { href: string };
    nextepisode: { href: string };
    previousepisode: { href: string };
  };
  dvdCountry: any; // null
  ended: string; // null
  externals: { [key: string]: string }; // {tvrage: null, thetvdb: 328711, imdb: 'tt5171438'}
  genres: string[]; // (3) ['Drama', 'Adventure', 'Science-Fiction']
  id: number; // 7480
  image: { medium: string }; // {medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/364/911588.jpg', original: 'https://static.tvmaze.com/uploads/images/original_untouched/364/911588.jpg'}
  language: string; // 'English'
  name: string; // 'Star Trek: Discovery'
  network: any; // null
  officialSite: string; // 'https://www.paramountplus.com/shows/star-trek-discovery/'
  premiered: string; // '2017-09-24'
  rating: { average: number }; // {average: 7.7}
  runtime: string; // null
  schedule: { time: string; days: string[] }; // {time: '', days: Array(1)}
  status: ShowStatus; // 'Running'
  summary: string; // '<p>Star Trek, one of the most iconic and influential global television franchises, returns 50 years after it first premiered, with <b>Star Trek: Discovery</b>. The series will feature a new ship, new characters and new missions, while embracing the same ideology and hope for the future that inspired a generation of dreamers and doers.</p>'
  type: string; // 'Scripted'
  updated: string; // 1639679749
  url: string; // 'https://www.tvmaze.com/shows/7480/star-trek-discovery'
  webChannel: { id: number; name: string; country: string }; // {id: 107, name: 'Paramount+', country: null}
  weight: number; // 100
};

export type Hit = {
  score: number;
  show: Show;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type UnknownEp = {
  code: number;
  message: string;
  name: string;
  status: number;
};

export type Ep = {
  id: number; //: 2040855,
  url: string; //: "https://www.tvmaze.com/episodes/2040855/battlebots-5x14-the-world-championship-finals",
  name: string; //: "The World Championship Finals",
  season: number; //: 5,
  number: number; //: 14,
  type: string; //: "regular",
  airdate: string; //: "2021-03-11",
  airtime: string; //: "20:00",
  airstamp: string; //: "2021-03-12T01:00:00+00:00",
  runtime: number; //: 120,
  rating: {
    average: number; //: 8
  };
  image: string; //: null,
  summary: string; //: "<p>The BattleBots World Championship Tournament reaches its climax as the remaining eight bots battle to hoist The Giant Nut. Who will be crowned champion of the world?</p>",
  _links: string; //: {
  self: {
    href: string; //: "https://api.tvmaze.com/episodes/2040855"
  };
};

export type Season = {
  id: number; // 68223,
  url: string; // "https://www.tvmaze.com/seasons/68223/the-witcher-season-1",
  number: number; // 1,
  name: string; //"",
  episodeOrder: number; // 8,
  premiereDate: string; //"2019-12-20",
  endDate: string; //"2019-12-20",
  network: string; //null,
  webChannel: {
    id: number; //1,
    name: string; //"Netflix",
    country: string; //null
  };
  image: {
    medium: string; //"https://static.tvmaze.com/uploads/images/medium_portrait/232/580518.jpg";
    original: string; //"https://static.tvmaze.com/uploads/images/original_untouched/232/580518.jpg";
  };
  summary: string; //"<p>Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts.</p>";
  _links: {
    self: {
      href: string; //"https://api.tvmaze.com/seasons/68223";
    };
  };
};

export const fetchJson = async <T extends unknown>(query: string) => {
  return await fetch(query)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      }
    })
    .then((res: T) => res as T)
    .catch((error) => {
      console.log("error in fetchJson: ", error);
      return error;
    });
};

export type ScheduledShow = {
  name: string;
  id: number;
  day: string;
  url: string;
  premiereDate?: string;
  prevEpDate?: string;
  nextEpDate?: string;
  image?: string;
  status?: ShowStatus;
  currentSeason?: Season;
  prevSeason?: Season;
  nextSeason?: Season;
  seasonStatus?: "Running" | "Hiatus";
};

const parseShow = async (show: Show) => {
  let outData = {
    name: show.name,
    id: show.id,
    day: show.schedule.days[0],
    premiereDate: show.premiered,
    url: show._links.self.href,
    image: show.image.medium,
    status: show.status,
  } as ScheduledShow;

  const seasons = (await fetchJson<Season[]>(
    `${apiUrl}/shows/${show.id}/seasons`
  )) as Season[];

  let prevSeason: Season | undefined = undefined;
  let nextSeason: Season | undefined = undefined;

  const currentSeason = seasons.find((s) => {
    return s.premiereDate && s.endDate
      ? isWithinInterval(addSeconds(startOfDay(new Date()), 1), {
          start: parseISO(s.premiereDate),
          end: parseISO(s.endDate),
        })
      : false;
  });

  if (currentSeason) {
    const maybePrevSeason = seasons.find(
      (s) => s.number === currentSeason.number - 1
    );
    if (maybePrevSeason) {
      prevSeason = maybePrevSeason;
    }
  } else {
    prevSeason = seasons
      .filter((s) => parseISO(s.endDate) < new Date())
      .sort((a, b) =>
        compareDesc(parseISO(a.premiereDate), parseISO(b.premiereDate))
      )[0];

    const maybeNextSeason =
      show.status !== "Ended" &&
      seasons.find((s) => parseISO(s.premiereDate) > new Date());
    if (maybeNextSeason) nextSeason = maybeNextSeason;
  }

  outData = {
    ...outData,
    ...{
      seasonStatus: currentSeason ? "Running" : "Hiatus",
      currentSeason: currentSeason,
      prevSeason: prevSeason,
      nextSeason: nextSeason,
    },
  };

  const prevEp = show?._links?.previousepisode?.href
    ? ((await fetchJson<Ep>(show._links.previousepisode?.href)) as Ep)
    : undefined;

  let nextEp = show?._links?.nextepisode?.href
    ? ((await fetchJson<Ep>(show._links.nextepisode?.href)) as Ep)
    : undefined;

  if (currentSeason) {
    let season = currentSeason;
    if (prevEp && prevEp.season === currentSeason.number) {
      nextEp = await fetchJson<Ep>(
        `${apiUrl}/shows/${show.id}/episodebynumber?season=${
          season?.number
        }&number=${prevEp.number + 1}&currentSeason`
      );
    } else {
      // we're at the start of a new season
      nextEp = await fetchJson<Ep>(
        `${apiUrl}/shows/${show.id}/episodebynumber?season=${
          season?.number
        }&number=${2}&currentSeason`
      );
    }
  } else if (nextSeason) {
    nextEp = await fetchJson<Ep>(
      `${apiUrl}/shows/${show.id}/episodebynumber?season=${nextSeason?.number}&number=1&nextSeason`
    );
  }

  outData = {
    ...outData,
    ...({
      prevEpDate: prevEp ? prevEp.airdate : null,
      nextEpDate: nextEp ? nextEp.airdate : null,
    } as ScheduledShow),
  };

  return outData;
};

export const searchShows = async (query: string) => {
  return (await fetchJson<Hit[]>(
    `${apiUrl}/search/shows?q=${encodeURIComponent(query)}`
  )) as Promise<Hit[]>;
};

export const getShowById = async (id: number) => {
  const showData = (await fetchJson<Show>(
    `${apiUrl}/shows/${id}`
  )) as Promise<Show>;
  return parseShow(await showData);
};
