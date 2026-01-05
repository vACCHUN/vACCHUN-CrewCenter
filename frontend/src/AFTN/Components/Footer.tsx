function Footer() {
  return (
    <div className="bg-white px-3 text-sm flex justify-between">
      <div className="flex items-center">
        <input type="checkbox" id="taviratJelzese" className="mr-1" />
        <label htmlFor="taviratJelzese" className="mr-2">
          {" "}
          Új távirat jelzése
        </label>
        <input type="checkbox" id="listaElejere" className="ml-3 mr-1" />
        <label htmlFor="listaElejere" className="mr-2">
          {" "}
          Auto. lista elejére
        </label>
        <input type="checkbox" id="autoTorles" className="ml-3 mr-1" />
        <label htmlFor="autoTorles" className="mr-2">
          {" "}
          Auto. törlés (10 perc)
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <p className="text-xl">Vissza a listára:</p>
        <select className="w-64 text-center text-lg h-8" id="backToListDropdown"></select>
      </div>
    </div>
  );
}

export default Footer;
