import React from "react";
import { useState, useEffect } from "react";
import "../App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";

function CreateBooking({ closePopup, editID }) {
  const [accessToken, setAccessToken] = useState("");
  const [userData, setUserData] = useState("");
  const [loginValid, setLoginValid] = useState("");
  const [bookingData, setBookingData] = useState({});
  const [selectOptions, SetSelectOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveDisabled, setSaveDisabled] = useState(true);
  const [availSubSectors, setAvailSubSectors] = useState([]);
  const [bookingEditData, setBookingEditData] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userlist, setUserlist] = useState([]);
  const [bookingToEdit, setBookingToEdit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      if (editID) {
        try {
          const response = await axios.get(`http://localhost:3000/bookings/id/${editID}`);
          const booking = response.data.Bookings[0];
          setBookingToEdit(booking);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetch();
  }, [editID]);

  useEffect(() => {
    if (userData) {
      const getUserList = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/atcos/`);
          return response.data.ATCOs;
        } catch (error) {
          console.error(error);
        }
      };
      const fetchData = async () => {
        try {
          const adminResponse = await axios.get(`http://localhost:3000/atcos/cid/${userData.cid}`);
          setIsAdmin(adminResponse.data.ATCOs[0].isAdmin == 1 ? true : false);
          if (adminResponse.data.ATCOs[0].isAdmin == 1) {
            const users = await getUserList();
            setUserlist(users);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }
  }, [userData]);

  const sendError = (err) => {
    setSaveDisabled(true);
    toast.error(err, {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const sendInfo = (info) => {
    toast.info(info, {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  async function deleteBooking(bookingID) {
    if (bookingID) {
      try {
        const response = await axios.delete(`http://localhost:3000/bookings/delete/${bookingID}`);
        window.location.reload();
        closePopup();
      } catch (error) {
        console.error(error);
      }
    }
  }

  async function validateData() {
    const validateDates = () => {
      if (bookingData.startDate && bookingData.startHour !== undefined && bookingData.startMinute !== undefined && bookingData.endDate && bookingData.endHour !== undefined && bookingData.endMinute !== undefined) {
        const startDateTime = new Date(Date.UTC(parseInt(bookingData.startDate.split("-")[0], 10), parseInt(bookingData.startDate.split("-")[1], 10) - 1, parseInt(bookingData.startDate.split("-")[2], 10), parseInt(bookingData.startHour, 10), parseInt(bookingData.startMinute, 10)));

        const endDateTime = new Date(Date.UTC(parseInt(bookingData.endDate.split("-")[0], 10), parseInt(bookingData.endDate.split("-")[1], 10) - 1, parseInt(bookingData.endDate.split("-")[2], 10), parseInt(bookingData.endHour, 10), parseInt(bookingData.endMinute, 10)));

        const nowUTC = new Date();

        if (startDateTime < nowUTC || endDateTime < nowUTC) {
          return false;
        }

        if (startDateTime >= endDateTime) {
          return false;
        }

        return true;
      } else {
        return false;
      }
    };

    const isOverlap = (newStart, newEnd, existingStart, existingEnd) => {
      return newStart < existingEnd && newEnd > existingStart;
    };

    const checkOverlap = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/bookings/day/${bookingData.startDate}`);
        const bookings = response.data.Bookings;

        const newStart = new Date(Date.UTC(parseInt(bookingData.startDate.split("-")[0], 10), parseInt(bookingData.startDate.split("-")[1], 10) - 1, parseInt(bookingData.startDate.split("-")[2], 10), parseInt(bookingData.startHour, 10), parseInt(bookingData.startMinute, 10)));

        const newEnd = new Date(Date.UTC(parseInt(bookingData.endDate.split("-")[0], 10), parseInt(bookingData.endDate.split("-")[1], 10) - 1, parseInt(bookingData.endDate.split("-")[2], 10), parseInt(bookingData.endHour, 10), parseInt(bookingData.endMinute, 10)));

        let hasOverlap = false;

        for (const booking of bookings) {
          const existingStart = new Date(Date.UTC(parseInt(booking.startTime.split("T")[0].split("-")[0], 10), parseInt(booking.startTime.split("T")[0].split("-")[1], 10) - 1, parseInt(booking.startTime.split("T")[0].split("-")[2], 10), parseInt(booking.startTime.split("T")[1].split(":")[0], 10), parseInt(booking.startTime.split("T")[1].split(":")[1], 10)));

          const existingEnd = new Date(Date.UTC(parseInt(booking.endTime.split("T")[0].split("-")[0], 10), parseInt(booking.endTime.split("T")[0].split("-")[1], 10) - 1, parseInt(booking.endTime.split("T")[0].split("-")[2], 10), parseInt(booking.endTime.split("T")[1].split(":")[0], 10), parseInt(booking.endTime.split("T")[1].split(":")[1], 10)));

          if (isOverlap(newStart, newEnd, existingStart, existingEnd) && booking.sector === bookingData.sector && booking.subSector === bookingData.subSector && booking.cid !== bookingEditData.cid) {
            hasOverlap = true;
            break;
          }
        }

        return !hasOverlap;
      } catch (error) {
        console.error(error);
        return "Error.";
      }
    };

    const validateMissingFields = () => {
      if (!bookingData.startDate || !bookingData.endDate || !bookingData.startHour || !bookingData.startMinute || !bookingData.endHour || !bookingData.endMinute || !bookingData.sector || !bookingData.subSector) {
        return false;
      }
      return true;
    };

    let missingFields = validateMissingFields();
    if (!missingFields) {
      setSaveDisabled(true);
      sendError("Please fill out all the fields.");
      return false;
    }
    let dates = validateDates();
    if (!dates) {
      setSaveDisabled(true);
      sendError("Incorrect dates. Are you trying to book in the past?");
      return false;
    }
    let overlap = await checkOverlap();
    if (!overlap) {
      setSaveDisabled(true);
      sendError("Someone already booked this position.");
      return false;
    }
    setSaveDisabled(false);
    return true;
  }

  useEffect(() => {
    if (editID) {
      const fetchBookingData = async () => {
        setLoading(true);

        try {
          const response = await axios.get(`http://localhost:3000/bookings/id/${editID}`);
          const booking = response.data.Bookings[0];
          setBookingEditData(booking);
        } catch (error) {}

        setLoading(false);
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

  useEffect(() => {
    const selectedSector = selectOptions.find((sector) => sector.id === bookingData.sector);
    if (selectedSector) {
      setAvailSubSectors(selectedSector.childElements);
    } else {
      setAvailSubSectors([]);
    }
  }, [bookingData.sector, selectOptions]);

  useEffect(() => {
    const fetchSelectOptions = async () => {
      SetSelectOptions([]);
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/sectors/minRating/${userData.vatsim.rating.id}`);
        const sectors = response.data.Sectors;

        sectors.forEach((sector) => {
          SetSelectOptions((prevSelectOptions) => [...prevSelectOptions, sector]);
        });
      } catch (error) {}
      setLoading(false);
    };
    fetchSelectOptions();
  }, [userData]);

  const handleSave = async () => {
    let valid = await validateData();
    if (!valid) {
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
          initialResponse = await axios.get(`http://localhost:3000/atcos/cid/${userData.cid}`);
        }

        backendFormattedData = convertToBackendFormat(bookingData);
        backendFormattedData.name = eventManagerInitial == "self" ? userData.personal.name_full : fetchedUserdata.name;
        backendFormattedData.cid = eventManagerInitial == "self" ? userData.cid : fetchedUserdata.CID;
        backendFormattedData.initial = eventManagerInitial == "self" ? initialResponse.data.ATCOs[0].initial : fetchedUserdata.initial;
      }

      const response = editID ? await axios.put(`http://localhost:3000/bookings/update/${editID}`, backendFormattedData) : await axios.post(`http://localhost:3000/bookings/add`, backendFormattedData);

      if (response.status === 200) {
        sendInfo(editID ? "Booking updated successfully." : "Booking created successfully.");
        window.location.reload();
        closePopup();
      } else {
        sendError("Hiba történt!");
        console.error("Failed to update data:", response.data);
      }
    } catch (error) {
      sendError("Hiba történt!");
      console.error("Error updating data:", error);
    }
  };

  useEffect(() => {
    function fetchUserData() {
      if (accessToken) {
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: "https://auth-dev.vatsim.net/api/user?client_id=745",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        };

        axios(config)
          .then((response) => {
            setUserData(response.data.data);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        console.log("Access token not available.");
      }
    }

    fetchUserData();
  }, [accessToken]);

  useEffect(() => {
    if (userData) {
      if (userData.oauth.token_valid == "false") {
        logout();
      }
    }
  }, [userData]);

  useEffect(() => {
    const getStoredToken = () => {
      const storedToken = localStorage.getItem("accessToken");
      if (storedToken) {
        setAccessToken(storedToken);
      } else {
        console.log("redirecting....");
        navigate("/login");
      }
    };

    getStoredToken();
  }, []);

  console.log();
  return (
    <div>
      <ToastContainer position="bottom-left" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />{" "}
      <div className="fixed w-full h-full flex justify-center items-center bottom-0 left-0 bg-awesomecolor bg-opacity-50 z-50">
        <div className="bg-white">
          <h1 className="text-3xl m-5">{editID ? "Módosítás" : "Hozzáadás"}</h1>
          <h1 className="text-3xl m-5"></h1>
          <div className="w-full h-[2px] bg-slate-900"></div>
          <div>
            <div className="flex flex-col p-5 gap-2">
              <div className="py-2 flex gap-5">
                <input type="date" defaultValue={bookingEditData ? bookingEditData.startTime.split("T")[0] : ""} name="startDate" id="startDate" onChange={(e) => setBookingData((prevState) => ({ ...prevState, startDate: e.target.value, endDate: e.target.value }))} />
              </div>
              <div className="py-2 flex gap-5">
                <div className="flex items-center gap-1">
                  <div className="flex gap-1">
                    <input defaultValue={bookingEditData ? bookingEditData.startTime.split("T")[1].split(".")[0].split(":")[0] : ""} min={0} max={23} type="number" name="" id="" className="border border-solid border-awesomecolor p-[2px] px-2 w-[60px]" placeholder="hh" onChange={(e) => setBookingData((prevState) => ({ ...prevState, startHour: e.target.value }))} />
                    <span>:</span>
                    <input defaultValue={bookingEditData ? bookingEditData.startTime.split("T")[1].split(".")[0].split(":")[1] : ""} min={0} max={59} type="number" name="" id="" className="border border-solid border-awesomecolor p-[2px] px-2 w-[60px]" placeholder="mm" onChange={(e) => setBookingData((prevState) => ({ ...prevState, startMinute: e.target.value }))} />
                  </div>
                  <span> - </span>
                  <div className="flex gap-1">
                    <input defaultValue={bookingEditData ? bookingEditData.endTime.split("T")[1].split(".")[0].split(":")[0] : ""} min={0} max={23} type="number" name="" id="" className="border border-solid border-awesomecolor p-[2px] px-2 w-[60px]" placeholder="hh" onChange={(e) => setBookingData((prevState) => ({ ...prevState, endHour: e.target.value }))} />
                    <span>:</span>
                    <input defaultValue={bookingEditData ? bookingEditData.endTime.split("T")[1].split(".")[0].split(":")[1] : ""} min={0} max={59} type="number" name="" id="" className="border border-solid border-awesomecolor p-[2px] px-2 w-[60px]" placeholder="mm" onChange={(e) => setBookingData((prevState) => ({ ...prevState, endMinute: e.target.value }))} />
                  </div>
                </div>
              </div>
              <div className="relative h-10 w-72 min-w-[200px]">
                {loading ? (
                  <Loading message="Loading Ratings..." />
                ) : (
                  <div className="flex">
                    <div>
                      <select defaultValue={bookingEditData ? bookingEditData.sector : ""} onChange={(e) => setBookingData((prevState) => ({ ...prevState, sector: e.target.value }))} className="peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-gray-900 focus:border-2 focus:border-gray-900  focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50">
                        <option value="none" key="none">
                          Choose Sector
                        </option>
                        {selectOptions.map((option, index) => (
                          <option key={index} value={option.id}>
                            {option.id}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <select value={bookingData.subSector || ""} onChange={(e) => setBookingData((prevState) => ({ ...prevState, subSector: e.target.value }))} className="peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-gray-900 focus:border-2 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50">
                        <option value="none" key="none">
                          Choose Sector
                        </option>
                        {availSubSectors.map((option, index) => (
                          <option key={index} value={option.id}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {isAdmin && !editID ? (
                <div className="">
                  <select onChange={(e) => setBookingData((prevState) => ({ ...prevState, eventManagerInitial: e.target.value }))} className="peer h-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-gray-900 focus:border-2 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50">
                    <option value="self" key="self">
                      Self
                    </option>
                    {userlist.map((option, index) => (
                      <option key={`user-${index}`} value={option.initial}>
                        {option.initial}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="flex gap-3 p-5">
            <button
              onClick={() => {
                handleSave();
              }}
              className="bg-white hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
            >
              <i className="fa-solid fa-floppy-disk"></i> Mentés
            </button>
            {editID ? (
              <button
                onClick={() => {
                  deleteBooking(editID);
                  closePopup();
                }}
                className="bg-white hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
              >
                <i className="fa-solid fa-trash"></i> Törlés
              </button>
            ) : (
              ""
            )}
            <button
              onClick={() => {
                setBookingData({});
                closePopup();
              }}
              className="bg-white hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
            >
              <i className="fa-solid fa-ban"></i> Elvetés
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateBooking;
