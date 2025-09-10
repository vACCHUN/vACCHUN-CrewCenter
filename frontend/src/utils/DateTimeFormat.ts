
function dateTimeFormat(date: Date): string {
  return date.toISOString().split("T")[0];
}

function convertToDate(date?: string | number): Date {
  if (!date) return new Date();
  return new Date(date + "T12:00:00");
}
export {dateTimeFormat, convertToDate};
