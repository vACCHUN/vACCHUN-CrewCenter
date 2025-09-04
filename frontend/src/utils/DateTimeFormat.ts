import { format } from "date-fns";

function dateTimeFormat(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export default dateTimeFormat;
