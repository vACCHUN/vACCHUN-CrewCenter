function filterEventOverlap(todaysEvents) {
  const filteredTodaysEvents = [];

  for (const event of todaysEvents) {
    const eventStart = new Date(event.start_time).getTime();
    const eventEnd = new Date(event.end_time).getTime();
    const eventLength = eventEnd - eventStart;

    let overlapped = false;

    for (let i = filteredTodaysEvents.length - 1; i >= 0; i--) {
      const existing = filteredTodaysEvents[i];
      const existingStart = new Date(existing.start_time).getTime();
      const existingEnd = new Date(existing.end_time).getTime();
      const existingLength = existingEnd - existingStart;

      const overlaps = eventStart < existingEnd && eventEnd > existingStart;

      if (overlaps) {
        if (eventLength > existingLength) {
          filteredTodaysEvents.splice(i, 1);
        } else if (eventLength < existingLength) {
          overlapped = true;
          break;
        }
      }
    }

    if (!overlapped) {
      filteredTodaysEvents.push(event);
    }
  }

  return filteredTodaysEvents;
}
module.exports = { filterEventOverlap };
