import React, { useContext, useState, useEffect, useRef } from "react";
import "../App.css";
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
import { deleteBooking, createOrUpdateBooking } from "../utils/bookingUtils";
import { validateBookingData } from "../utils/bookingValidation";
import CustomToastContainer from "./CustomToastContainer";
import EditModal from "./EditModal";

function CreateBooking({ closePopup, editID = false, selectedDate = false }) {
  const { userData, isAdmin } = useContext(AuthContext);

  const [bookingData, setBookingData] = useState({});

  const { sendError, sendInfo } = useToast();

  const startMinuteRef = useRef(null);
  const endHourRef = useRef(null);
  const endMinuteRef = useRef(null);

  const { userlist, userlistLoading } = useUserList();
  const { bookingToEdit, bookingToEditLoading } = useFetchOneBooking(editID);

  const loading = bookingToEditLoading || userlistLoading;

  useEffect(() => {
    if (!bookingToEdit && !selectedDate) {
      let json = { startDate: dateTimeFormat(new Date()), endDate: dateTimeFormat(new Date()) };
      setBookingData(json);
    } else if (!bookingToEdit && selectedDate) {
      let json = { startDate: selectedDate, endDate: selectedDate };
      setBookingData(json);
    }
  }, [bookingToEdit, selectedDate]);

  useEffect(() => {
    if (bookingToEdit) {
      let estartDate = bookingToEdit.startTime.split("T")[0];
      let eendDate = bookingToEdit.endTime.split("T")[0];

      let estartHour = bookingToEdit.startTime.split("T")[1].split(".")[0].split(":")[0];
      let estartMinute = bookingToEdit.startTime.split("T")[1].split(".")[0].split(":")[1];

      let eendHour = bookingToEdit.endTime.split("T")[1].split(".")[0].split(":")[0];
      let eendMinute = bookingToEdit.endTime.split("T")[1].split(".")[0].split(":")[1];

      let esector = bookingToEdit.sector;
      let esubSector = bookingToEdit.subSector;

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
  }, [bookingToEdit]);

  const handleSave = async () => {
    const validation = await validateBookingData(bookingData, editID);

    if (!validation.isValid) {
      if (validation.missingFields) {
        sendError("Please fill out all the fields.");
      } else if (validation.outOfRange) {
        sendError("Entry out of range.");
      } else if (validation.invalidDates) {
        sendError("Incorrect dates. Are you trying to book in the past?");
      } else if (validation.overlapping) {
        sendError("Someone already booked this position.");
      } else if (validation.notFiveMinuteIntervals) {
        sendError("You can only book in 5 minute intervals.");
      } 
      return;
    }
    const response = await createOrUpdateBooking({ bookingData, editID, userData, userlist, bookingToEdit });

    if (response.status === 200) {
      closePopup();
      sendInfo(editID ? "Booking updated successfully." : "Booking created successfully.");
    } else {
      sendError("An error occured!");
    }
  };

  return (
    <>
      <CustomToastContainer />

      <EditModal>
        <EditModalHeader>{editID ? `Editing ${bookingToEdit.name || "Unknown"}` : "New"}</EditModalHeader>
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
                  {bookingToEditLoading ? (
                    <>Loading...</>
                  ) : (
                    <>
                      <Input className="w-[60px]" type="number" placeholder="hh" defaultValue={bookingToEdit ? bookingToEdit.startTime.split("T")[1].split(".")[0].split(":")[0] : ""} min={0} max={23} nextRef={startMinuteRef} onChange={(e) => setBookingData((prev) => ({ ...prev, startHour: e.target.value }))} />
                      <span>:</span>
                      <Input className="w-[60px]" type="number" placeholder="mm" defaultValue={bookingToEdit ? bookingToEdit.startTime.split("T")[1].split(".")[0].split(":")[1] : ""} min={0} max={59} nextRef={endHourRef} onChange={(e) => setBookingData((prev) => ({ ...prev, startMinute: e.target.value }))} ref={startMinuteRef} />
                      <span> - </span>
                      <Input className="w-[60px]" type="number" placeholder="hh" defaultValue={bookingToEdit ? bookingToEdit.endTime.split("T")[1].split(".")[0].split(":")[0] : ""} min={0} max={23} nextRef={endMinuteRef} onChange={(e) => setBookingData((prev) => ({ ...prev, endHour: e.target.value }))} ref={endHourRef} />
                      <span>:</span>
                      <Input className="w-[60px]" type="number" placeholder="mm" defaultValue={bookingToEdit ? bookingToEdit.endTime.split("T")[1].split(".")[0].split(":")[1] : ""} min={0} max={59} onChange={(e) => setBookingData((prev) => ({ ...prev, endMinute: e.target.value }))} ref={endMinuteRef} />
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="relative h-10 w-72 min-w-[200px]">
              <div className="grid grid-rows-1 grid-cols-2 gap-x-2">
                <SectorSelector bookingData={bookingData} setBookingData={setBookingData} />
              </div>
            </div>

            {isAdmin == true && !editID ? (
              <div className="grid grid-rows-1 grid-cols-2 gap-x-2">
                {userlistLoading ? (
                  "Loading users..."
                ) : (
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
                )}
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
            disabled={loading}
          />
          {editID ? (
            <Button
              click={async () => {
                await deleteBooking(editID);
                closePopup();
              }}
              icon="delete"
              text="Delete"
              disabled={loading}
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
      </EditModal>
    </>
  );
}

export default CreateBooking;
