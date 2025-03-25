import { useState, useEffect } from "react";
import "../App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import config from "../config";
const API_URL = config.API_URL;
const VATSIM_URL = config.VATSIM_API_URL;
const VATSIM_CLIENT_ID = config.CLIENT_ID;

function AdminPage() {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState("");
  const [userData, setUserData] = useState("");
  const [loginValid, setLoginValid] = useState("");

  const [loading, setLoading] = useState(true);
  const [atcos, setATCOs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const [visitors, setVisitors] = useState([]);
  const [visitorsCount, setVisitorsCount] = useState(0);

  const [editData, setEditData] = useState({});
  const [editOpen, setEditOpen] = useState(false);

  const [createVisitorData, setCreateVisitorData] = useState({});
  const [visitorCreateOpen, setVisitorCreateOpen] = useState(false);

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

  useEffect(() => {
    function fetchUserData() {
      if (accessToken) {
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `${VATSIM_URL}/api/user?client_id=${VATSIM_CLIENT_ID}`,
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

      const fetchData = async () => {
        try {
          const adminResponse = await axios.get(`${API_URL}/atcos/cid/${userData.cid}`);
          if (!adminResponse.data.ATCOs[0].isAdmin) {
            logout("Insufficient permissions");
          }
          const response = await axios.post(`${API_URL}/auth/verifyLogin`, userData);

          if (!response.data.allowed && !response.data.loading) {
            logout(response.data.message);
          } else {
            setLoginValid(true);
          }
        } catch (error) {
          sendError("Invalid login.");
        }
      };
      fetchData();
    }
  }, [userData]);

  useEffect(() => {
    const getStoredToken = () => {
      const storedToken = localStorage.getItem("accessToken");
      if (storedToken) {
        setAccessToken(storedToken);
      } else {
        navigate("/login");
      }
    };

    getStoredToken();
  }, []);

  function logout(err) {
    const errorMessage = err && typeof err === "string" ? err : "You have been logged out";
    localStorage.removeItem("accessToken");
    setAccessToken("");
    navigate("/login", { state: { errorMessage } });
  }

  useEffect(() => {
    const fetchATCOs = async () => {
      try {
        const response = await axios.get(`${API_URL}/atcos`);
        const data = response.data;
        setATCOs(data.ATCOs);
        setTotalCount(data.count);
        setLoading(false);
      } catch (error) {
        sendError("Error fetching ATCOs");
      }
    };

    fetchATCOs();

    const fetchVisitors = async () => {
      try {
        const response = await axios.get(`${API_URL}/visitors`);
        const data = response.data;
        setVisitors(data.visitors);
        setVisitorsCount(data.count);
        setLoading(false);
      } catch (error) {
        sendError("Error fetching visitors");
      }
    };

    fetchVisitors();
  }, []);

  const deleteAtco = async (cid) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/atcos/delete/${cid}`);
      setATCOs(atcos.filter((atco) => atco.CID !== cid));
      setTotalCount(totalCount - 1);
      setLoading(false);
      sendInfo(`Deleted ${cid}`);
    } catch (error) {
      sendError("Error while deleting ATCO.");
      setLoading(false);
    }
  };

  const deleteVisitor = async (cid) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/visitors/delete/${cid}`);
      setVisitors(visitors.filter((visitor) => visitor.cid !== cid));
      setVisitorsCount(visitorsCount - 1);
      setLoading(false);
      sendInfo(`Deleted ${cid}`);
    } catch (error) {
      sendError("Error while deleting visitor.");
      setLoading(false);
    }
  };

  const renderTableBody = () =>
    atcos.map((atco, index) => (
      <tr key={index} className="hover:bg-gray-100">
        <td className="px-4 py-2">{atco.initial}</td>
        <td className="px-4 py-2">{atco.CID}</td>
        <td className="px-4 py-2">{atco.name}</td>
        <td className="px-4 py-2">{atco.trainee ? "Igen" : "Nem"}</td>
        <td className="px-4 py-2">{atco.isInstructor ? "Igen" : "Nem"}</td>
        <td className="px-4 py-2">{atco.isAdmin ? "Igen" : "Nem"}</td>
        <td className="px-4 py-2">
          <button
            onClick={() => {
              setEditData(atco);
              setEditOpen(true);
            }}
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </button>
        </td>
        <td className="px-4 py-2">
          {atco.CID != userData.cid && (
            <button onClick={() => deleteAtco(atco.CID)}>
              <i className="fa-solid fa-trash text-red-600"></i>
            </button>
          )}
        </td>
      </tr>
    ));

  const editSubmit = async () => {
    try {
      const response = await axios.put(`${API_URL}/atcos/update/${editData.CID}`, editData);

      if (response.status === 200) {
        const updatedResponse = await axios.get(`${API_URL}/atcos`);
        const updatedData = updatedResponse.data;
        setATCOs(updatedData.ATCOs);

        sendInfo("ATCO has been updated.");
        setEditOpen(false);
      } else {
        sendError("Error while updating ATCO.");
        console.error("Failed to update data:", response.data);
      }
    } catch (error) {
      sendError("Error while updating ATCO.");
      console.error("Error updating data:", error);
    }
  };

  const createVisitorSubmit = async () => {
    try {
      const response = await axios.post(`${API_URL}/visitors/add`, createVisitorData);

      if (response.status === 200) {
        const updatedResponse = await axios.get(`${API_URL}/visitors`);
        const updatedData = updatedResponse.data;
        setVisitors(updatedData.visitors);
        setVisitorsCount(updatedData.count);
        sendInfo("Visitor has been created");
        setCreateVisitorData({});
        setVisitorCreateOpen(false);
      } else {
        sendError("Error while creating Visitor.");
        console.error("Failed to update data:", response.data);
      }
    } catch (error) {
      sendError("Error while updating ATCO.");
      console.error("Error updating data:", error);
    }
  };

  return (
    <>
      {loginValid ? (
        <>
          <div className="pt-[30px]">
            <Nav Active="bulldozer" />
            {loading ? (
              <Loading message="Loading ATCOs..." />
            ) : (
              <>
                <div className="overflow-x-auto p-4">
                  <table className="min-w-full divide-y divide-gray-300 rounded shadow-md">
                    <thead className="bg-awesomecolor text-white">
                      <tr>
                        <th className="px-4 py-2 text-left">Initial</th>
                        <th className="px-4 py-2 text-left">CID</th>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Trainee</th>
                        <th className="px-4 py-2 text-left">Instructor</th>
                        <th className="px-4 py-2 text-left">Admin</th>
                        <th className="px-4 py-2 text-left">Edit</th>
                        <th className="px-4 py-2 text-left">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">{renderTableBody()}</tbody>
                  </table>
                  <p className="text-sm text-gray-600 mt-2">Total ATCOs: {totalCount}</p>
                </div>

                <div className="overflow-x-auto p-4">
                  <table className="min-w-full divide-y divide-gray-300 rounded shadow-md">
                    <thead className="bg-awesomecolor text-white">
                      <tr>
                        <th className="px-4 py-2 text-left">Initial</th>
                        <th className="px-4 py-2 text-left">CID</th>
                        <th className="px-4 py-2 text-left">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {visitors.map((visitor) => (
                        <tr key={visitor.cid} className="hover:bg-gray-100">
                          <td className="px-4 py-2">{visitor.initial}</td>
                          <td className="px-4 py-2">{visitor.cid}</td>
                          <td className="px-4 py-2">
                            <button className="text-red-600 hover:text-red-800" onClick={() => deleteVisitor(visitor.cid)}>
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-sm text-gray-600 mt-2">Total visitors: {visitorsCount}</p>
                  <button onClick={() => setVisitorCreateOpen(true)} className="mt-2 text-blue-600 hover:underline">
                    <strong>Add visitor </strong>
                    <i className="fa-solid fa-square-plus"></i>
                  </button>
                </div>
              </>
            )}
          </div>

          {visitorCreateOpen && !editOpen ? (
            <>
              <div className="absolute w-full h-full flex justify-center items-center bottom-0 left-0 bg-awesomecolor opacity-65">
                <div className="bg-white">
                  <h1 className="text-3xl m-5">Add visitor</h1>
                  <div className="w-full h-[2px] bg-slate-900"></div>
                  <div className="grid grid-cols-1">
                    <div className="flex flex-col p-5 gap-2">
                      <input type="text" placeholder="Initial" maxLength="2" className="border border-solid border-awesomecolor p-[2px] px-2" onChange={(e) => setCreateVisitorData((prevState) => ({ ...prevState, initial: e.target.value }))} />
                      <input type="text" placeholder="CID" className="border border-solid border-awesomecolor p-[2px] px-2" onChange={(e) => setCreateVisitorData((prevState) => ({ ...prevState, cid: e.target.value }))} />
                    </div>
                  </div>
                  <div className="flex gap-3 p-5">
                    <button onClick={createVisitorSubmit} className="bg-white hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                      <i className="fa-solid fa-floppy-disk"></i> Mentés
                    </button>
                    <button
                      onClick={() => {
                        setCreateVisitorData({});
                        setVisitorCreateOpen(false);
                      }}
                      className="bg-white hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                    >
                      <i className="fa-solid fa-ban"></i> Elvetés
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            ""
          )}

          <ToastContainer position="bottom-left" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />

          {editOpen ? (
            <div className="fixed w-full h-full flex justify-center items-center bottom-0 left-0 bg-awesomecolor/70 z-50">
            <div className="bg-white">
                <h1 className="text-3xl m-5">{editData.name}</h1>
                <div className="w-full h-[2px] bg-slate-900"></div>
                <div className="grid grid-cols-2">
                  <div className="flex flex-col p-5 gap-2">
                    <input type="text" className="border border-solid border-awesomecolor p-[2px] px-2" defaultValue={editData.initial} onChange={(e) => setEditData((prevState) => ({ ...prevState, initial: e.target.value }))} />
                    <input type="text" className="border border-solid border-awesomecolor bg-slate-300 cursor-not-allowed p-[2px] px-2" readOnly value={editData.CID} />
                  </div>
                  <div className="p-5">
                    <table className="table-auto">
                      <thead>
                        <tr>
                          <th>Trainee</th>
                          <th>Instructor</th>
                          <th>Admin</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="text-center">
                          <td>
                            <i onClick={() => setEditData((prevState) => ({ ...prevState, trainee: editData.trainee == 1 ? 0 : 1 }))} className={editData.trainee ? "fa-solid fa-check text-green-600" : "fa-solid fa-x text-red-600"}></i>
                          </td>
                          <td>
                            <i onClick={() => setEditData((prevState) => ({ ...prevState, isInstructor: editData.isInstructor == 1 ? 0 : 1 }))} className={editData.isInstructor ? "fa-solid fa-check text-green-600" : "fa-solid fa-x text-red-600"}></i>
                          </td>
                          <td>{editData.CID != userData.cid && <i onClick={() => setEditData((prevState) => ({ ...prevState, isAdmin: editData.isAdmin == 1 ? 0 : 1 }))} className={editData.isAdmin ? "fa-solid fa-check text-green-600" : "fa-solid fa-x text-red-600"}></i>}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex gap-3 p-5">
                  <button onClick={editSubmit} className="bg-white hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                    <i className="fa-solid fa-floppy-disk"></i> Mentés
                  </button>
                  <button
                    onClick={() => {
                      setEditData({});
                      setEditOpen(false);
                    }}
                    className="bg-white hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                  >
                    <i className="fa-solid fa-ban"></i> Elvetés
                  </button>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </>
      ) : (
        <Loading message="Verifying login..." />
      )}
    </>
  );
}

export default AdminPage;
