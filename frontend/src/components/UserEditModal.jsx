import React from "react";
import ToggleButton from "./ToggleButton";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import Button from "./Button";
import EditModalHeader from "./EditModalHeader";

function UserEditModal({ editData, setEditData, setEditOpen, handleToggle, editSubmit }) {
  const { userData, isAdmin } = useContext(AuthContext);
  return (
    <div className="fixed w-full h-full flex justify-center items-center bottom-0 left-0 bg-awesomecolor/70 z-50">
      <div className="bg-white">
        <EditModalHeader>{editData.name || "Unknown"}</EditModalHeader>
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
                    <ToggleButton value={editData.trainee} field="trainee" onToggle={handleToggle} />
                  </td>
                  <td>
                    <ToggleButton value={editData.isInstructor} field="isInstructor" onToggle={handleToggle} />
                  </td>
                  <td>
                    <ToggleButton value={editData.isAdmin} field="isAdmin" onToggle={handleToggle} disabled={editData.CID == userData.cid} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex gap-3 p-5">
          <Button click={editSubmit} icon="save" text="Save" />
          <Button
            click={() => {
              setEditData({});
              setEditOpen(false);
            }}
            icon="cancel"
            text="Cancel"
          ></Button>
        </div>
      </div>
    </div>
  );
}

export default UserEditModal;
