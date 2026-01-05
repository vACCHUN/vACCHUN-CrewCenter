import { useState } from "react";
import "./aftn.css";
import Clock from "./Components/Clock";
import Navbar from "./Components/Navbar";
import TaviratPage from "./pages/TaviratPage";
import ResidoPage from "./pages/ResidoPage";
import FplResidoPage from "./pages/FplResidoPage";
import NotamPage from "./pages/NotamPage";
import JelzesNyomtatasPage from "./pages/JelzesNyomtatasPage";

function Aftn() {
  const [page, setPage] = useState("resido");

  return (
    <>
      <div className="grid grid-cols-2 py-3">
        <div className="w-fit px-2">
          <div className="p-1 bg-[#f5f5f5]">
            <span className="bg-[#f0f0f0] p-1 border border-blue-500 text-lime-500 font-bold">LINE</span>
          </div>
        </div>
        <div className="flex justify-end px-12">
          <Clock></Clock>
        </div>
      </div>
      <div className="m-1">
        <Navbar page={page} setPage={setPage}></Navbar>

        {page == "tavirat" && <TaviratPage />}
        {page == "resido" && <ResidoPage />}
        {page == "fpl-resido" && <FplResidoPage />}
        {page == "notam" && <NotamPage />}
        {page == "jelzes-nyomtatas" && <JelzesNyomtatasPage />}
      </div>
    </>
  );
}

export default Aftn;
