import { useState } from "react";
import { Link } from "react-router-dom";
import CreateBookingPopup from "./CreateBookingPopup";
import useLogout from "../hooks/useLogout";

type NavParams = {
  reloadBookings?: () => void;
  Active?: string;
  selectedDate?: string;
};

function Nav({ reloadBookings = () => {}, Active, selectedDate }: NavParams) {
  const logout = useLogout();

  const [bookingPopupOpen, setBookingPopupOpen] = useState(false);

  const closePopup = () => {
    setBookingPopupOpen(false);
    reloadBookings();
  };

  const handleLogout = () => {
    logout("Logged out.");
  };

  return (
    <>
      <div className="bg-white flex fixed top-0 left-0 w-full items-center drop-shadow-lg h-[24px] z-30">
        <div className="flex gap-4 items-center px-4">
          <i className="fa-solid fa-bars text-awesomecolor"></i>
          <Link to="/">
            <p className="text-awesomecolor">vACCHUN</p>
          </Link>
          <div className="relative group">
            <i onClick={handleLogout} className="fa-solid fa-flag-checkered text-awesomecolor cursor-pointer"></i>
            <span className="absolute bottom-[-1.5rem] left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">Logout</span>
          </div>
        </div>

        <div className="absolute right-0 flex gap-4 px-4 items-center">
          <div className="relative group">
            <Link to="/">
              <i className={`fa-solid fa-bug ${Active === "bug" ? "text-blue-500" : "text-awesomecolor"}`}></i>
            </Link>
            <span className="tooltip">Not implemented</span>
          </div>

          <div className="relative group">
            <Link to="/">
              <i className={`fa-solid fa-file-video ${Active === "file-video" ? "text-blue-500" : "text-awesomecolor"}`}></i>
            </Link>
            <span className="tooltip">Not implemented</span>
          </div>

          <div className="relative group">
            <Link to="/">
              <i className={`fa-solid fa-table ${Active === "table" ? "text-blue-500" : "text-awesomecolor"}`}></i>
            </Link>
            <span className="tooltip">Not implemented</span>
          </div>

          <div className="relative group">
            <Link
              to="/"
              onClick={() => {
                setBookingPopupOpen(true);
              }}
            >
              <i className={`fa-solid fa-laptop ${Active === "laptop" ? "text-blue-500" : "text-awesomecolor"}`}></i>
            </Link>
            <span className="tooltip">Book a session</span>
          </div>

          <div className="relative group">
            <Link to="/">
              <i className={`fa-solid fa-user ${Active === "user" ? "text-blue-500" : "text-awesomecolor"}`}></i>
            </Link>
            <span className="tooltip">Not implemented</span>
          </div>

          <div className="relative group">
            <Link to="/admin">
              <i className={`fa-solid fa-bulldozer ${Active === "bulldozer" ? "text-blue-500" : "text-awesomecolor"}`}></i>
            </Link>
            <span className="tooltip">Admin panel</span>
          </div>
        </div>
      </div>

      {bookingPopupOpen ? <CreateBookingPopup closePopup={closePopup} selectedDate={selectedDate} /> : ""}
    </>
  );
}

export default Nav;
