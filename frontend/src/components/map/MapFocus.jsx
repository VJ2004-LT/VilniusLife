import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function MapFocus({ position, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, zoom ?? map.getZoom(), { duration: 1.5, animate: true });
  }, [position]);
  return null;
}
