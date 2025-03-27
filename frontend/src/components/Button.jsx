import React from "react";

const ICONS = {
  save: "fa-solid fa-floppy-disk",
  cancel: "fa-solid fa-ban",
  delete: "fa-solid fa-trash",
}

function Button({click, icon, text, disabled}) {
  
  const iconClass = ICONS[icon] || icon;

  return (
    <button disabled={disabled} onClick={click} className="bg-white hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
      <i className={iconClass}></i> {text}
    </button>
  );
}

export default Button;
