import { useEffect, useState, Fragment } from "react";
import { Polyline } from "react-leaflet";
import { ROUTE_COLORS } from "../../constants/mapRouteColors";
import { getRouteSafety } from "../../utils/getRouteSafety";

async function fetchRoutes(origin, destination, signal) {
  const coords = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson&alternatives=3&steps=true`;
  const res = await fetch(url, { signal });
  const json = await res.json();
  if (!json.routes || json.routes.length === 0) throw new Error("No routes found");

  const routes = json.routes.slice(0, 3);

  return await Promise.all(routes.map(async (route) => ({
    positions: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
    duration: route.duration,
    distance: route.distance,
    safety: await getRouteSafety(route),
  })));
}

export default function RouteLayer({ origin, destination, onRouteInfo, routeIndex = 0, selectedRoute, onSelect, existingRoutes }) {

  if (typeof existingRoutes === "string") {
    try {
      existingRoutes = JSON.parse(existingRoutes);
    } catch {
      existingRoutes = [];
    }
  }

  const [routes, setRoutes] = useState(
    existingRoutes?.[0]?.positions ? existingRoutes : []
  );

  useEffect(() => {
    setRoutes([]);
    if (!origin || !destination) { setRoutes([]); return; }
    if (existingRoutes?.[0]?.positions) {
      setRoutes(existingRoutes);
      onRouteInfo?.(existingRoutes.map(r => ({ duration: r.duration, distance: r.distance, positions: r.positions, safety: r.safety })));
      return;
    }
    const controller = new AbortController();
    fetchRoutes(origin, destination, controller.signal)
      .then((routes) => {
        setRoutes(routes);
        onRouteInfo?.(routes.map(r => ({ duration: r.duration, distance: r.distance, positions: r.positions, safety: r.safety })));
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        onRouteInfo?.([{ duration: null, distance: null, safety: null, error: true }]);
      });
    return () => controller.abort();
  }, [origin?.lat, origin?.lng, destination?.lat, destination?.lng, existingRoutes?.length]);

  if (routes.length === 0) return null;

  const routeColor = ROUTE_COLORS[routeIndex % ROUTE_COLORS.length];

  return (
    <>
      {routes.map((route, j) => {
        const isSelected = selectedRoute === null ||
          (selectedRoute.school === routeIndex && selectedRoute.route === j);
        return (
          <Fragment key={j}>
            <Polyline
              key={`transparent-${j}`}
              positions={route.positions}
              pathOptions={{ color: "transparent", weight: 20 }}
              eventHandlers={{
                click: (e) => {
                  e.originalEvent.stopPropagation();
                  onSelect?.(routeIndex, j);
                },
              }}
            />
            <Polyline
              key={`route-${j}`}
              positions={route.positions}
              pathOptions={{
                color: routeColor,
                weight: isSelected ? 8 : 5,
                opacity: isSelected ? 1 : 0.45,
                dashArray: j === 0 ? undefined : '6 8',
              }}
              eventHandlers={{
                click: (e) => {
                  e.originalEvent.stopPropagation();
                  onSelect?.(routeIndex, j);
                },
              }}
            />
          </Fragment>
        );
      })}
    </>
  );
}
