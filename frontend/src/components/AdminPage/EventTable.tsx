import { formatFullISO } from "../../utils/timeUtils";
import { VatsimEvent } from "../../types/events";
import { useRef, useState } from "react";
import EditModal from "../EditModal";
import EditModalHeader from "../EditModalHeader";
import CalendarSelector from "../CalendarSelector";
import EventContext from "../../context/EventContext";
import useEventData from "../../hooks/useEventData";
import { convertToDate, dateTimeFormat } from "../../utils/DateTimeFormat";
import Input from "../Input";
import Button from "../Button";
import axios from "axios";
import useToast from "../../hooks/useToast";
import config from "../../config";
import { throwError } from "../../utils/throwError";
import useAuth from "../../hooks/useAuth";
import api from "../../axios";

type EventTableParams = {
  customEvents: VatsimEvent[];
  reloadEvents: () => void;
  adminView?: boolean;
};

type formData = {
  name: string;
  date: string;
  startHH: number;
  startMM: number;
  endHH: number;
  endMM: number;
  description: string;
};

function convertDateTime(date: string, hh: number, mm: number): string {
  const [year, month, day] = date.split("-").map(Number);

  const d = new Date(year, month - 1, day, hh, mm, 0);

  const yyyy = d.getFullYear();
  const MM = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const HH = String(d.getHours()).padStart(2, "0");
  const MMins = String(d.getMinutes()).padStart(2, "0");
  const SS = String(d.getSeconds()).padStart(2, "0");

  return `${yyyy}-${MM}-${dd} ${HH}:${MMins}:${SS}`;
}

function splitDateTime(datetime: string) {
  const d = new Date(datetime);

  const yyyy = d.getUTCFullYear();
  const MM = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");

  const hh = d.getUTCHours();
  const mm = d.getUTCMinutes();

  return {
    date: `${yyyy}-${MM}-${dd}`,
    hh,
    mm,
  };
}

const defualtFormData = {
  name: "",
  date: dateTimeFormat(convertToDate()),
  startHH: -1,
  startMM: -1,
  endHH: -1,
  endMM: -1,
  description: "",
};

function EventTable({ customEvents, reloadEvents, adminView = true }: EventTableParams) {
  const { sendError, sendInfo } = useToast();
  const { events, eventDates, eventsLoading } = useEventData();
  const [editData, setEditData] = useState<VatsimEvent | false>(false);
  const [editOpen, setEditOpen] = useState(false);
  const [formData, setFormData] = useState<formData>(defualtFormData);
  const startMinuteRef = useRef(null);
  const endHourRef = useRef(null);
  const endMinuteRef = useRef(null);
  const { userData } = useAuth();

  const handleClose = () => {
    setFormData(defualtFormData);
    setEditOpen(false);
  };

  const handleEditClick = (event: VatsimEvent) => {
    setEditData(event);
    const startSplit = splitDateTime(event.start_time);
    const endSplit = splitDateTime(event.end_time);

    setFormData((prevState) => ({
      ...prevState,
      name: event.name,
      description: event.description,
      date: startSplit.date,
      startHH: startSplit.hh,
      startMM: startSplit.mm,
      endHH: endSplit.hh,
      endMM: endSplit.mm,
    }));
    setEditOpen(true);
  };

  const handleSave = async () => {
    const insertData = {
      name: formData.name,
      description: formData.description,
      start_time: convertDateTime(formData.date, formData.startHH, formData.startMM),
      end_time: convertDateTime(formData.date, formData.endHH, formData.endMM),
    };
    console.log(insertData);

    if (!editData) {
      // New
      try {
        const response = await api.post(`/events/add`, insertData, {
          headers: {
            Authorization: `Bearer ${userData?.access_token}`,
          },
        });

        if (response.status === 200) {
          sendInfo("Event created.");
          handleClose();
          reloadEvents();
        } else {
          sendError("Error while creating event.");
          console.error("Failed to create data:", response.data);
        }
      } catch (error) {
        sendError("Error while creating event.");
        throwError("Error while creating event: ", error);
      }
    } else {
      const id = editData.id;
      if (!id) return;
      // Edit
      try {
        const response = await api.put(`/events/update/${id}`, insertData, {
          headers: {
            Authorization: `Bearer ${userData?.access_token}`,
          },
        });

        if (response.status === 200) {
          sendInfo("Event updated.");
          handleClose();
          reloadEvents();
        } else {
          sendError("Error while updating event.");
          console.error("Failed to update data:", response.data);
        }
      } catch (error) {
        sendError("Error while updating event.");
        throwError("Error while updating event: ", error);
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await api.delete(`/events/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${userData?.access_token}`,
        },
      });

      if (response.status === 200) {
        sendInfo("Event deleted.");
        handleClose();
        reloadEvents();
      } else {
        sendError("Error while deleting event.");
        console.error("Failed to delete data:", response.data);
      }
    } catch (error) {
      sendError("Error while deleting event.");
      throwError("Error while deleting event: ", error);
    }
  };

  return (
    <EventContext.Provider value={{ events, eventDates, eventsLoading }}>
      <div className="overflow-x-auto p-4">
        <table className="min-w-full divide-y divide-gray-300 rounded shadow-md">
          <thead className="bg-awesomecolor text-white">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Start Time</th>
              <th className="px-4 py-2 text-left">End Time</th>
              <th className="px-4 py-2 text-left hidden md:table-cell">Description</th>
              {adminView ? (
                <>
                  <th className="px-4 py-2 text-left">Edit</th>
                  <th className="px-4 py-2 text-left">Delete</th>
                </>
              ) : (
                <></>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {customEvents.map((event) => (
              <tr key={event.id} className="hover:bg-gray-100">
                <td className="px-4 py-2">{event.name}</td>
                <td className="px-4 py-2">{formatFullISO(event.start_time)}Z</td>
                <td className="px-4 py-2">{formatFullISO(event.end_time)}Z</td>
                <td className="px-4 py-2 max-w-[600px] hidden md:table-cell">{event.description}</td>{" "}
                {adminView ? (
                  <>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => {
                          handleEditClick(event);
                        }}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => {
                          handleDelete(event.id);
                        }}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </>
                ) : (
                  <></>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-sm text-gray-600 mt-2">Total events: {customEvents.length}</p>
        {adminView ? (
          <button
            onClick={() => {
              setEditData(false);
              setEditOpen(true);
            }}
            className="mt-2 text-blue-600 hover:underline"
          >
            <strong>Add event </strong>
            <i className="fa-solid fa-square-plus"></i>
          </button>
        ) : (
          <></>
        )}
      </div>

      {editOpen ? (
        <>
          <EditModal>
            <EditModalHeader>{editData ? "Edit event" : "Add event"}</EditModalHeader>
            <div className="p-3 flex flex-col">
              <input
                type="text"
                placeholder="Name"
                maxLength={100}
                className="border border-solid border-awesomecolor p-[2px] px-2 outline-none"
                defaultValue={editData ? editData.name : ""}
                onChange={(e) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    name: e.target.value,
                  }))
                }
              />
              <div className="flex flex-row items-center mt-2">
                <CalendarSelector
                  selected={formData.date != "" ? convertToDate(formData.date) : convertToDate()}
                  onChange={(date: Date | null) => {
                    if (date) {
                      const formattedDate = dateTimeFormat(date);
                      setFormData((prevState) => ({
                        ...prevState,
                        date: formattedDate,
                      }));
                    }
                  }}
                ></CalendarSelector>
              </div>
              <div className="flex gap-1 mt-2">
                <Input
                  testid="startHH"
                  className="w-[60px]"
                  type="number"
                  placeholder="hh"
                  defaultValue={formData.startHH != -1 ? formData.startHH.toString() : ""}
                  min={0}
                  max={23}
                  nextRef={startMinuteRef}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startHH: parseInt(e.target.value),
                    }))
                  }
                />
                <span>:</span>
                <Input
                  testid="startMM"
                  className="w-[60px]"
                  type="number"
                  placeholder="mm"
                  defaultValue={formData.startMM != -1 ? formData.startMM.toString() : ""}
                  min={0}
                  max={59}
                  nextRef={endHourRef}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startMM: parseInt(e.target.value),
                    }))
                  }
                  ref={startMinuteRef}
                />
                <span> - </span>
                <Input
                  testid="endHH"
                  className="w-[60px]"
                  type="number"
                  placeholder="hh"
                  defaultValue={formData.endHH != -1 ? formData.endHH.toString() : ""}
                  min={0}
                  max={23}
                  nextRef={endMinuteRef}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endHH: parseInt(e.target.value),
                    }))
                  }
                  ref={endHourRef}
                />
                <span>:</span>
                <Input
                  testid="endMM"
                  className="w-[60px]"
                  type="number"
                  placeholder="mm"
                  defaultValue={formData.endMM != -1 ? formData.endMM.toString() : ""}
                  min={0}
                  max={59}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endMM: parseInt(e.target.value),
                    }))
                  }
                  ref={endMinuteRef}
                />
              </div>
              <textarea
                placeholder="Description"
                className="border border-solid border-awesomecolor p-[2px] px-2 outline-none mt-2"
                defaultValue={editData ? editData.description : ""}
                onChange={(e) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    description: e.target.value,
                  }))
                }
              ></textarea>
            </div>
            <div className="flex gap-5 p-3">
              <Button text="Save" icon="save" click={handleSave}></Button>
              <Button
                text="Close"
                icon="close"
                click={() => {
                  handleClose();
                  setEditData(false);
                }}
              ></Button>
            </div>
          </EditModal>
        </>
      ) : (
        <></>
      )}
    </EventContext.Provider>
  );
}

export default EventTable;
