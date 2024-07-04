import React, { useEffect } from 'react';
import './BookingTable.css';

const BookingTable = ({ bookings, selectedDate }) => {
  useEffect(() => {
    const tableBody = document.getElementById('table-body');

    function getMinutesSinceMidnight(dateString) {
      const date = new Date(dateString);
      return date.getUTCHours() * 60 + date.getUTCMinutes();
    }

    const positions = ['BTWR', 'SV', 'ADC', 'GRC', 'TPC', 'CDC', 'rTWR'];
    const intervalMinutes = 5;
    const matrix = [];

    for (let i = 0; i < 24 * 60; i += intervalMinutes) {
      const hours = Math.floor(i / 60);
      const minutes = i % 60 === 0 ? '00' : i % 60;
      const nextHour = hours + 1;
      const time = minutes === '00' ? `${hours}:00 - ${nextHour}:00` : false;
      matrix.push([{ time: time, initial: '' }, { initial: '' }, { initial: '' }, { initial: '' }, { initial: '' }, { initial: '' }, { initial: '' }, { initial: '' }]);
    }

    // Filter bookings based on selected date
    const filteredBookings = bookings.filter((booking) => {
      const bookingDate = new Date(booking.startTime);
      const bookingDateString = bookingDate.toISOString().split('T')[0]; // Get YYYY-MM-DD part
      return bookingDateString === selectedDate;
    });

    filteredBookings.forEach((booking) => {
      let startMin = getMinutesSinceMidnight(booking.startTime);
      let endMin = getMinutesSinceMidnight(booking.endTime);
      let startRow = startMin / intervalMinutes;
      let endRow = endMin / intervalMinutes;
      let colIndex = positions.indexOf(booking.sector) + 1;

      while (matrix[startRow][colIndex].initial !== '') {
        colIndex++;
        if (colIndex >= matrix[0].length) {
          throw new Error('No available column for booking');
        }
      }

      matrix[startRow][colIndex] = { initial: booking.initial, rowspan: endRow - startRow, startMin: startMin, endMin: endMin };

      for (let i = startRow + 1; i < endRow; i++) {
        matrix[i][colIndex] = { initial: '', hide: true };
      }
    });
    
    tableBody.innerHTML = "";

    matrix.forEach((row) => {
      let rowinner = '';
      for (let i = 0; i < row.length; i++) {
        const col = row[i];
        if (i === 0 && col.time !== false) {
          rowinner += `<td rowspan='12'>${col.time}</td>`;
        } else if (i !== 0 && !col.hide) {
          let startHour = Math.floor(col.startMin / 60);
          let startMinute = col.startMin % 60;
          let endHour = Math.floor(col.endMin / 60);
          let endMinute = col.endMin % 60;
          rowinner += `<td ${col.rowspan ? `rowspan=${col.rowspan} class='bookingCol'` : ""}>
            <div>${col.initial}</div>
            <div>${col.startMin ? `${startHour}:${startMinute.toString().padStart(2, '0')} - ${endHour}:${endMinute.toString().padStart(2, '0')}` : ''}</div>
          </td>`;
        }
      }
      let r = document.createElement('tr');
      r.innerHTML = rowinner;
      tableBody.appendChild(r);
    });

    const currentTimeLine = document.createElement('div');
    currentTimeLine.classList.add('red-line');
    tableBody.appendChild(currentTimeLine);

    const currentTimeLabel = document.createElement('div');
    currentTimeLabel.classList.add('current-time');
    tableBody.appendChild(currentTimeLabel);

    function updateCurrentTimeLine() {
      const now = new Date();
      const utcHours = now.getUTCHours();
      const utcMinutes = now.getUTCMinutes();
      const totalMinutes = utcHours * 60 + utcMinutes;

      const rowHeight = tableBody.rows[0].offsetHeight;
      const offset = (totalMinutes / intervalMinutes) * rowHeight;
      currentTimeLine.style.top = `${offset}px`;
      currentTimeLabel.style.top = `${offset - currentTimeLabel.offsetHeight / 2}px`;
      currentTimeLabel.textContent = `${utcHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}`;

      const currentTimeLineTop = currentTimeLine.getBoundingClientRect().top;
      window.scrollTo({
        top: window.pageYOffset + currentTimeLineTop,
        behavior: 'smooth',
      });
    }

    updateCurrentTimeLine();
    const interval = setInterval(updateCurrentTimeLine, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [bookings, selectedDate]);

  return (
    <div className="booking-table-container">
      <table id="table" className="booking-table">
        <thead>
          <tr>
            <th rowSpan="2">Helyi Idő</th>
            <th>BTWR</th>
            <th>SV</th>
            <th>ADC</th>
            <th>GRC</th>
            <th>TPC</th>
            <th>CDC</th>
            <th>rTWR</th>
          </tr>
          <tr>
            <th>BTWR</th>
            <th>SV</th>
            <th>ADC</th>
            <th>GRC</th>
            <th>TPC</th>
            <th>CDC</th>
            <th>rTWR</th>
          </tr>
        </thead>
        <tbody id="table-body"></tbody>
      </table>
    </div>
  );
};

export default BookingTable;
