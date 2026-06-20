import L from 'leaflet';
import { MAP_ICONS } from '../constants/mapIcons';
import { MAP_ZOOM, BASE_ICON_SIZE, MIN_ICON_SIZE, ICON_GROWTH_SPEED } from '../constants/mapConfig';

const makeIcon = (emoji, zoom = MAP_ZOOM) => {
  const size = Math.max(MIN_ICON_SIZE, BASE_ICON_SIZE + (zoom - MAP_ZOOM) * ICON_GROWTH_SPEED);

  return L.divIcon({
    html: `<div style="font-size: ${size}px; line-height: 1;">${emoji}</div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [size * 0.2, -size],
  });
};

export function getMapIcon(category, zoom = MAP_ZOOM) {
  const emoji = MAP_ICONS[category];
  return emoji ? makeIcon(emoji, zoom) : null;
}
