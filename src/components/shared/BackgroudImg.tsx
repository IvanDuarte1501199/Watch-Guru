import React, { useState } from 'react';

interface BackgroudImgProps {
  src: string;
}

const BackgroudImg: React.FC<BackgroudImgProps> = ({ src }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) return null;

  return (
    <div className="bgtop">
      <img 
        src={src} 
        alt="" 
        onError={() => setHasError(true)} 
        loading="eager" 
      />
    </div>
  );
};
export default BackgroudImg;
