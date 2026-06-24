import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Circle} from "react-leaflet";
import L from 'leaflet';
import "leaflet/dist/leaflet.css"
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'react-leaflet-markercluster/styles';
import { MIN_ZOOM, MAX_ZOOM, VILNIUS_BOUNDS, MAP_CENTER, MAP_ZOOM, DEFAULT_RADIUS, TILE_URL, CLICK_DEBOUNCE } from "../constants/mapConfig";

import { getAddress } from "../utils/getAddress";
import { getNoise } from "../utils/getNoise";
import { getSafety } from "../utils/getSafety";

import RadiusControl from "../components/map/RadiusControl";
import ClickHandler from "../components/map/ClickHandler";
import PointPanel from "../components/map/PointPanel";
import LocationInfo from "../components/map/LocationInfo";
import ZoomTracker from "../components/map/ZoomTracker";
import CategoryToggle from "../components/map/CategoryToggle";
import LayerToggle from "../components/map/LayerToggle";
import AddressBar from "../components/map/AddressBar";
import MapFocus from "../components/map/MapFocus";
import RouteLayer from "../components/map/RouteLayer";
import SeniunijosLayer from "../components/map/SeniunijosLayer";


import { useProblemMarkers, useForumPostMarkers, useSchoolMarkers } from "../hooks/useMarker";
import { useMapData } from "../hooks/useMapData";
import { useSchools } from "../hooks/useSchools";

function Map() {

  const [selected, setSelected] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [address, setAddress] = useState(null);
  const [focusPosition, setFocusPosition] = useState(null);
  const skipAddressRef = useRef(false);
  const addressKeyRef = useRef(0);
  const noiseKeyRef = useRef(0);
  const skipNoiseRef = useRef(false);
  const [searchParams] = useSearchParams();
  const [focusZoom, setFocusZoom] = useState(null);

  const [selectedRoute, setSelectedRoute] = useState(null);
  const [noiseLevel, setNoiseLevel] = useState(null);
  const [safetyLevel, setSafetyLevel] = useState(null);
  const [safetyLoading, setSafetyLoading] = useState(false);
  const [radius, setRadius] = useState(DEFAULT_RADIUS);
  const [localRadius, setLocalRadius] = useState(DEFAULT_RADIUS);
  const [zoom, setZoom] = useState(MAP_ZOOM);
  const [visibleCategories, setVisibleCategories] = useState(
                                                      ['allReports', 'forumPosts','violationReports',
                                                       'trafficReports','animalReports','enviromentalRepairs',
                                                       'pavementRepairs','lightingRepairs','buildingReports',
                                                       'seasonalReports']
                                                    );

  const [showSeniunijos, setShowSeniunijos] = useState(false);

  const [noiseLoading, setNoiseLoading] = useState(false);

  const { problems, problemsLoading, problemsError, forumPosts, forumPostsLoading, forumPostsError, refreshForumPosts } = useMapData();
  const {
    schools, schoolsLoading, schoolsError,
    routeInfos, setRouteInfos, clearSchoolsError,
    handleFindSchools, handleRemoveSchool, handleClearSchools, clearSchools,
    restoreSchools
  } = useSchools();

  const problemMarkers = useProblemMarkers({ selected, problems, radius, visibleCategories, zoom, setSelectedPoint });
  const forumPostMarkers = useForumPostMarkers({ selected, forumPosts, radius, visibleCategories, zoom, setSelectedPoint });
  const schoolMarkers = useSchoolMarkers({ schools, zoom, setSelectedPoint });

  async function handleMapClick(latlng) {
    setAddress(null);
    setNoiseLevel(null);
    setNoiseLoading(true);
    setSelected(latlng);
    setSelectedPoint(null);
    setSelectedRoute(null);
    clearSchools();
  }

  useEffect(() => {
    if (!selected) return;
    setSafetyLevel(null);
    setSafetyLoading(true);
    getSafety(selected.lat, selected.lng, radius).then(level => {
      setSafetyLevel(level);
      setSafetyLoading(false);
    });
  }, [selected, radius]);

  useEffect(() => {
    if (!forumPosts || forumPosts.length === 0) return;
    const postId = Number(searchParams.get("postId"));
    if (!postId) return;
    const post = forumPosts.find(p => p.id === postId);
    if (post) { 
      const latlng = L.latLng(post.coordsLat, post.coordsLng);
      setSelected(latlng);
      setSelectedPoint({ ...post, category: "forumPosts" });
      setFocusPosition(L.latLng(post.coordsLat, post.coordsLng));
      setFocusZoom(17);
    }

  }, [forumPosts]);

  useEffect(() => {
    if (!selected) return;
    if (skipAddressRef.current) {
      skipAddressRef.current = false;
      return;
    }

    const key = ++addressKeyRef.current;
    const timer = setTimeout(async () => {
      const addr = await getAddress(selected.lat, selected.lng);
      if (key === addressKeyRef.current) setAddress(addr);
    }, CLICK_DEBOUNCE);
    return () => clearTimeout(timer);
  }, [selected]);

function toggleCategory(category) {
  if (category === 'allReports') {
    const reportCategories = ['violationReports', 'trafficReports', 'animalReports', 'enviromentalRepairs', 'pavementRepairs', 'lightingRepairs', 'buildingReports', 'seasonalReports'];
    const allVisible = reportCategories.every(c => visibleCategories.includes(c));
    setVisibleCategories(prev =>
      allVisible
        ? prev.filter(c => !reportCategories.includes(c))
        : [...new Set([...prev, ...reportCategories])]
    );
  } else {
    setVisibleCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  }
}

  useEffect(() => {
    if (!selected) return;
    if (skipNoiseRef.current) {
      skipNoiseRef.current = false;
      return;
    }
    const key = ++noiseKeyRef.current;
    const timer = setTimeout(async () => {
      const noise = await getNoise(selected.lat, selected.lng);
      if (key === noiseKeyRef.current) {
        setNoiseLevel(noise);
        setNoiseLoading(false);
      }
    }, CLICK_DEBOUNCE);
    return () => clearTimeout(timer);
  }, [selected]);

  function handleLocationFound(latlng, address) {
    if (!address) {
      setAddress(null);
      setSelected(null);
      return;
    }
    skipAddressRef.current = true;
    handleMapClick(L.latLng(latlng.lat, latlng.lng));
    setAddress(address);
    setFocusPosition(L.latLng(latlng.lat, latlng.lng));
  }
 
  console.log("schools:", schools);
  console.log("routeInfos:", routeInfos);

  return (
    <div className="relative h-full max-h-screen overflow-hidden">

      <LocationInfo
        selected={selected}
        noiseLevel={noiseLevel}
        noiseLoading={noiseLoading}
        safetyLevel={safetyLevel}
        safetyLoading={safetyLoading}
        address={address}
        onFindSchools={(params) => handleFindSchools(params, address)}
        schoolsError={schoolsError}
        onClearSchoolsError={clearSchoolsError}
        schoolsLoading={schoolsLoading}
        onForumPostCreated={refreshForumPosts}
        schools={schools}
        routeInfos={routeInfos}
        onClearSchools={handleClearSchools}
        onRemoveSchool={handleRemoveSchool}
        onSelect={(i, j) => setSelectedRoute({ school: i, route: j })}
        onClearSelectedRoute={() => setSelectedRoute(null)}
        onFocus={(latlng) => {
          skipNoiseRef.current = true;
          setNoiseLoading(false);
          setNoiseLevel(latlng.noiseLevel);
          skipAddressRef.current = true;
          addressKeyRef.current++;
          if (latlng.address) setAddress(latlng.address);
          setSelected(L.latLng(latlng.lat, latlng.lng));
          setFocusPosition(L.latLng(latlng.lat, latlng.lng));
          setSafetyLevel(latlng.safetyLevel)
          setSelectedPoint(null);
          setSelectedRoute(null);
          if (latlng.schools?.length > 0) {
            restoreSchools(latlng.schools, latlng.routeInfos);
          } else {
            clearSchools();
          }
        }}
      />

      <CategoryToggle
        visibleCategories={visibleCategories}
        onToggle={toggleCategory}
        loadingCategories={[
          ...(problemsLoading ? [
            'allReports',
            'violationReports',
            'trafficReports',
            'animalReports',
            'enviromentalRepairs',
            'pavementRepairs',
            'lightingRepairs',
            'buildingReports',
            'seasonalReports',
          ] : []),
          ...(forumPostsLoading ? ['forumPosts'] : []),
        ]}
        errorCategories={[
          ...(problemsError ? [
            'allReports',
            'violationReports',
            'trafficReports',
            'animalReports',
            'enviromentalRepairs',
            'pavementRepairs',
            'lightingRepairs',
            'buildingReports',
            'seasonalReports',
          ] : []),
          ...(forumPostsError ? ['forumPosts'] : []),
        ]}
      />
      <PointPanel
        point={selectedPoint}
        onClose={() => setSelectedPoint(null)}
      />
      <AddressBar
        selected={selected}
        onLocationFound={handleLocationFound}
      />
      <LayerToggle
        label="Elderships"
        visible={showSeniunijos}
        onToggle={() => setShowSeniunijos(prev => !prev)}
      />
      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        maxBounds={VILNIUS_BOUNDS}
        maxBoundsViscosity={0.9}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url={TILE_URL}/>
        <ZoomTracker onZoomChange={setZoom}/>
        <MapFocus position={focusPosition} zoom={focusZoom} />
        <RadiusControl radius={radius} onChange={setRadius} onLocalChange={setLocalRadius} />
        <ClickHandler onMapClick={handleMapClick} />

        {selected && (
          <>
            <Marker position={selected}>
              <Popup>Selected point</Popup>
            </Marker>
            <Circle
              center={selected}
              radius={localRadius}
              pathOptions={{ color: "blue", fillOpacity: 0.1 }}
              interactive={false}
            />
          </>
        )}

        <MarkerClusterGroup spiderfyOnMaxZoom={true}>
          {problemMarkers}
          {forumPostMarkers}
        </MarkerClusterGroup>

        {selected && schools.map((school, i) => (
          <RouteLayer
            key={i}
            origin={selected}
            routeIndex={i}
            selectedRoute={selectedRoute}
            onSelect={(schoolIdx, routeIdx) => setSelectedRoute({ school: schoolIdx, route: routeIdx })}
            destination={{ lat: school.lat, lng: school.lng }}
            existingRoutes={routeInfos?.[i] ?? null}
            onRouteInfo={(info) => setRouteInfos(prev => {
              const next = [...prev];
              next[i] = info;
              return next;
            })}
          />
        ))}

        {schoolMarkers}

        <SeniunijosLayer visible={showSeniunijos}/> 

      </MapContainer>
    </div>
  );
}

export default Map;
