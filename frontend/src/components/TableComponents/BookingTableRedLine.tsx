import { useState, useEffect } from "react";

type UTCTime = {
  row: number;
  time: Date;
};

function BookingTableRedLine({ cols }: { cols: string[] }) {
  const [currentUTCTime, setCurrentUTCTime] = useState<UTCTime | null>(null);
  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
      const row = Math.round(utcMinutes / 5) + 12;
      setCurrentUTCTime({ row, time: now });
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 60000);

    return () => clearInterval(interval);
  }, []);

  function formatTime() {
    const now = new Date();
    let hours = now.getUTCHours().toString().padStart(2, "0");
    let minutes = now.getUTCMinutes().toString().padStart(2, "0");
    let formattedTime = `${hours}:${minutes}`;
    return formattedTime;
  }

  return (
    currentUTCTime && (
      <div
        className="current-time-line"
        style={{
          gridRowStart: currentUTCTime.row + 12,
          gridRowEnd: currentUTCTime.row + 12,
          gridColumnStart: 2,
          gridColumnEnd: cols.length + 2,
        }}
      >
        <div className="current-time-label">{formatTime()}</div>
      </div>
    )
  );
}

export default BookingTableRedLine;
