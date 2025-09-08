function isTimeInBooking(time, booking) {
  const targetHours = time.hours;
  const targetMinutes = time.minutes;

  const startTime = new Date(booking.startTime);
  const endTime = new Date(booking.endTime);

  const targetTime = new Date(booking.startTime);
  targetTime.setHours(targetHours, targetMinutes, 0, 0);

  return targetTime >= startTime && targetTime < endTime;
}

function sectorToString(sector, subSector) {
  return `${sector} | ${subSector}`;
}

function sumTimes(time1, time2) {
  // Convert both times to total minutes
  const totalMinutes1 = time1.hours * 60 + time1.minutes;
  const totalMinutes2 = time2.hours * 60 + time2.minutes;

  // Sum the total minutes
  let totalMinutes = totalMinutes1 + totalMinutes2;

  // Calculate hours and minutes from total minutes
  let hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  hours = hours % 24;

  return {
    hours: hours,
    minutes: minutes,
  };
}

module.exports = { isTimeInBooking, sectorToString, sumTimes };
