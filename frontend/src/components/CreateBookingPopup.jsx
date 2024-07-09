import React from "react";
import { useState, useEffect } from "react";
import "../App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";


function CreateBooking({ closePopup }) {
  const [accessToken, setAccessToken] = useState("");
  const [userData, setUserData] = useState("");
  const [loginValid, setLoginValid] = useState("");
  const [bookingData, setBookingData] = useState({});
  const [selectOptions, SetSelectOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveDisabled, setSaveDisabled] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchSelectOptions = async () => {
      SetSelectOptions([]);
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/sectors/minRating/${userData.vatsim.rating.id}`);
        const sectors = response.data.Sectors;

        sectors.forEach((sector) => {
          SetSelectOptions((prevSelectOptions) => [...prevSelectOptions, sector.id]);
        });
      } catch (error) {}
      setLoading(false);
    };
    fetchSelectOptions();
  }, [userData]);

  const sendError = (err) => {
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

  const handleSave = async () => {
    if (saveDisabled) {
      sendError("Kérem töltsön ki minden mezőt!");
      return;
    }
    const convertToBackendFormat = (inputData) => {
      // Extract values from input object
      const { startDate, endDate, startHour, startMinute, endHour, endMinute, sector } = inputData;
    
      // Function to pad single digits with zero
      const pad = (num) => {
        return num.toString().padStart(2, '0');
      };
    
      // Construct start and end time strings in desired format
      const startTime = `${startDate} ${pad(startHour)}:${pad(startMinute)}:00.000000`;
      const endTime = `${endDate} ${pad(endHour)}:${pad(endMinute)}:00.000000`;
    
      // Construct final object in backend format
      const backendData = {
        sector,
        startTime,
        endTime
      };
    
      return backendData;
    };
    

    
    try {
      
      const initialResponse = await axios.get(`http://localhost:3000/atcos/cid/${userData.cid}`);

      const backendFormattedData = convertToBackendFormat(bookingData);
      
      backendFormattedData.name = userData.personal.name_full;
      backendFormattedData.cid =  userData.cid;
      backendFormattedData.initial = initialResponse.data.ATCOs[0].initial;

      console.log(backendFormattedData)
      const response = await axios.post(`http://localhost:3000/bookings/add`, backendFormattedData);
      console.log(response);
      if (response.status === 200) {
        sendInfo("Sikeresen felvéve.");
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

  useEffect(() => {
    const isDateInThePast = (date, hour, minute) => {
      const combinedDateUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute));

      const nowUTC = new Date();
      const nowUTCDate = new Date(Date.UTC(nowUTC.getUTCFullYear(), nowUTC.getUTCMonth(), nowUTC.getUTCDate(), nowUTC.getUTCHours(), nowUTC.getUTCMinutes()));

      return combinedDateUTC < nowUTCDate;
    };

    if (bookingData.startDate && bookingData.startHour !== undefined && bookingData.startMinute !== undefined && bookingData.endDate && bookingData.endHour !== undefined && bookingData.endMinute !== undefined && bookingData.sector) {
      const startDateParts = bookingData.startDate.split("-");
      const endDateParts = bookingData.endDate.split("-");

      const startDateTime = new Date(Date.UTC(parseInt(startDateParts[0], 10), parseInt(startDateParts[1], 10) - 1, parseInt(startDateParts[2], 10), parseInt(bookingData.startHour, 10), parseInt(bookingData.startMinute, 10)));

      const endDateTime = new Date(Date.UTC(parseInt(endDateParts[0], 10), parseInt(endDateParts[1], 10) - 1, parseInt(endDateParts[2], 10), parseInt(bookingData.endHour, 10), parseInt(bookingData.endMinute, 10)));

      if (isDateInThePast(startDateTime, bookingData.startHour, bookingData.startMinute) || isDateInThePast(endDateTime, bookingData.endHour, bookingData.endMinute)) {
        sendError("Csak jövőbeli dátum adható meg.");
        setSaveDisabled(true);
      } else {
        setSaveDisabled(false);
      }
    }
    console.log(bookingData)
  }, [bookingData]);

  return (
    <div>
      <ToastContainer position="bottom-left" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />{" "}
      <div className="absolute w-full h-full flex justify-center items-center bottom-0 left-0 bg-awesomecolor bg-opacity-50 z-50">
        <div className="bg-white">
          <h1 className="text-3xl m-5">Hozzáadás</h1>
          <h1 className="text-3xl m-5"></h1>
          <div className="w-full h-[2px] bg-slate-900"></div>
          <div>
            <div className="flex flex-col p-5 gap-2">
              <div className="py-2 flex gap-5">
                <input type="date" name="startDate" id="startDate" onChange={(e) => setBookingData((prevState) => ({ ...prevState, startDate: e.target.value, endDate: e.target.value }))} />
              </div>
              <div className="py-2 flex gap-5">
                <div className="flex items-center gap-1">
                  <div className="flex gap-1">
                    <input min={0} max={23} type="number" name="" id="" className="border border-solid border-awesomecolor p-[2px] px-2 w-[60px]" placeholder="hh" onChange={(e) => setBookingData((prevState) => ({ ...prevState, startHour: e.target.value }))} />
                    <span>:</span>
                    <input min={0} max={59} type="number" name="" id="" className="border border-solid border-awesomecolor p-[2px] px-2 w-[60px]" placeholder="mm" onChange={(e) => setBookingData((prevState) => ({ ...prevState, startMinute: e.target.value }))} />
                  </div>
                  <span> - </span>
                  <div className="flex gap-1">
                    <input min={0} max={23} type="number" name="" id="" className="border border-solid border-awesomecolor p-[2px] px-2 w-[60px]" placeholder="hh" onChange={(e) => setBookingData((prevState) => ({ ...prevState, endHour: e.target.value }))} />
                    <span>:</span>
                    <input min={0} max={59} type="number" name="" id="" className="border border-solid border-awesomecolor p-[2px] px-2 w-[60px]" placeholder="mm" onChange={(e) => setBookingData((prevState) => ({ ...prevState, endMinute: e.target.value }))} />
                  </div>
                </div>
              </div>
              <div className="relative h-10 w-72 min-w-[200px]">
                {loading ? (
                  <Loading message="Loading Ratings..." />
                ) : (
                  <>
                    <select onChange={(e) => setBookingData((prevState) => ({ ...prevState, sector: e.target.value }))} className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-gray-900 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50">
                      {selectOptions.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">Sector</label>
                  </>
                )}
              </div>
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
