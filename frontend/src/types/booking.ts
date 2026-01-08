export type BookingData = {
  startDate: string;
  endDate: string;
  startHour: number;
  endHour: number;
  startMinute: number;
  endMinute: number;
  sector: string;
  subSector: string;
  is_exam: boolean;
  eventManagerInitial?: string;
};

export type BookingEditData = {
  cid: string;
  startTime: string;
  endTime: string;
  id: number;
  initial: string;
  name: string;
  sector: string;
  subSector: string;
  training: number;
};

export type Booking = {
  id: number;
  initial: string;
  cid: string;
  name: string;
  startTime: string;
  endTime: string;
  sector: string;
  subSector: string;
  training: number;
  is_exam: boolean;
  created_at?: string,
  updated_at?: string,
};
