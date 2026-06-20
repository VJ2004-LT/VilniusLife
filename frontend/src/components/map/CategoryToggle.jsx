import { MAP_ICONS } from '../../constants/mapIcons';

export default function CategoryToggle({ visibleCategories, onToggle, loadingCategories = [], errorCategories = [] }) {
  return (
    <div className="absolute top-2 left-55 z-[1000]">
      <div className="grid grid-rows-2 grid-flow-col">
        {Object.entries(MAP_ICONS).filter(([category]) => category !== "school").map(([category, emoji]) => (
          <button
            key={category}
            disabled={errorCategories.includes(category)}
            onClick={() => onToggle(category)}
            title={
              loadingCategories.includes(category) ? 'Loading...' :
              errorCategories.includes(category) ? `Failed to load ${category} or no data available` :
              category
            }
            className={` w-8 h-8 rounded items-center text-xl leaflet-bar
            ${errorCategories.includes(category)
              ? 'bg-red-200'
              : visibleCategories.includes(category)
                ? 'bg-white'
                : 'bg-gray-300'
            }`}
          >
            {loadingCategories.includes(category) ? (
              <span className="inline-block animate-[spin_3s_linear_infinite]">⏳</span>
            ) : errorCategories.includes(category) ? (
              <span className=" ">😔</span>
            ) : (
              emoji
            )}
          </button>
        ))}
      </div>
      <div className="leaflet-bar bg-white px-2 py-[3px] -mt-0.5 text-xs font-semibold">
        Toggle markers on/off
      </div>
    </div>
  );
}
