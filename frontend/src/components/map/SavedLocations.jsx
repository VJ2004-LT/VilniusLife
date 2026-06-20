import { useState, useEffect } from "react";
import { getSavedLocations, deleteSavedLocation } from "../../utils/savedLocations";
import { formatAddress } from '../../utils/formatResponse';

export default function SavedLocations({ locations, onRemove, onFocus, shiftRight}) {
  if (locations.length === 0) return null;

  return (

    <div className={`absolute ${shiftRight ? 'top-13 right-5' : 'top-13 right-84'} z-[1000] flex flex-col gap-0`}>
      {locations.map((loc, i) => (
        <button
          key={loc, i}
            onClick={() => onFocus({ 
              lat: loc.coordsLat,            
              lng: loc.coordsLng, 
              noiseLevel: loc.avgNoiseLevel, 
              address: loc.address, 
              schools: loc.schools && typeof loc.schools === 'string' ? JSON.parse(loc.schools) : (loc.schools ?? []),
              routeInfos: loc.routeInfos && typeof loc.routeInfos === 'string' ? JSON.parse(loc.routeInfos) : (loc.routeInfos ?? [])
            })}
          title={formatAddress(loc.address)}
          className="w-[33px] h-[33px] rounded text-sm leaflet-bar bg-white hover:bg-gray-100 flex justify-center items-center"
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
