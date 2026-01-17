export function getDateTime(): string {
  const date: Date = new Date();

  const months = ["jan", "feb", "márc", "ápr", "máj", "jún", "júl", "aug", "szept", "okt", "nov", "dec"];

  const formatted = `${months[date.getUTCMonth()]}. ${date.getUTCDate()}. ${date.getUTCHours().toString().padStart(2, "0")}:${date.getUTCMinutes().toString().padStart(2, "0")}:${date.getUTCSeconds().toString().padStart(2, "0")}`;

  return formatted;
}
