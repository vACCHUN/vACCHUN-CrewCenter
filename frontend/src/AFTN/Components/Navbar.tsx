type NavbarParams = {
  page: string;
  setPage: (nextPage: string) => void;
};

function Navbar({ page, setPage }: NavbarParams) {
  return (
    <div className="grid grid-cols-5 items-end">
      <button
        onClick={() => setPage("tavirat")}
        className="bg-[#ececec] text-lime-700 flex justify-center items-center font-bold"
        style={{
          height: page == "tavirat" ? "44px" : "40px",
          backgroundColor: page == "tavirat" ? "#f5f5f5" : "#ececec",
          borderTopLeftRadius: page == "tavirat" ? "4px" : undefined,
          borderTopRightRadius: page == "tavirat" ? "4px" : undefined,
          boxShadow: page == "tavirat" ? undefined : "0 1px 2px rgba(0,0,0,0.25)",
          marginRight: page == "/resido" ? "0px" : "4px",
        }}
      >
        Távirat
      </button>

      <button
        onClick={() => setPage("resido")}
        className="bg-[#ececec] text-lime-700 flex justify-center items-center font-bold"
        style={{
          height: page == "resido" ? "44px" : "40px",
          backgroundColor: page == "resido" ? "#f5f5f5" : "#ececec",
          borderTopLeftRadius: page == "resido" ? "4px" : undefined,
          borderTopRightRadius: page == "resido" ? "4px" : undefined,
          boxShadow: page == "resido" ? undefined : "0 1px 2px rgba(0,0,0,0.25)",
          marginRight: page == "/fpl-resido" ? "0px" : "4px",
        }}
      >
        Résidő
      </button>

      <button
        onClick={() => setPage("fpl-resido")}
        className="bg-[#ececec] text-lime-700 flex justify-center items-center font-bold"
        style={{
          height: page == "fpl-resido" ? "44px" : "40px",
          backgroundColor: page == "fpl-resido" ? "#f5f5f5" : "#ececec",
          borderTopLeftRadius: page == "fpl-resido" ? "4px" : undefined,
          borderTopRightRadius: page == "fpl-resido" ? "4px" : undefined,
          boxShadow: page == "fpl-resido" ? undefined : "0 1px 2px rgba(0,0,0,0.25)",
          marginRight: page == "/notam" ? "0px" : "4px",
        }}
      >
        FPL+résidő
      </button>

      <button
        onClick={() => setPage("notam")}
        className="bg-[#ececec] text-lime-700 flex justify-center items-center font-bold"
        style={{
          height: page == "notam" ? "44px" : "40px",
          backgroundColor: page == "notam" ? "#f5f5f5" : "#ececec",
          borderTopLeftRadius: page == "notam" ? "4px" : undefined,
          borderTopRightRadius: page == "notam" ? "4px" : undefined,
          boxShadow: page == "notam" ? undefined : "0 1px 2px rgba(0,0,0,0.25)",
          marginRight: page == "/jelzes-nyomtatas" ? "0px" : "4px",
        }}
      >
        Notam
      </button>

      <button
        onClick={() => setPage("jelzes-nyomtatas")}
        className="bg-[#ececec] text-lime-700 flex justify-center items-center font-bold"
        style={{
          height: page == "jelzes-nyomtatas" ? "44px" : "40px",
          backgroundColor: page == "jelzes-nyomtatas" ? "#f5f5f5" : "#ececec",
          borderTopLeftRadius: page == "jelzes-nyomtatas" ? "4px" : undefined,
          borderTopRightRadius: page == "jelzes-nyomtatas" ? "4px" : undefined,
          boxShadow: page == "jelzes-nyomtatas" ? undefined : "0 1px 2px rgba(0,0,0,0.25)",
          marginRight: page == "/" ? "0px" : undefined,
        }}
      >
        Jelzés / Nyomtatás
      </button>
    </div>
  );
}

export default Navbar;
