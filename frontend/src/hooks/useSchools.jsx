import { useState, useRef } from "react";
import { getSchools } from "../utils/getSchools";
import { getGPS } from "../utils/getGPS";
import { translate } from "../utils/translate";


export function useSchools() {
  const [schools, setSchools] = useState([]);
  const [schoolsLoading, setSchoolsLoading] = useState(false);
  const [schoolsError, setSchoolsError] = useState(null);
  const schoolsAbortRef = useRef(null);
  const [routeInfos, setRouteInfos] = useState([]);

  function restoreSchools(savedSchools, savedRouteInfos) {
    setSchools(savedSchools);
  setRouteInfos(
    Array.isArray(savedRouteInfos)
      ? savedRouteInfos
      : typeof savedRouteInfos === "string"
        ? JSON.parse(savedRouteInfos)
        : []
  );
  }

  async function handleFindSchools(params, address) {
    if (!params) { setSchools([]); setRouteInfos([]); return; }
    const { languages, schoolClass } = params;
    if (!address) return;
    if (!address.street || !address.housenumber) {
      setSchoolsError("Please select a valid house address first.");
      return;
    }
    if (schoolsAbortRef.current) schoolsAbortRef.current.abort();
    schoolsAbortRef.current = new AbortController();
    const signal = schoolsAbortRef.current.signal;

    setSchoolsError(null);
    setSchoolsLoading(true);

    const data = await getSchools(address.street, address.housenumber, languages, schoolClass);
    if (!data || data.error) {
      console.log('schoolsError', schoolsError);
      setSchoolsError(data?.error ?? "Something went wrong.");
      setSchoolsLoading(false);
      return;
    }

    const schoolsWithCoords = await Promise.all(
      data.map(async (school) => {
        const name = translate(school.institutionName);
        const coords = await getGPS(name);
        return coords && !coords.error ? { ...school, lat: coords.lat, lng: coords.lng } : null;
      })
    );

    if (signal.aborted) return;

    const validSchools = schoolsWithCoords.filter(Boolean);
    if (validSchools.length === 0) {
      setSchoolsError("Could not find locations for any schools.");
      setSchoolsLoading(false);
      return;
    }

    const duplicates = validSchools.filter(school =>
      schools.some(s => s.institutionName === school.institutionName)
    );

    const newSchools = validSchools.filter(school =>
      !schools.some(s => s.institutionName === school.institutionName)
    );
 
    if (duplicates.length > 0) {
      setSchoolsError(`${[...new Set(duplicates.map(s => s.institutionName))].join(', ')} already added`);
    }
 
    if (newSchools.length === 0) {
      setSchoolsLoading(false);
      return;
    }
 
    setSchools(prev => [...prev, ...newSchools]);

    setSchoolsLoading(false);
  }

  function handleRemoveSchool(i) {
    setSchools(prev => prev.filter((_, idx) => idx !== i));
    setRouteInfos(prev => prev.filter((_, idx) => idx !== i));
  }

  function handleClearSchools() {
    setSchools([]);
    setRouteInfos([]);
  }

  function clearSchools() {
    setSchools([]);
    setRouteInfos([]);
    setSchoolsError(null);
  }

  return {
    schools, schoolsLoading, schoolsError,
    routeInfos, setRouteInfos,
    handleFindSchools, handleRemoveSchool, handleClearSchools, clearSchools, restoreSchools,
  };
}
