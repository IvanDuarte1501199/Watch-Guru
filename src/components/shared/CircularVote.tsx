import React from 'react';

type CircularVoteProps = {
  voteAverage: number;
};

const getColor = (percentage: number) => {
  if (percentage >= 70) return '#22c55e'; // Green
  if (percentage >= 50) return '#eab308'; // Yellow
  return '#ef4444'; // Red
};

const CircularVote: React.FC<CircularVoteProps> = ({ voteAverage }) => {
  const vote = Math.min(Math.max(voteAverage, 0), 10);
  const roundedVote = vote.toFixed(1);
  const percentage = (vote / 10) * 100;

  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (vote / 10) * circumference;

  const dynamicColor = getColor(percentage);

  return (
    <div className="relative flex items-center justify-center w-11 h-11 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800/80 shadow-md">
      <svg height="40" width="40" className="transform -rotate-90">
        {/* Track circle */}
        <circle
          cx="20"
          cy="20"
          r={radius}
          strokeWidth="2.5"
          stroke="#1e293b"
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx="20"
          cy="20"
          r={radius}
          strokeWidth="2.5"
          stroke={dynamicColor}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-white text-[11px] font-black tracking-tighter">
        {roundedVote}
      </div>
    </div>
  );
};

export default CircularVote;
