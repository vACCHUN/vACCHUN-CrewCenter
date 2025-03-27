import React from "react";

function ToggleButton({ value, field, onToggle, disabled }) {
  if (disabled) return null;

  const iconClass = value ? "fa-solid fa-check text-green-600" : "fa-solid fa-x text-red-600";

  return !disabled ? <i onClick={() => onToggle(field, value ? 0 : 1)} className={iconClass} style={{ cursor: "pointer" }} /> : <></>;
}

export default ToggleButton;
