import ToggleButton from "./ToggleButton";
import Button from "./Button";
import EditModalHeader from "./EditModalHeader";
import EditModal from "./EditModal";
import useAuth from "../hooks/useAuth";
import { User } from "../types/users";
import { UserOptionsToggleField } from "../types/atco";

type UserEditModalParams = {
  editData: User;
  setEditData: React.Dispatch<React.SetStateAction<User>>;
  setEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleToggle: (field: UserOptionsToggleField, newValue: number) => void;
  editSubmit: () => void;
};

function UserEditModal({ editData, setEditData, setEditOpen, handleToggle, editSubmit }: UserEditModalParams) {
  const { userData } = useAuth();
  return (
    <EditModal>
      <EditModalHeader>{editData.name || "Unknown"}</EditModalHeader>
      <div className="grid grid-cols-2">
        <div className="flex flex-col p-5 gap-2">
          <input type="text" className="border border-solid border-awesomecolor p-[2px] px-2" defaultValue={editData.initial} onChange={(e) => setEditData((prevState) => ({ ...prevState, initial: e.target.value.toUpperCase() }))} />
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
                  <ToggleButton value={editData.isAdmin} field="isAdmin" onToggle={handleToggle} disabled={editData.CID == userData?.cid} />
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
            setEditOpen(false);
          }}
          icon="cancel"
          text="Cancel"
        ></Button>
      </div>
    </EditModal>
  );
}

export default UserEditModal;
