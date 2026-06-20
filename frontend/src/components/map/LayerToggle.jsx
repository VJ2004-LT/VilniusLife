import { useState } from 'react';

function LayerToggle({ label, visible, onToggle }) {
  return (
    <div className="leaflet-bottom leaflet-left mb-0 ml-0">
      <div className="leaflet-control">
        <button
          onClick={onToggle}
          className={`px-3 h-[33px] rounded items-center text-sm font-semibold leaflet-bar ${
            visible ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
          }`}
        >
          {label}
        </button>
      </div>
    </div>
  );
}

export default LayerToggle;
