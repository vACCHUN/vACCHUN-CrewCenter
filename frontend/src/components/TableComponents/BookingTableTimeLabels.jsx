import React, { useState, useEffect } from "react";

function BookingTableTimeLabels() {
  const [times, setTimes] = useState([]);

  useEffect(() => {
    let timesArr = [];
    for (let i = 0; i < 24; i++) {
      timesArr.push(`${i}:00 - ${i + 1}:00`);
    }
    setTimes(timesArr);
  }, []);

  return times.map((time, key) => {
    let currRow = key * 12 + 24;
    return (
      <div
        key={`time-${key}`}
        className="subheader"
        style={{
          gridRowStart: currRow,
          gridRowEnd: currRow + 12,
          gridColumnStart: 1,
          gridColumnEnd: 2,
          fontSize: 14,
        }}
      >
        {time}
      </div>
    );
  });
}

export default BookingTableTimeLabels;
