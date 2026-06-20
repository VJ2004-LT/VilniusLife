import { ROUTE_COLORS } from "../../constants/mapRouteColors";

function SchoolList({ schools, routeInfos, onClearSchools, onRemoveSchool, onSelect }) {
  if (!schools.length) return null;
  return (
    <div className="mt-2 border-t pt-2">
      <div className="flex justify-between items-center mb-2">
        <p className="font-bold text-xs">Schools 🚗</p>
        <button onClick={onClearSchools} className="text-xs text-black/80 hover:text-black cursor-pointer">Clear all</button>
      </div>
      {schools.map((school, i) => {
        const routes = routeInfos[i];
        return (
          <div key={i} className="mb-2 border-b pb-1">
            <div className="flex justify-between items-center text-xs">
              <span>
                <span style={{ color: ROUTE_COLORS[i % ROUTE_COLORS.length] }}>● </span>
                {school.institutionName.replace(/["""„]/g, '')}
              </span>
              <button onClick={() => onRemoveSchool(i)} className="cursor-pointer ml-2 shrink-0">X</button>
            </div>
            <div className="mt-1 ml-3">
              {!routes ? (
                <p className="text-xs text-gray-400">Loading routes...</p>
              ) : routes.map((route, j) => (
                <div key={j} className="flex justify-between text-xs text-gray-600 cursor-pointer hover:text-black"
                  onClick={(e) => { e.stopPropagation(); onSelect?.(i, j); }}
                >
                  <span>Route {j + 1}</span>
                  <span className="flex gap-2">
                    {route.error ? 'unavailable' : (
                      <>
                        {route.safety != null && (
                          <span className={
                            route.safety >= 80 ? 'text-green-700' :
                            route.safety >= 50 ? 'text-yellow-700' :
                            'text-red-700'
                          }>
                            Route safety: {route.safety}/100
                          </span>
                        )}
                        <span>{Math.round(route.duration / 60)} min · {(route.distance / 1000).toFixed(1)} km</span>
                      </>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SchoolList;
