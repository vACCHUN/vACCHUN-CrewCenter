import { useState, useEffect } from "react";
import "../App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Loading from "../components/Loading";
import { useNavigate, useLocation } from "react-router-dom";
import Nav from "../components/Nav";

function AdminPage() {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState("");
  const [userData, setUserData] = useState("");
  const [loginValid, setLoginValid] = useState("");

  const [loading, setLoading] = useState(true);
  const [atcos, setATCOs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

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

      const fetchData = async () => {
        try {
          const adminResponse = await axios.get(`http://localhost:3000/atcos/cid/${userData.cid}`);
          if (!adminResponse.data.ATCOs[0].isAdmin) {
            logout("Insufficient permissions");
          }
          const response = await axios.post("http://localhost:3000/auth/verifyLogin", userData);

          console.log(response.data);
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
        console.log("redirecting....");
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
        const response = await axios.get("http://localhost:3000/atcos");
        const data = response.data;
        setATCOs(data.ATCOs);
        setTotalCount(data.count);
        setLoading(false);
      } catch (error) {
        sendError("Error fetching ATCOs");
      }
    };

    fetchATCOs();
  }, []);

  const deleteAtco = async (cid) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:3000/atcos/delete/${cid}`);
      setATCOs(atcos.filter((atco) => atco.CID !== cid));
      setLoading(false);
      sendInfo(`Deleted ${cid}`);
    } catch (error) {
      sendError("Error while deleting ATCO.");
      setLoading(false);
      console.log("err");
    }
  };

  const [editData, setEditData] = useState({});
  const [editOpen, setEditOpen] = useState(false);

  const renderTableBody = () => {
    console.log(atcos)
    return atcos.map((atco, index) => (
      <tr key={index}>
        <td>{atco.initial}</td>
        <td>{atco.CID}</td>
        <td>{atco.name}</td>
        <td>{atco.trainee ? "Igen" : "Nem"}</td>
        <td>{atco.isInstructor ? "Igen" : "Nem"}</td>
        <td>{atco.isAdmin ? "Igen" : "Nem"}</td>
        <td>
          <button
            onClick={() => {
              if (atco) {
                setEditData({
                  initial: atco.initial,
                  CID: atco.CID,
                  name: atco.name,
                  trainee: atco.trainee,
                  isInstructor: atco.isInstructor,
                  isAdmin: atco.isAdmin,
                });
                console.log(editData);
                setEditOpen(true);
              }
            }}
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </button>
        </td>
        <td>
          {atco.CID != userData.cid ? <button
            onClick={() => {
              deleteAtco(atco.CID);
            }}
          >
            <i className="fa-solid fa-trash"></i>
          </button> : ""}
        </td>
      </tr>
    ));
  };

  const editSubmit = async () => {
    console.log(editData);
    try {
      const response = await axios.put(`http://localhost:3000/atcos/update/${editData.CID}`, editData);

      if (response.status === 200) {
        const updatedResponse = await axios.get("http://localhost:3000/atcos");
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

  return (
    <>
      {loginValid ? (
        <>
          <div className="pt-[30px]">
            <Nav Active="bulldozer" />
            {loading ? (
              <Loading message="Loading ATCOs..." />
            ) : (
              <table className="table-auto">
                <thead>
                  <tr>
                    <th>Initial</th>
                    <th>CID</th>
                    <th>Name</th>
                    <th>Trainee</th>
                    <th>Instructor</th>
                    <th>Admin</th>
                    <th>Szerkesztés</th>
                    <th>Törlés</th>
                  </tr>
                </thead>
                <tbody>{renderTableBody()}</tbody>
              </table>
            )}
            <p>Total ATCOs: {totalCount}</p>
          </div>
          <ToastContainer position="bottom-left" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />{" "}
          {editOpen ? (
            <div className="absolute w-full h-full flex justify-center items-center bottom-0 left-0 bg-awesomecolor  opacity-65">
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
                            <i
                              onClick={() => {
                                setEditData((prevState) => ({
                                  ...prevState,
                                  trainee: editData.trainee == 1 ? 0 : 1,
                                }));
                              }}
                              className={editData.trainee ? "fa-solid fa-check text-green-600" : "fa-solid fa-x text-red-600"}
                            ></i>
                          </td>
                          <td>
                            <i
                              onClick={() => {
                                setEditData((prevState) => ({
                                  ...prevState,
                                  isInstructor: editData.isInstructor == 1 ? 0 : 1,
                                }));
                              }}
                              className={editData.isInstructor ? "fa-solid fa-check text-green-600" : "fa-solid fa-x text-red-600"}
                            ></i>
                          </td>
                          <td>
                            {editData.CID != userData.cid ? <i
                              onClick={() => {
                                setEditData((prevState) => ({
                                  ...prevState,
                                  isAdmin: editData.isAdmin == 1 ? 0 : 1,
                                }));
                              }}
                              className={editData.isAdmin ? "fa-solid fa-check text-green-600" : "fa-solid fa-x text-red-600"}
                            ></i> : ""}
                          </td>
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
