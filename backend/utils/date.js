function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${year}.${month}.${day}. ${hours}:${minutes}`;
}

function isoToDateString(isoString) {
  return new Date(isoString).toISOString().split("T")[0];
}

function getBookingMinutesInsideEvent(event, startTime, endTime) {
  const eventStart = new Date(event.start_time).getTime();
  const eventEnd = new Date(event.end_time).getTime();

  const bookingStart = new Date(startTime).getTime();
  const bookingEnd = new Date(endTime).getTime();

  const overlapStart = Math.max(eventStart, bookingStart);
  const overlapEnd = Math.min(eventEnd, bookingEnd);

  if (overlapStart >= overlapEnd) {
    return 0;
  }

  const diffMs = overlapEnd - overlapStart;
  return Math.floor(diffMs / 60000);
}

function getHalfEventIntervalRoundedToFive(event) {
  const start = new Date(event.start_time).getTime();
  const end = new Date(event.end_time).getTime();

  const totalMinutes = (end - start) / 60000;
  const halfMinutes = totalMinutes / 2;

  return Math.ceil(halfMinutes / 5) * 5;
}

function isEventWithinNext24HoursUTC(event) {
  const nowUtcMs = Date.now();
  const startUtcMs = new Date(event.start_time).getTime();

  const MS_IN_24_HOURS = 24 * 60 * 60 * 1000;

  if (startUtcMs <= nowUtcMs) {
    return true;
  }

  const timeToEventMs = startUtcMs - nowUtcMs;

  return timeToEventMs <= MS_IN_24_HOURS;
}

module.exports = {
  formatDate,
  isoToDateString,
  getBookingMinutesInsideEvent,
  getHalfEventIntervalRoundedToFive,
  isEventWithinNext24HoursUTC,
};
