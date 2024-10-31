import React, { useState } from 'react';

interface ToggleSwitchProps {
  labels: string[];
  children: React.ReactNode[];
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ labels, children }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <div className="flex flex-col items-center mb-4">
      <div className="flex justify-center gap-16 mb-4 md:mb-8">
        {labels.map((label, index) => (
          <button
            key={index}
            onClick={() => handleSelect(index)}
            className={`h2-guru text-3xl hover:text-secondary ${selectedIndex === index ? 'text-secondary underline' : 'text-gray-700'}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div>
        {children[selectedIndex]}
      </div>
    </div>
  );
};

export default ToggleSwitch;
