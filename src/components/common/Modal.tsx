import React, { useEffect } from "react";
import ReactDOM from "react-dom";

const Modal = ({ videokey, handleOpenVideo }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={handleOpenVideo}
    >
      <div
        className="p-6 rounded-lg max-w-3xl w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videokey}`}
          title="Video Player"
          className="w-full h-96"
          allowFullScreen
        ></iframe>
        <button onClick={handleOpenVideo} className="absolute right-6 lg:-right-6 -top-6">
          <img src="/close.svg" alt="CLOSE" className="w-10 h-10" />
        </button>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
