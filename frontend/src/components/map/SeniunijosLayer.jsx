import { useEffect, useState } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import { SENIUNIJOS_COLORS, FILL_OPACITY, LINE_SATURATION, LINE_WIDTH } from '../../constants/mapSeniunijos';

function SeniunijosLayer({ visible }) {
  const [data, setData] = useState(null);
  const map = useMap();

  useEffect(() => {
    fetch('/VilniausSeniunijos.geojson')
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!visible || !data) return null;

  return (
    <GeoJSON
      data={data}
      style={(feature) => {
        const i = data.features.findIndex(f => f.properties.SENIUNIJA === feature.properties.SENIUNIJA);
        return {
          color: SENIUNIJOS_COLORS[i],
          weight: LINE_WIDTH,
          opacity: LINE_SATURATION,
          fillColor: SENIUNIJOS_COLORS[i],
          fillOpacity: FILL_OPACITY,
        };
      }}
      onEachFeature={(feature, layer) => {
        if (feature.properties?.SENIUNIJA) {
          layer.bindTooltip(feature.properties.SENIUNIJA, {
            sticky: true,
          });
        }
        layer.on('click', (e) => {
          map.fire('click', { latlng: e.latlng, layerPoint: e.layerPoint, containerPoint: e.containerPoint });
        });
      }}
    />
  );
}

export default SeniunijosLayer;
