import React from "react";
import { Link } from "react-router-dom";


interface GenreCardProps {
  id: number;
  name: string;
  image: string;
  path: string;
}

const GenreCard = ({ id, name, image, path }: GenreCardProps) => {

  const [isHovered, setIsHovered] = React.useState(false);
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <article onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <Link
        key={id}
        to={path}
        className={`relative overflow-hidden rounded-lg shadow-md transition-transform duration-300 transform ${isHovered ? 'scale-105' : ''}`}
      >
        <img
          loading="lazy"
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300"
        />
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-50'}`}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-50">
          <h3 className={`p-guru text-center transition-transform duration-300 transform ${isHovered ? 'scale-125' : ''} `}>
            {name}
          </h3>
        </div>
      </Link>
    </article>
  );
};

export default GenreCard;
