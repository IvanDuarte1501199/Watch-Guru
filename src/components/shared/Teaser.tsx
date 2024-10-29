import Modal from "@components/common/Modal";
import { useState } from "react";

function Teaser({ teaser }) {
  const [isOpenModal, setisOpenModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (!teaser || Object.keys(teaser).length === 0) return null;

  const title = teaser.name.length > 30 ? teaser.name.substring(0, 25) + ' ...' : teaser.name;

  const handleOpenVideo = () => {
    setisOpenModal(!isOpenModal);
  };

  return (
    <>
      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={handleOpenVideo}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <p className="p-guru text-center text-lg pb-2 text-white line-clamp-1">{title}</p>
        <span className="relative">
          <img
            alt={teaser.name}
            className={`transition-opacity duration-300 ${isHovered ? 'blur-sm' : ''}`}
            src={`https://img.youtube.com/vi/${teaser.key}/hqdefault.jpg`}
          />
          <span className="absolute inset-0 flex justify-center items-center">
            <div
              className={`w-20 h-20 bg-black bg-opacity-50 rounded-full
              flex justify-center items-center border-2 border-primary
              transition-transform duration-300 ease-in-out
              ${isHovered ? 'scale-110 bg-white' : ''}`}
            >
              <img src="/play.svg" alt="PLAY" className="w-12 h-12" />
            </div>
          </span>
        </span>
      </div>
      {isOpenModal && (
        <Modal
          videokey={teaser.key}
          handleOpenVideo={handleOpenVideo}
        />
      )}
    </>
  );
}

export default Teaser;
