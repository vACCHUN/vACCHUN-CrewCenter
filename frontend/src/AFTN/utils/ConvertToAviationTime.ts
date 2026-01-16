export function convertToAviationTime(isoString: string): string {
  const date = new Date(isoString);

  const day = String(date.getUTCDate()).padStart(2, "0");
  const hour = String(date.getUTCHours()).padStart(2, "0");
  const minute = String(date.getUTCMinutes()).padStart(2, "0");

  return `${day}${hour}${minute}`;
}
