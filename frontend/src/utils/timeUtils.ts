import { convertToDate } from "./DateTimeFormat";

export function minutesFromMidnight(dateTimeString: string) {
  const date = new Date(dateTimeString);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  return hours * 60 + minutes;
}

export function formatBookingTime(time: string) {
  let date = new Date(time);
  let hours = date.getUTCHours().toString().padStart(2, "0");
  let minutes = date.getUTCMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function calculateMinutesBetween(startTime: string, endTime: string) {
  const start: Date = new Date(startTime);
  const end: Date = new Date(endTime);

  const diffMs: number = end.getTime() - start.getTime();

  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  return diffMinutes;
}
