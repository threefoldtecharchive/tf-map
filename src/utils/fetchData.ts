import { json, csv } from "d3-fetch";
import { feature } from "topojson-client";
import { geoMercator, geoPath } from "d3-geo";

const PROJECTION = geoMercator();
const PATH_GENERATOR = geoPath().projection(PROJECTION);
const DATA_URL = "https://unpkg.com/world-atlas@1.1.4/world/110m.json";
const NAMES_URL = "https://cdn.jsdelivr.net/gh/lukes/ISO-3166-Countries-with-Regional-Codes@master/all/all.csv"; // prettier-ignore

export interface Country {
  id: string;
  name: string;
  d: string;
}

export function fetchData(): Promise<Country[]> {
  let m: Map<string, string>;

  return csv(NAMES_URL)
    .then((cs) => {
      return cs.reduce((res, c) => {
        return res.set(c["country-code"], c["name"]);
      }, new Map<string, string>());
    })
    .then((_m) => (m = _m))
    .then(() => json<any>(DATA_URL))
    .then<any>((data) => feature(data, data.objects.countries))
    .then((countries) => countries.features)
    .then((features) => {
      return features.map((f) => {
        return {
          id: f.id,
          name: m.get(f.id),
          d: PATH_GENERATOR(f),
        };
      });
    })
    .then((countries) => countries.filter((c) => !!c.name));
}
