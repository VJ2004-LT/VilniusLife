import { useState, useRef, useEffect } from "react";
import { getGPS } from "../../utils/getGPS";
import { CLICK_DEBOUNCE } from "../../constants/mapConfig";
import { translate } from "../../utils/translate";

function AddressBar({ onLocationFound, selected }) {
  const [query, setQuery] = useState('');
  const debounceRef = useRef(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [translatedQuery, setTranslatedQuery] = useState(null)

  useEffect(() => {
  if (selected) setNotFound(false);
  }, [selected]);

  function handleSearch() {
    if (!query.trim()) return;
    setNotFound(false);
    setLoading(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const translated = translate(query);
      setTranslatedQuery(translated);
      const result = await getGPS(translated);
      setLoading(false);
      if (result) { 
        setNotFound(false);
        onLocationFound({ lat: result.lat, lng: result.lng }, result);
      } else {
        setNotFound(true);
        onLocationFound(null, null);
      }
    }, CLICK_DEBOUNCE);
  }

  return (
    <div className="panel absolute top-2 right-4 text-sm w-80 p-1">
      <input
        type="text"
        className="w-full border rounded p-1"
        placeholder="Search address..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      {loading && <p className="text-xs">Loading...</p>}
      {notFound && <p className="text-red-400 text-xs">No results found</p>}
    </div>
  );
}

export default AddressBar;
