import React, { useState, useEffect, useRef } from "react";
import "../App.css";
import "react-datepicker/dist/react-datepicker.css";
import useToast from "../hooks/useToast";
import Button from "./Button";
import "../App.css";
import { convertToDate, dateTimeFormat } from "../utils/DateTimeFormat";
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
import { generateAppleCalendarICS, generateGoogleCalendarLink } from "../utils/calendarIntegration";
import useBeta from "../hooks/useBeta";
import { formatFullISO } from "../utils/timeUtils";
import axios from "axios";

type CreateBookingParams = {
  closePopup: () => void;
  editID?: number;
  selectedDate?: string;
};

function CreateBooking({ closePopup, editID = -1, selectedDate = "" }: CreateBookingParams) {
  const { userData, isAdmin } = useAuth();

  const { isBeta } = useBeta();

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
      let json = { startDate: dateTimeFormat(convertToDate()), endDate: dateTimeFormat(convertToDate()) };
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

      let isExam = bookingToEdit.is_exam;

      setBookingData({
        startDate: estartDate,
        endDate: eendDate,
        startHour: parseInt(estartHour),
        startMinute: parseInt(estartMinute),
        endHour: parseInt(eendHour),
        endMinute: parseInt(eendMinute),
        sector: esector,
        subSector: esubSector,
        is_exam: isExam
      });
    }
  }, [bookingToEdit]);


  const handleSave = async () => {
    try {
      setSaveLoading(true);

      const validation = await validateBookingData(bookingData as BookingData, editID, userData?.access_token);
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
        await createOrUpdateBooking(
          {
            bookingData: bookingData as BookingData,
            editID,
            userData,
            userlist,
            bookingToEdit,
          },
          userData.access_token
        );
      }
      closePopup();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        return sendError(error.response?.data.message)
      }
      sendError();
      throwError("Error while updating/creating booking:", error);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleBookingDelete = async () => {
    try {
      await deleteBooking(editID, userData?.access_token);
      closePopup();
    } catch (error) {
      sendError();
      throwError("Error while deleting booking:", error);
    }
  };


  const addToGoogleCalendar = () => {
    if (!bookingData) return;
    if (bookingToEdit?.cid.toString() != userData?.cid.toString()) return;
    if (editID <= 0) return;
    if (bookingData.startDate == undefined || bookingData.endDate == undefined || bookingData.startHour == undefined || bookingData.startMinute == undefined || bookingData.endHour == undefined || bookingData.endMinute == undefined || bookingData.sector == undefined || bookingData.subSector == undefined) return;

    const link = generateGoogleCalendarLink(
      bookingData.startDate,
      bookingData.endDate,
      bookingData.startHour,
      bookingData.startMinute,
      bookingData.endHour,
      bookingData.endMinute,
      bookingData.sector,
      bookingData.subSector
    );

    window.open(link, "_blank");
  };

  const addToAppleCalendar = () => {
    if (!bookingData) return;
    if (bookingToEdit?.cid.toString() != userData?.cid.toString()) return;
    if (editID <= 0) return;
    if (bookingData.startDate == undefined || bookingData.endDate == undefined || bookingData.startHour == undefined || bookingData.startMinute == undefined || bookingData.endHour == undefined || bookingData.endMinute == undefined || bookingData.sector == undefined || bookingData.subSector == undefined) return;

    const ics = generateAppleCalendarICS(
      bookingData.startDate,
      bookingData.endDate,
      bookingData.startHour,
      bookingData.startMinute,
      bookingData.endHour,
      bookingData.endMinute,
      bookingData.sector,
      bookingData.subSector
    );

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "vacchun-booking.ics";
    a.click();

    URL.revokeObjectURL(url);
  };

  const isAppleDevice = () => {
    if (typeof navigator === "undefined") return false;

    const ua = navigator.userAgent.toLowerCase();

    return (
      ua.includes("iphone") ||
      ua.includes("ipad") ||
      ua.includes("macintosh")
    );
  }

  return (
    <>
      <CustomToastContainer />

      <EditModal>
        <EditModalHeader>{editID != -1 ? `Editing ${bookingToEdit?.name || "Unknown"}` : "New"}</EditModalHeader>
        <div>

          {(bookingToEdit?.cid == userData?.cid && isBeta) &&
            <div className="flex p-3 gap-2">
              <Button
                click={() => {
                  addToGoogleCalendar();
                }}
                icon="google"
                text="To calendar"
              />
              {isAppleDevice() && (
                <Button
                  click={addToAppleCalendar}
                  icon="apple"
                  text="To calendar"
                />
              )}
            </div>}

          <div className="flex flex-col p-5 gap-2">
            <div className="py-2 flex gap-5">
              <div className="flex gap-1 items-center">
                <CalendarSelector
                  selected={bookingData.startDate ? convertToDate(bookingData.startDate) : convertToDate()}
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
              <>
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
              </>
            ) : (
              ""
            )}

            {isAdmin && <div className="px-2 flex items-center gap-2">
              <label htmlFor="is_exam">Controller Practical Test</label>
              <input onChange={(e) =>
                setBookingData((prevState) => ({
                  ...prevState,
                  is_exam: e.target.checked,
                }))
              } checked={bookingData.is_exam} type="checkbox" name="is_exam" id="is_exam" />
            </div>}

            {isAdmin && editID != -1 && bookingToEdit && <div className="px-2 flex flex-col justify-center text-slate-500">
              <p>Created at: {formatFullISO(bookingToEdit.created_at ?? "")}Z</p>
              <p>Updated at: {bookingToEdit.updated_at != bookingToEdit.created_at ? `${formatFullISO(bookingToEdit.created_at ?? "")}Z` : "-"}</p>
            </div>}
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
