import { EventContextParams } from "../types/events";
import { convertToDate } from "../utils/DateTimeFormat";

export const mockEventContext: EventContextParams = {
  events: [
    {
      id: 1,
      type: "fly-in",
      name: "Cross the Pond Eastbound",
      link: "https://ctpe.vatsim.net",
      organisers: [
        {
          region: "Europe",
          division: "VATEUD",
          subdivision: "UK",
          organised_by_vatsim: true,
        },
      ],
      airports: [{ icao: "EGLL" }, { icao: "EDDF" }],
      routes: [],
      start_time: "2025-04-20T13:00:00Z",
      end_time: "2025-04-20T19:00:00Z",
      short_description: "Annual eastbound transatlantic event",
      description: "One of VATSIM's biggest events, connecting Europe and North America.",
      banner: "https://vatsim.net/images/ctp-banner.jpg",
    },
    {
      id: 2,
      type: "regional",
      name: "Light Up America",
      link: "https://vatusa.net/events",
      organisers: [
        {
          region: "North America",
          division: "VATUSA",
          subdivision: null,
          organised_by_vatsim: false,
        },
      ],
      airports: [{ icao: "KJFK" }, { icao: "KLAX" }],
      routes: [],
      start_time: "2025-05-15T18:00:00Z",
      end_time: "2025-05-15T23:59:00Z",
      short_description: "Coverage all over the US!",
      description: "Join us as we light up the skies over the entire USA with full ATC coverage.",
      banner: "https://vatsim.net/images/light-up-banner.jpg",
    },
  ],
  eventDates: [convertToDate("2025-04-20"), convertToDate("2025-05-15")],
  eventsLoading: false,
};
