function isEventBooking(startTime, endTime, events) {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();

  for (const event of events) {
    const eventStart = new Date(event.start_time).getTime();
    const eventEnd = new Date(event.end_time).getTime();

    const overlap = start < eventEnd && end > eventStart;
    if (overlap) {
      return true;
    }
  }

  return false;
}

module.exports = { isEventBooking };
