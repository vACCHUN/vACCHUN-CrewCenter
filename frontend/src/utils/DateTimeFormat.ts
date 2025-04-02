import { format } from "date-fns";

function dateTimeFormat(date: string): string {
  return format(date, "yyyy-MM-dd");
}

export default dateTimeFormat;
