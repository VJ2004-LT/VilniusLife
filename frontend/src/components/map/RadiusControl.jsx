import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import { RADIUS_MIN, RADIUS_MAX, RADIUS_STEP, RADIUS_DEBOUNCE } from "../../constants/mapConfig";

function RadiusControl({ radius, onChange, onLocalChange }) {
  const ref = useRef();
  const [localRadius, setLocalRadius] = useState(radius);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (ref.current) {
      L.DomEvent.disableClickPropagation(ref.current);
      L.DomEvent.disableScrollPropagation(ref.current);
    }
  }, []);

  function handleChange(e) {
    const value = Number(e.target.value);
    setLocalRadius(value);
    onLocalChange(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange(value);
    }, RADIUS_DEBOUNCE);
  }

  return (
    <div ref={ref} className="leaflet-top leaflet-left ml-10 -mt-1">
      <div className="panel leaflet-control p-3 text-sm min-w-40 h-[70px]">
        <p className="font-bold ">Radius: {localRadius}m</p>
        <input
          type="range"
          min={RADIUS_MIN}
          max={RADIUS_MAX}
          step={RADIUS_STEP}
          value={localRadius}
          onChange={handleChange}
          className="w-full"
        />
      </div>
    </div>
  );
}

export default RadiusControl;
