function Footer() {
  return (
    <div className="w-full bg-white">
      <div className="bg-white px-3 text-sm flex justify-between w-[90%]">
        <div className="flex items-center">
          <input
            disabled
            type="checkbox"
            id="taviratJelzese"
            className="mr-1"
          />
          <label htmlFor="taviratJelzese" className="mr-2 font-bold">
            {" "}
            Új távirat jelzése
          </label>
          <input
            disabled
            type="checkbox"
            id="listaElejere"
            className="ml-3 mr-1"
          />
          <label htmlFor="listaElejere" className="mr-2 font-bold">
            {" "}
            Auto. lista elejére
          </label>
          <input
            disabled
            type="checkbox"
            id="autoTorles"
            className="ml-3 mr-1"
          />
          <label htmlFor="autoTorles" className="mr-2 font-bold">
            {" "}
            Auto. törlés (10 perc)
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-lg font-bold">Vissza a listára:</p>
          <select
            className="w-64 text-center text-lg h-8"
            id="backToListDropdown"
          ></select>
        </div>
      </div>
    </div>
  );
}

export default Footer;
