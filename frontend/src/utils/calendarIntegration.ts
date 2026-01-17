import { BookingData } from "../types/booking";

function formatUTCForGoogle(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export function generateGoogleCalendarLink(startDate: string, endDate: string, startHour: number, startMinute: number, endHour: number, endMinute: number, sector: string, subSector: string) {
  const title = `${sector}/${subSector} Beültetés - ${startDate.replace(/-/g, ".")} @ vACCHUN`;

  const startDateUTC = new Date(Date.UTC(Number(startDate.split("-")[0]), Number(startDate.split("-")[1]) - 1, Number(startDate.split("-")[2]), startHour, startMinute));

  const endDateUTC = new Date(Date.UTC(Number(endDate.split("-")[0]), Number(endDate.split("-")[1]) - 1, Number(endDate.split("-")[2]), endHour, endMinute));

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${formatUTCForGoogle(startDateUTC)}/${formatUTCForGoogle(endDateUTC)}`,
    details: `vACCHUN Booking: ${sector}/${subSector}\nCreated by vACCHUN CrewCenter`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function formatUTCForICS(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export function generateAppleCalendarICS(startDate: string, endDate: string, startHour: number, startMinute: number, endHour: number, endMinute: number, sector: string, subSector: string) {
  const title = `${sector}/${subSector} Beültetés - ${startDate.replace(/-/g, ".")} @ vACCHUN`;

  const startDateUTC = new Date(Date.UTC(Number(startDate.split("-")[0]), Number(startDate.split("-")[1]) - 1, Number(startDate.split("-")[2]), startHour, startMinute));

  const endDateUTC = new Date(Date.UTC(Number(endDate.split("-")[0]), Number(endDate.split("-")[1]) - 1, Number(endDate.split("-")[2]), endHour, endMinute));

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//vACCHUN//CrewCenter//EN",
    "BEGIN:VEVENT",
    `UID:${crypto.randomUUID()}@vacchun`,
    `DTSTAMP:${formatUTCForICS(new Date())}`,
    `DTSTART:${formatUTCForICS(startDateUTC)}`,
    `DTEND:${formatUTCForICS(endDateUTC)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:vACCHUN Booking: ${sector}/${subSector}\\nCreated by vACCHUN CrewCenter`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return icsContent;
}
