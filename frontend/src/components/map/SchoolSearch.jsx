import { useState } from "react";

const LANGUAGES = [
  { code: 'LT', label: 'Lithuanian' },
  { code: 'PL', label: 'Polish' },
  { code: 'RU', label: 'Russian' },
  { code: 'BE', label: 'Belarusian' },
];

const CLASSES = Array.from({ length: 12 }, (_, i) => i + 1);

function SchoolSearch({ onClose, onSearch, schoolsLoading, schools }) {
  const [languages, setLanguages] = useState([]);
  const [schoolClass, setSchoolClass] = useState(1);

  return (
    <div className="mt-2 border-t pt-2">

      <div className="mb-2 flex items-center justify-between">
        <label className="font-bold block mb-1">(Radius does not affect school search) Languages </label>
        <button onClick={onClose} className="cursor-pointer">✕</button>
      </div>

     <div className="w-full border rounded p-0 max-h-40 overflow-y-auto">
       {LANGUAGES.map(l => (
         <label key={l.code} className="flex items-center gap-2 p-0.5 cursor-pointer hover:bg-gray-100">
           <input
             type="checkbox"
             checked={languages.includes(l.code)}
             onChange={e => setLanguages(prev =>
              e.target.checked ? [...prev, l.code] : prev.filter(x => x !== l.code)
             )}
           />
          {l.label}
          </label>
        ))}
      </div>

      <div className="mb-3">
        <label className="font-bold block mb-1">Class</label>
        <select
          value={schoolClass}
          onChange={e => setSchoolClass(Number(e.target.value))}
          className="w-full border rounded p-0.5"
        >
          {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <button
        onClick={() => onSearch({ languages, schoolClass })}
        disabled={schoolsLoading || schools.length >= 5}
        className="disabled:cursor-not-allowed w-full py-1 rounded bg-primary hover:bg-secondary text-white cursor-pointer"
      >
        {schoolsLoading ? 'Loading...' : schools.length >= 5 ? 'Max 5 schools reached' : 'Search'}
      </button>
    </div>
  );
}

export default SchoolSearch;
