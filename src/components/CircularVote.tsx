import React from 'react';

type CircularVoteProps = {
  voteAverage: number;
};

const getColor = (percentage: number) => {
  const r = percentage < 50 ? 255 : Math.floor(255 - (percentage * 2 - 100) * 255 / 100);
  const g = percentage > 50 ? 255 : Math.floor((percentage * 2) * 255 / 100);
  return `rgb(${r},${g},0)`;
};

const CircularVote: React.FC<CircularVoteProps> = ({ voteAverage }) => {
  const vote = Math.min(Math.max(voteAverage, 0), 10);
  const roundedVote = vote.toFixed(1);
  const percentage = (vote / 10) * 100;

  const radius = 18;
  const outerRadius = radius + 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (vote / 10) * circumference;

  const dynamicColor = getColor(percentage);

  return (
    <div className="relative">
      <svg height="80" width="80" className="transform -rotate-90">
        <circle
          cx="40"
          cy="40"
          r={outerRadius}
          strokeWidth="2"
          stroke="black"
          fill="black"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          strokeWidth="2"
          stroke="#e0e0e0"
          fill="black"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          strokeWidth="2"
          stroke={dynamicColor}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">
        {roundedVote}
      </div>
    </div>
  );
};

export default CircularVote;
