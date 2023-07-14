import { describe, expect, it } from "vitest";
import { getEpisodesWithin, getShow, getShowSeasonAt } from "./show";

describe("getShow", () => {
  it("returns undefined", async () => {
    expect(await getShow("")).toBeUndefined();
  });

  it("returns a show for a string", async () => {
    expect(await getShow("Foundation")).toHaveProperty("name", "Foundation");
  });

  it("returns a show for an id", async () => {
    expect(await getShow(35951)).toHaveProperty("name", "Foundation");
  });
});

describe("getShowSeasonAt", () => {
  it("returns undefined", async () => {
    expect(await getShowSeasonAt("", new Date())).toBeUndefined();
  });

  it("returns a season for a valid date", async () => {
    const season = await getShowSeasonAt("Foundation", new Date("2023-07-14"));
    expect(season?.number).toBe(2);
  });
});

describe("getEpisodesWithin", () => {
  it("returns undefined", async () => {
    expect(await getEpisodesWithin("", new Date(), new Date())).toBeUndefined();
  });

  it("returns episodes for a valid show", async () => {
    expect(
      await getEpisodesWithin(
        "Foundation",
        new Date("2020-01-01"),
        new Date("2024-01-01")
      )
    ).not.toBeUndefined();
  });

  it("finds a specific episode", async () => {
    const eps = await getEpisodesWithin(
      "Foundation",
      new Date("2023-07-13"),
      new Date("2023-07-15")
    );

    expect(eps?.length).toBe(1);
  });

  it("finds episodes within a range", async () => {
    const eps = await getEpisodesWithin(
      "Foundation",
      new Date("2023-07-01"),
      new Date("2023-07-31")
    );
    expect(eps?.length).toBe(3);
  });
});
