import Nav from "../components/Nav";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import "../App.css";


export default function App() {
  async function applyLightLevel(v) {
    await axios.post(`${PUBLIC_API_URL}/lhdc`, { LHDC_rwylights: 1, LHDC_rwyLightLevel: v });
  }

  return (
    <>
      <Nav />
      <div className="pt-[30px] flex items-center px-[5px]">
        <p className="mx-2">LHDC approach lights: </p>
        <input
          className="w-[100px] shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          onChange={(e) => {
            applyLightLevel(e.target.value / 100);
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
