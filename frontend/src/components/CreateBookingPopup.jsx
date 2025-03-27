import React, { useContext, useState, useEffect, useRef } from "react";
import "../App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Loading from "../components/Loading";
import config from "../config";
import "react-datepicker/dist/react-datepicker.css";
import AuthContext from "../context/AuthContext";
import useToast from "../hooks/useToast";
import Button from "./Button";
import "../App.css";
import dateTimeFormat from "../utils/DateTimeFormat";
import Input from "./Input";
import EditModalHeader from "./EditModalHeader";
import CalendarSelector from "./CalendarSelector";
import SectorSelector from "./SectorSelector";
import useUserList from "../hooks/useUserList";
import Select from "./Select";
import useFetchOneBooking from "../hooks/useFetchOneBooking";
import { deleteBooking } from "../utils/bookingUtils";
import { validateBookingData } from "../utils/bookingValidation";

const API_URL = config.API_URL;

function CreateBooking({ closePopup, editID = false, selectedDate = false }) {
  const { userData, isAdmin } = useContext(AuthContext);

  const [bookingData, setBookingData] = useState({});
  const [loading, setLoading] = useState(false);
  const [bookingEditData, setBookingEditData] = useState(false);

  const { sendError, sendInfo } = useToast();

  const startMinuteRef = useRef(null);
  const endHourRef = useRef(null);
  const endMinuteRef = useRef(null);

  const { userlist, userlistLoading } = useUserList();
  const { bookingToEdit, bookingToEditLoading } = useFetchOneBooking(editID);

  useEffect(() => {
    if (!bookingEditData && !selectedDate) {
      let json = { startDate: dateTimeFormat(new Date()), endDate: dateTimeFormat(new Date()) };
      setBookingData(json);
    } else if (!bookingEditData && selectedDate) {
      let json = { startDate: selectedDate, endDate: selectedDate };
      setBookingData(json);
    }
  }, [bookingEditData, selectedDate]);

  useEffect(() => {
    if (editID) {
      const fetchBookingData = async () => {
        setLoading(true);

        try {
          const response = await axios.get(`${API_URL}/bookings/id/${editID}`);
          const booking = response.data.Bookings[0];
          setBookingEditData(booking);
        } catch (error) {
        } finally {
          setLoading(false);
        }
      };

      fetchBookingData();
    }
  }, [editID]);

  useEffect(() => {
    if (bookingEditData) {
      let estartDate = bookingEditData.startTime.split("T")[0];
      let eendDate = bookingEditData.endTime.split("T")[0];

      let estartHour = bookingEditData.startTime.split("T")[1].split(".")[0].split(":")[0];
      let estartMinute = bookingEditData.startTime.split("T")[1].split(".")[0].split(":")[1];

      let eendHour = bookingEditData.endTime.split("T")[1].split(".")[0].split(":")[0];
      let eendMinute = bookingEditData.endTime.split("T")[1].split(".")[0].split(":")[1];

      let esector = bookingEditData.sector;
      let esubSector = bookingEditData.subSector;

      setBookingData({
        startDate: estartDate,
        endDate: eendDate,
        startHour: estartHour,
        startMinute: estartMinute,
        endHour: eendHour,
        endMinute: eendMinute,
        sector: esector,
        subSector: esubSector,
      });
    }
  }, [bookingEditData]);

  const handleSave = async () => {
    const validation = await validateBookingData(bookingData, editID);

    if (!validation.isValid) {
      if (validation.missingFields) sendError("Please fill out all the fields.");
      if (validation.invalidDates) sendError("Incorrect dates. Are you trying to book in the past?");
      if (validation.overlapping) sendError("Someone already booked this position.");
      return;
    }

    const convertToBackendFormat = (inputData) => {
      const { startDate, endDate, startHour, startMinute, endHour, endMinute, sector, subSector } = inputData;
      const pad = (num) => {
        return num.toString().padStart(2, "0");
      };

      const startTime = `${startDate} ${pad(startHour)}:${pad(startMinute)}:00.000000`;
      const endTime = `${endDate} ${pad(endHour)}:${pad(endMinute)}:00.000000`;

      const backendData = {
        sector,
        startTime,
        endTime,
        subSector,
      };

      return backendData;
    };

    try {
      let backendFormattedData = {};

      if (editID) {
        let cid = bookingToEdit.cid;
        let name = bookingToEdit.name;
        let initial = bookingToEdit.initial;
        backendFormattedData = convertToBackendFormat(bookingData);
        backendFormattedData.name = name;
        backendFormattedData.cid = cid;
        backendFormattedData.initial = initial;
      } else {
        let eventManagerInitial = bookingData.eventManagerInitial ? bookingData.eventManagerInitial : "self";

        let fetchedUserdata = userlist.filter((user) => user.initial == eventManagerInitial)[0];
        let initialResponse = false;

        if (eventManagerInitial == "self") {
          initialResponse = await axios.get(`${API_URL}/atcos/cid/${userData.cid}`);
        }

        backendFormattedData = convertToBackendFormat(bookingData);
        backendFormattedData.name = eventManagerInitial == "self" ? userData.personal.name_full : fetchedUserdata.name;
        backendFormattedData.cid = eventManagerInitial == "self" ? userData.cid : fetchedUserdata.CID;
        backendFormattedData.initial = eventManagerInitial == "self" ? initialResponse.data.ATCOs[0].initial : fetchedUserdata.initial;
      }

      const response = editID ? await axios.put(`${API_URL}/bookings/update/${editID}`, backendFormattedData) : await axios.post(`${API_URL}/bookings/add`, backendFormattedData);

      if (response.status === 200) {
        closePopup();
        sendInfo(editID ? "Booking updated successfully." : "Booking created successfully.");
      } else {
        sendError("An error occured!");
        console.error("Failed to update data:", response.data);
      }
    } catch (error) {
      sendError("An error occured!");
      console.error("Error updating data:", error);
    }
  };

  //const dateTimeFormat = (date) => (date ? date.toISOString().split("T")[0] : "");
  return (
    <div>
      <ToastContainer position="bottom-left" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />{" "}
      <div className="fixed w-full h-full flex justify-center items-center bottom-0 left-0 bg-awesomecolor bg-opacity-50 z-50">
        <div className="bg-white">
          <EditModalHeader>{editID ? `Editing ${bookingEditData.name || "Unknown"}` : "New"}</EditModalHeader>
          <div>
            <div className="flex flex-col p-5 gap-2">
              <div className="py-2 flex gap-5">
                <div className="flex gap-1 items-center">
                  <CalendarSelector
                    selected={bookingData.startDate ? new Date(bookingData.startDate) : new Date()}
                    onChange={(date) => {
                      if (date) {
                        const formattedDate = dateTimeFormat(date);
                        setBookingData((prevState) => ({
                          ...prevState,
                          startDate: formattedDate,
                          endDate: formattedDate,
                        }));
                      }
                    }}
                  />
                </div>
              </div>
              <div className="py-2 flex gap-5">
                <div className="flex items-center gap-1">
                  <div className="flex gap-1">
                    <Input className="w-[60px]" type="number" placeholder="hh" defaultValue={bookingEditData ? bookingEditData.startTime.split("T")[1].split(".")[0].split(":")[0] : ""} min={0} max={23} nextRef={startMinuteRef} onChange={(e) => setBookingData((prev) => ({ ...prev, startHour: e.target.value }))} />
                    <span>:</span>
                    <Input className="w-[60px]" type="number" placeholder="mm" defaultValue={bookingEditData ? bookingEditData.startTime.split("T")[1].split(".")[0].split(":")[1] : ""} min={0} max={59} nextRef={endHourRef} onChange={(e) => setBookingData((prev) => ({ ...prev, startMinute: e.target.value }))} ref={startMinuteRef} />
                    <span> - </span>
                    <Input className="w-[60px]" type="number" placeholder="hh" defaultValue={bookingEditData ? bookingEditData.endTime.split("T")[1].split(".")[0].split(":")[0] : ""} min={0} max={23} nextRef={endMinuteRef} onChange={(e) => setBookingData((prev) => ({ ...prev, endHour: e.target.value }))} ref={endHourRef} />
                    <span>:</span>
                    <Input className="w-[60px]" type="number" placeholder="mm" defaultValue={bookingEditData ? bookingEditData.endTime.split("T")[1].split(".")[0].split(":")[1] : ""} min={0} max={59} onChange={(e) => setBookingData((prev) => ({ ...prev, endMinute: e.target.value }))} ref={endMinuteRef} />
                  </div>
                </div>
              </div>

              <div className="relative h-10 w-72 min-w-[200px]">
                {loading ? (
                  <Loading message="Loading Ratings..." />
                ) : (
                  <div className="grid grid-rows-1 grid-cols-2 gap-x-2">
                    <SectorSelector bookingData={bookingData} setBookingData={setBookingData} />
                  </div>
                )}
              </div>

              {isAdmin == true && !editID ? (
                <div className="grid grid-rows-1 grid-cols-2 gap-x-2">
                  <Select
                    value={bookingData.eventManagerInitial || "self"}
                    onChange={(e) =>
                      setBookingData((prevState) => ({
                        ...prevState,
                        eventManagerInitial: e.target.value,
                      }))
                    }
                    options={userlist}
                    defaultOptionLabel="Self"
                    getOptionLabel={(option) => option.initial}
                    getOptionValue={(option) => option.initial}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="flex gap-3 p-5">
            <Button
              click={async () => {
                handleSave();
              }}
              icon="save"
              text="Save"
            />
            {editID ? (
              <Button
                click={async () => {
                  await deleteBooking(editID);
                  closePopup();
                }}
                icon="delete"
                text="Delete"
              />
            ) : (
              ""
            )}
            <Button
              click={() => {
                setBookingData({});
                closePopup();
              }}
              icon="cancel"
              text="Cancel"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateBooking;
