import React from "react";

function EditModal({ children }) {
  return (
    <div className="fixed w-full h-full flex justify-center items-center bottom-0 left-0 bg-awesomecolor bg-opacity-50 z-50">
      <div className="bg-white">
        {children}
      </div>
    </div>
  );
}

export default EditModal;
