export type VatsimEvent = {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  description: string;
};


export type EventContextParams = {
  events: VatsimEvent[];
  eventDates: Date[];
  eventsLoading: boolean;
};

export type CustomVatsimEvent = {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  description: string;
};