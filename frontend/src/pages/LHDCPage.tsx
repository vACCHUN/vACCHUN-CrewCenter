import Nav from "../components/Nav";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import "../App.css";
import { throwError } from "../utils/throwError";

export default function App() {
  async function applyLightLevel(v: number) {
    try {
      await axios.post(`/cc-api/lhdc`, {
        LHDC_rwylights: 1,
        LHDC_rwyLightLevel: v,
      });
    } catch (error) {
      throwError("Error applying light level (lhdc): ", error);
    }
  }

  return (
    <>
      <Nav />
      <div className="pt-[30px] flex items-center px-[5px]">
        <p className="mx-2">LHDC approach lights: </p>
        <input
          className="w-[100px] shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          onChange={(e) => {
            applyLightLevel(parseInt(e.target.value) / 100);
          }}
          type="number"
          name="lhdc"
          id="lhdc"
          min={0}
          max={100}
        />
        %
      </div>
    </>
  );
}
