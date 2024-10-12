import React from 'react';

interface SuggestBoxProps {
  placeholder?: string;
  fromColor?: string;
  toColor?: string;
}

const SuggestBox: React.FC<SuggestBoxProps> = ({
  placeholder,
  fromColor = 'blue-400',
  toColor = 'purple-500',
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <article
        className={`w-64 h-32 bg-gradient-to-r 
                from-${fromColor} to-${toColor} flex items-center justify-center 
                text-white font-semibold rounded-lg shadow-lg transition-transform 
                duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl`}
      >
        <span className="text-center h3-guru">{placeholder}</span>
      </article>
    </div>
  );
};

export default SuggestBox;
