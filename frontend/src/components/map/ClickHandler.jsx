import { useMapEvents } from "react-leaflet";

function ClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      if (e.originalEvent?.target?.closest?.(".leaflet-interactive")) {
        return;
      }
      onMapClick(e.latlng);
    }
  });
  return null;
}

export default ClickHandler;
