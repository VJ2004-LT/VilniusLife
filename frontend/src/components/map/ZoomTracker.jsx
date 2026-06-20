import { useMapEvents } from "react-leaflet";

export default function ZoomTracker({ onZoomChange }) {
  useMapEvents({
    zoom: (e) => {
      e.target.closePopup();
      onZoomChange(e.target.getZoom());
    },
  });
  return null;
}
