type Show = {
  _links: { self: { href: string }; previousepisode: { href: string } };
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
  status: string; // 'Running'
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

export const fetchJson = async <T>(query: string) => {
  return await fetch(query)
    .then((res) => {
      if (res.status === 200) return res.json();
    })
    .then((res) => res as T);
};
