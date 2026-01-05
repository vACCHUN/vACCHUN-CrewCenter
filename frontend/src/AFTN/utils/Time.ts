export function subtractMinutes(time: string, minutesToSubtract: number): string {
  const [hoursStr, minutesStr] = time.split(":");
  let hours = parseInt(hoursStr, 10);
  let minutes = parseInt(minutesStr, 10);

  let totalMinutes = hours * 60 + minutes - minutesToSubtract;
  totalMinutes = (totalMinutes + 24 * 60) % (24 * 60);

  const newHours = Math.floor(totalMinutes / 60);
  const newMinutes = totalMinutes % 60;

  return `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`;
}

export function getTimeDifferenceUtc(targetTime: string): number {
  const [hoursStr, minutesStr] = targetTime.split(":");
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  const now = new Date();

  const nowMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();

 
  const targetMinutes = hours * 60 + minutes;

  let diff = targetMinutes - nowMinutes;

  if (diff > 12 * 60) {
    diff -= 24 * 60; 
  } else if (diff < -12 * 60) {
    diff += 24 * 60; 
  }

  return diff;
}
