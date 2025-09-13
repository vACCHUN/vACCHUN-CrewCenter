export type VatsimEvent = {
  name: string;
  start_time: string;
  end_time: string;
  description: string;
};

export type CustomVatsimEvent = VatsimEvent & {
  id: number;
};

export type EventContextParams = {
  events: VatsimEvent[];
  eventDates: Date[];
  eventsLoading: boolean;
};
