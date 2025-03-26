import React from "react";
import BookingTable from "./components/BookingTable";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";
export default function App() {
  return (
    <>
      <div className="pt-[30px]">
        <BookingTable />
      </div>
    </>
  );
}
