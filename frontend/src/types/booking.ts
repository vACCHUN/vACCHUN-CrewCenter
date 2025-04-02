export type BookingData = {
  startDate: string;
  endDate: string;
  startHour: number;
  endHour: number;
  startMinute: number;
  endMinute: number;
  sector: string;
  subSector: string;
  eventManagerInitial?: string;
};

export type BookingEditData = {
  cid: number;
  startTime: string;
  endTime: string;
  id: number;
  initial: string;
  name: string;
  sector: string;
  subSector: string;
  training: number;
}