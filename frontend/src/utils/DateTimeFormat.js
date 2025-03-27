import { format } from "date-fns";

function dateTimeFormat(date) {
  return format(date, "yyyy-MM-dd");
}

export default dateTimeFormat;
