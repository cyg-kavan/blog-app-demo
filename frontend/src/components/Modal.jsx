import React from "react";

export default function Modal({ onClose, children }) {
  const handleClose = (e) => {
    if (e.target.id === "wrapper") {
      onClose();
    }
  };
  return (
    <div
      id="wrapper"
      onClick={handleClose}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center"
    >
      <div className="w-150 flex flex-col">
        <button
          onClick={() => onClose()}
          className="text-white text-xl place-self-end cursor-pointer"
        >
          X
        </button>
        <div className="bg-white max-h-[80vh] p-7 rounded-md overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
