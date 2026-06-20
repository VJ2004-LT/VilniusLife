import { useState, useEffect } from "react";
import SchoolSearch from "./SchoolSearch";
import SchoolList from "./SchoolList";
import ForumPost from "./ForumPost";
import LocationComparison from "./LocationComparison";
import { getSavedLocations, saveLocation, deleteSavedLocation } from "../../utils/savedLocations";
import SavedLocations from "./SavedLocations";
import { formatAddress, formatNoise } from '../../utils/formatResponse';
import { useAuth } from '../../context/AuthContext';

function LocationInfo({ selected, noiseLevel, noiseLoading, safetyLevel, safetyLoading, address, onFindSchools,
                        schoolsError, schoolsLoading, routeInfos, schools, onClearSchools,
                        onRemoveSchool, onSelect, onClearSelectedRoute, onFocus, onForumPostCreated
                     }) 
{

  const [showSafetyInfo, setShowSafetyInfo] = useState(false);
  const [showSchoolSearch, setShowSchoolSearch] = useState(false);
  const [showForumPost, setShowForumPost] = useState(false);
  const [showLocationComparison, setShowLocationComparison] = useState(false);
  const [postError, setPostError] = useState(false);
  const [locationComparisonError, setLocationComparisonError] = useState(false);
  const [locationSaved, setLocationSaved] = useState(false)
  const [savedId, setSavedId] = useState(null);
  const [savedCount, setSavedCount] = useState(0);
  const [savedLocations, setSavedLocations] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    setPostError(null);
    setLocationComparisonError(null);
  }, [address]);

  useEffect(() => {
    getSavedLocations().then(locations => {
      setSavedLocations(locations);
      setSavedCount(locations.length);
      if (!selected) return;
    const existing = locations.find(l =>
      Math.abs(l.coordsLat - selected.lat) < 1e-9 &&
      Math.abs(l.coordsLng - selected.lng) < 1e-9
    );
    if (existing) {
      setLocationSaved(true);
      setSavedId(existing.locationId);
      } else {
        setLocationSaved(false);
        setSavedId(null);
      }
    });
  }, [selected, locationSaved]);

  if (!selected) return (
    <SavedLocations
      locations={savedLocations}
      onRemove={() => setLocationSaved(false)}
      onFocus={onFocus}
      shiftRight={!selected}
    />
  );

  const formattedAddress = formatAddress(address);

  async function handleSaveLocation() {
    if (!user) {
      setPostError('You must be logged in to save a location.');
      return;
    }

      if (savedId) {
        await deleteSavedLocation(savedId);
        setSavedId(null);
        setLocationSaved(false);
      } else {
        const result = await saveLocation(selected.lat, selected.lng, 'point', noiseLevel, safetyLevel, address, schools, routeInfos);
        if (result) {
          setSavedId(result.locationId);
          setLocationSaved(true);
        }
      }
    }

  return (

    <>

      <div className="panel absolute top-13 right-4 text-sm w-80 p-3 max-h-[80vh] overflow-y-auto" onClick={onClearSelectedRoute}>
        <p className="font-bold text-center">Selected point</p>
        <p><span className="font-bold">Lat:</span> {selected.lat.toFixed(5)}</p>
        <p><span className="font-bold">Lng:</span> {selected.lng.toFixed(5)}</p>
        <p><span className="font-bold">Location:</span> {address === null ? 'Loading...' : formattedAddress ?? 'Address unavailable'}</p>
        <p><span className="font-bold">Noise level:</span>{' '}
          <span className="whitespace-pre-line">
            {noiseLoading ? 'Loading...' : formatNoise(noiseLevel) ?? 'Unavailable'}
          </span>
        </p>
        <p>
          <span className="font-bold">Safety level:</span> {safetyLoading ? 'Loading...' : safetyLevel ?? 'Unavailable'}
          <button
            onClick={() => setShowSafetyInfo(!showSafetyInfo)}
          >
            ℹ️
          </button>
        </p>

        {showSafetyInfo && (
          <p className="text-xs">
            Safety level is calculated based on reported traffic incidents in the area. 100 means no incidents recorded.
            A large radius may give less useful information.
          </p>
        )}

        {address !== null && !address.error && (
          <button
            onClick={() => {
              if (locationSaved) {
                if (window.confirm('Are you sure you want to remove this location?')) {
                  handleSaveLocation();
                }
              } else {
                handleSaveLocation();
              }
            }}
            disabled={noiseLoading || (savedCount === 4 && !locationSaved) || address === null}
            className={`cursor-pointer mt-2 w-full py-1 rounded text-white text-xs ${
              locationSaved
                ? 'bg-red-500 hover:bg-red-400'
                : 'bg-primary hover:bg-secondary'
            } disabled:cursor-not-allowed`}
          >
            <span>
              {locationSaved ? 'Remove location' : savedCount === 4 ? 'Max saved locations' : 'Save location'}
            </span>
          </button>
        )}

        {(showLocationComparison || savedCount !== 0 && address !== null) && (
          <button
            onClick={() => {
              if (savedCount < 2) {
                setLocationComparisonError("Save at least 2 locations to compare.");
                return;
              }
              setLocationComparisonError(null);
              setShowLocationComparison(true)
            }}
            className="cursor-pointer mt-2 w-full py-1 rounded bg-primary text-white text-xs hover:bg-secondary"
          >
            Compare saved locations
          </button>
        )}

        {showSchoolSearch || address !== null && (
          <button
            onClick={() => setShowSchoolSearch(true)}
            className="cursor-pointer mt-2 w-full py-1 rounded bg-primary text-white text-xs hover:bg-secondary"
          >
            Find priority schools
          </button>
        )}

        {showForumPost || address !== null && (
          <button
            onClick={() => {
              if (!address?.housenumber) {
                setPostError("Please select a house address with a street and a house number..");
                return;
              }
              setPostError(null);
              setShowForumPost(true)
            }}
            className="cursor-pointer mt-2 w-full py-1 rounded bg-primary text-white text-xs hover:bg-secondary"
          >
            Write a post
          </button>
        )}

        {(postError || schoolsError || locationComparisonError ) && (
          <p className="text-red-400 text-xs mt-1">{postError || schoolsError || locationComparisonError}</p>
        )}

        {showSchoolSearch && (
          <SchoolSearch
            onClose={() => setShowSchoolSearch(false)}
            schoolsLoading={schoolsLoading}
            schools={schools}
            onSearch={(params) => {
              onFindSchools(params);
            }}
          />
        )}

        {schools.length > 0 && (
          <SchoolList
            schools={schools}
            routeInfos={routeInfos}
            onClearSchools={onClearSchools}
            onRemoveSchool={onRemoveSchool}
            onSelect={onSelect}
          />
        )}
      </div>

      <SavedLocations
        locations={savedLocations}
        onRemove={() => setLocationSaved(false)}
        onFocus={onFocus}
        shiftRight={false}
      />

      {showForumPost && (
        <ForumPost 
          onClose={(success) => {
            setShowForumPost(false);
            if (success) onForumPostCreated();
          }}
          coordsLat={selected.lat}
          coordsLng={selected.lng}
        />
      )}

      {showLocationComparison && (
        <LocationComparison
          onClose={() => setShowLocationComparison(false)}
        />
      )}

  </>

  );
}

export default LocationInfo;
