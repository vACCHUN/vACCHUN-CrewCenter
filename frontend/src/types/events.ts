export type VatsimEvent = {
  id: number;
  type: string;
  name: string;
  link: string;
  organisers: {
    region: string;
    division: string;
    subdivision: string | null;
    organised_by_vatsim: boolean;
  }[];
  airports: {
    icao: string;
  }[];
  routes: any[];
  start_time: string;
  end_time: string;
  short_description: string;
  description: string;
  banner: string;
};

export type EventContextParams = {
  events: VatsimEvent[];
  eventDates: Date[];
  eventsLoading: boolean;
}