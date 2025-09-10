import React, { useState, useEffect, useRef } from "react";
import "../App.css";
import "react-datepicker/dist/react-datepicker.css";
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
import "react-toastify/dist/ReactToastify.css";
import EditModal from "./EditModal";
import { throwError } from "../utils/throwError";
import useAuth from "../hooks/useAuth";
import { BookingData } from "../types/booking";
import { User } from "../types/users";

type CreateBookingParams = {
  closePopup: () => void;
  editID?: number;
  selectedDate?: string;
};

function CreateBooking({ closePopup, editID = -1, selectedDate = "" }: CreateBookingParams) {
  const { userData, isAdmin } = useAuth();

  const [bookingData, setBookingData] = useState<Partial<BookingData>>({});

  const { sendError } = useToast();

  const startMinuteRef = useRef(null);
  const endHourRef = useRef(null);
  const endMinuteRef = useRef(null);

  const { userlist, userlistLoading } = useUserList();
  const { bookingToEdit, bookingToEditLoading } = useFetchOneBooking(editID);
  const [saveLoading, setSaveLoading] = useState(false);

  const loading = bookingToEditLoading || userlistLoading || saveLoading;

  useEffect(() => {
    if (!bookingToEdit && selectedDate == "") {
      let json = { startDate: dateTimeFormat(new Date()), endDate: dateTimeFormat(new Date()) };
      setBookingData(json);
    } else if (!bookingToEdit && selectedDate != "") {
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
        startHour: parseInt(estartHour),
        startMinute: parseInt(estartMinute),
        endHour: parseInt(eendHour),
        endMinute: parseInt(eendMinute),
        sector: esector,
        subSector: esubSector,
      });
    }
  }, [bookingToEdit]);

  const handleSave = async () => {
    try {
      setSaveLoading(true);

      const validation = await validateBookingData(bookingData as BookingData, editID);
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
    } catch (error) {
      throwError("Error while validating booking data", error);
    } finally {
      setSaveLoading(false);
    }

    try {
      setSaveLoading(true);

      if (userData) {
        await createOrUpdateBooking({
          bookingData: bookingData as BookingData,
          editID,
          userData,
          userlist,
          bookingToEdit,
        });
      }
      closePopup();
    } catch (error) {
      sendError();
      throwError("Error while updating/creating booking:", error);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleBookingDelete = async () => {
    try {
      await deleteBooking(editID);
      closePopup();
    } catch (error) {
      sendError();
      throwError("Error while deleting booking:", error);
    }
  };

  return (
    <>
      <CustomToastContainer />

      <EditModal>
        <EditModalHeader>{editID != -1 ? `Editing ${bookingToEdit?.name || "Unknown"}` : "New"}</EditModalHeader>
        <div>
          <div className="flex flex-col p-5 gap-2">
            <div className="py-2 flex gap-5">
              <div className="flex gap-1 items-center">
                <CalendarSelector
                  selected={bookingData.startDate ? new Date(bookingData.startDate) : new Date()}
                  onChange={(date: Date | null) => {
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
                      <Input testid="startHH" className="w-[60px]" type="number" placeholder="hh" defaultValue={bookingToEdit ? bookingToEdit.startTime.split("T")[1].split(".")[0].split(":")[0] : ""} min={0} max={23} nextRef={startMinuteRef} onChange={(e) => setBookingData((prev) => ({ ...prev, startHour: parseInt(e.target.value) }))} />
                      <span>:</span>
                      <Input testid="startMM" className="w-[60px]" type="number" placeholder="mm" defaultValue={bookingToEdit ? bookingToEdit.startTime.split("T")[1].split(".")[0].split(":")[1] : ""} min={0} max={59} nextRef={endHourRef} onChange={(e) => setBookingData((prev) => ({ ...prev, startMinute: parseInt(e.target.value) }))} ref={startMinuteRef} />
                      <span> - </span>
                      <Input testid="endHH" className="w-[60px]" type="number" placeholder="hh" defaultValue={bookingToEdit ? bookingToEdit.endTime.split("T")[1].split(".")[0].split(":")[0] : ""} min={0} max={23} nextRef={endMinuteRef} onChange={(e) => setBookingData((prev) => ({ ...prev, endHour: parseInt(e.target.value) }))} ref={endHourRef} />
                      <span>:</span>
                      <Input testid="endMM" className="w-[60px]" type="number" placeholder="mm" defaultValue={bookingToEdit ? bookingToEdit.endTime.split("T")[1].split(".")[0].split(":")[1] : ""} min={0} max={59} onChange={(e) => setBookingData((prev) => ({ ...prev, endMinute: parseInt(e.target.value) }))} ref={endMinuteRef} />
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="relative h-10 w-72 min-w-[200px]">
              <div className="grid grid-rows-1 grid-cols-2 gap-x-2">
                <SectorSelector bookingData={bookingData as BookingData} setBookingData={setBookingData as React.Dispatch<React.SetStateAction<BookingData>>} />
              </div>
            </div>

            {isAdmin == true && editID == -1 ? (
              <div className="grid grid-rows-1 grid-cols-2 gap-x-2">
                {userlistLoading ? (
                  "Loading users..."
                ) : (
                  <Select<User>
                    value={bookingData.eventManagerInitial || "self"}
                    onChange={(e) =>
                      setBookingData((prevState) => ({
                        ...prevState,
                        eventManagerInitial: e.target.value,
                      }))
                    }
                    options={userlist}
                    defaultOptionLabel="Self"
                    getOptionLabel={(option: User) => option.initial}
                    getOptionValue={(option: User) => option.initial}
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
          {editID != -1 ? <Button click={handleBookingDelete} icon="delete" text="Delete" disabled={loading} /> : ""}
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
