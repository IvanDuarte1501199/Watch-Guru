import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-in">
      {/* Premium Loader: Pulsing brand logo inside a spinning neon cyan border */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-slate-800/40 border-t-secondary animate-spin" />
        <div className="absolute inset-2 rounded-full bg-slate-950/80 border border-slate-850 flex items-center justify-center animate-pulse">
          <img src="/logo.svg" alt="Loading..." className="w-6 h-6 opacity-60" />
        </div>
      </div>
      <p className="text-slate-400 font-bold text-xs tracking-widest mt-4 uppercase animate-pulse">
        Cargando...
      </p>
    </div>
  );
};

export default Loader;
