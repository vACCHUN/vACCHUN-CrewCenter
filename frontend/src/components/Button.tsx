const ICONS = {
  save: "fa-solid fa-floppy-disk",
  cancel: "fa-solid fa-ban",
  delete: "fa-solid fa-trash",
  close: "fa-solid fa-circle-xmark",
  plus: "fa-solid fa-plus",
  google: "fa-brands fa-google",
  apple: "fa-brands fa-apple",
};

type ButtonParams = {
  click: () => void;
  icon: string;
  text: string;
  disabled?: boolean;
};

function Button({ click, icon, text, disabled = false}: ButtonParams) {
  let iconClass = icon;
  if (icon in ICONS) {
    iconClass = ICONS[icon as keyof typeof ICONS];
  }

  return (
    <button disabled={disabled} onClick={click} className="bg-white hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
      <i className={iconClass}></i> {text}
    </button>
  );
}

export default Button;
