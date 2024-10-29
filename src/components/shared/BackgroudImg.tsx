import React from 'react';

interface BackgroudImgProps {
  src: string;
}

const BackgroudImg: React.FC<BackgroudImgProps> = ({ src }) => {
  return (
    <div className="bgtop">
      <img src={src} alt="movie_background" loading="eager" />
    </div>
  );
};
export default BackgroudImg;
