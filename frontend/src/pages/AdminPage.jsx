import { useState, useContext } from "react";
import "../App.css";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Loading from "../components/Loading";
import Nav from "../components/Nav";
import AuthContext from "../context/AuthContext";
import config from "../config";
import useAtcos from "../hooks/useAtcos";
import useVisitors from "../hooks/useVisitors";
import useToast from "../hooks/useToast";
import UserEditModal from "../components/UserEditModal";
import CustomToastContainer from "../components/CustomToastContainer";
import EditModal from "../components/EditModal";
import EditModalHeader from "../components/EditModalHeader";

const API_URL = config.API_URL;

function AdminPage() {
  const { userData, isAdmin } = useContext(AuthContext);

  const [editData, setEditData] = useState({});
  const [editOpen, setEditOpen] = useState(false);

  const [createVisitorData, setCreateVisitorData] = useState({});
  const [visitorCreateOpen, setVisitorCreateOpen] = useState(false);

  const { sendError, sendInfo } = useToast();

  const {
    atcos,
    totalCount,
    loading: atcosLoading,
    deleteAtco,
    refreshATCOs,
  } = useAtcos(sendError, sendInfo);

  const {
    visitors,
    visitorsCount,
    loading: visitorsLoading,
    deleteVisitor,
    refreshVisitors,
  } = useVisitors(sendError, sendInfo);

  const loading = atcosLoading || visitorsLoading;

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
      const response = await axios.put(
        `${API_URL}/atcos/update/${editData.CID}`,
        editData
      );

      if (response.status === 200) {
        const updatedResponse = await axios.get(`${API_URL}/atcos`);
        const updatedData = updatedResponse.data;
        await refreshATCOs();

        sendInfo("ATCO has been updated.");
        setEditOpen(false);
      } else {
        sendError("Error while updating ATCO.");
        console.error("Failed to update data:", response.data);
      }
    } catch (error) {
      sendError("Error while updating ATCO.");
      throw Error("Error while updating ATCO", error);
    }
  };

  const createVisitorSubmit = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/visitors/add`,
        createVisitorData
      );

      if (response.status === 200) {
        const updatedResponse = await axios.get(`${API_URL}/visitors`);
        const updatedData = updatedResponse.data;
        refreshVisitors();
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

  const handleToggle = (field, newValue) => {
    setEditData((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };

  return (
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
                <tbody className="divide-y divide-gray-200 bg-white">
                  {renderTableBody()}
                </tbody>
              </table>
              <p className="text-sm text-gray-600 mt-2">
                Total ATCOs: {totalCount}
              </p>
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
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => deleteVisitor(visitor.cid)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-sm text-gray-600 mt-2">
                Total visitors: {visitorsCount}
              </p>
              <button
                onClick={() => setVisitorCreateOpen(true)}
                className="mt-2 text-blue-600 hover:underline"
              >
                <strong>Add visitor </strong>
                <i className="fa-solid fa-square-plus"></i>
              </button>
            </div>
          </>
        )}
      </div>

      {visitorCreateOpen && !editOpen ? (
        <>
          <EditModal>
            <EditModalHeader>Add</EditModalHeader>
            <div className="grid grid-cols-1">
              <div className="flex flex-col p-5 gap-2">
                <input
                  type="text"
                  placeholder="Initial"
                  maxLength="2"
                  className="border border-solid border-awesomecolor p-[2px] px-2"
                  onChange={(e) =>
                    setCreateVisitorData((prevState) => ({
                      ...prevState,
                      initial: e.target.value.toUpperCase(),
                    }))
                  }
                />
                <input
                  type="text"
                  placeholder="CID"
                  className="border border-solid border-awesomecolor p-[2px] px-2"
                  onChange={(e) =>
                    setCreateVisitorData((prevState) => ({
                      ...prevState,
                      cid: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex gap-3 p-5">
              <button
                onClick={createVisitorSubmit}
                className="bg-white hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
              >
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
          </EditModal>
        </>
      ) : (
        ""
      )}

      <CustomToastContainer></CustomToastContainer>

      {editOpen ? (
        <UserEditModal
          editSubmit={editSubmit}
          editData={editData}
          setEditData={setEditData}
          setEditOpen={setEditOpen}
          handleToggle={handleToggle}
        />
      ) : (
        ""
      )}
    </>
  );
}

export default AdminPage;
