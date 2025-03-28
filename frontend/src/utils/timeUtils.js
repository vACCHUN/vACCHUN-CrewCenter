export function minutesFromMidnight(dateTimeString) {
  const date = new Date(dateTimeString);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  return hours * 60 + minutes;
}

export function formatBookingTime(time) {
  let date = new Date(time);
  let hours = date.getUTCHours().toString().padStart(2, "0");
  let minutes = date.getUTCMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function calculateMinutesBetween(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const diffMs = end - start;

  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  return diffMinutes;
}