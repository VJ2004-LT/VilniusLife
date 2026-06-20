import { useState } from "react";

const features = [
  {
    id: 1,
    title: "Radius Slider",
    icon: "🔵",
    short: "Adjust search radius",
    description:
      "Use the radius slider to set how far around the selected point you want to search, from 100m up to 3km. The blue circle on the map updates live as you drag.",
    overlayX: 9,
    overlayY: 17,
  },
  {
    id: 2,
    title: "Marker Toggle",
    icon: "📍",
    short: "Show / hide map markers",
    description:
      'Click on any button to toggle the picked marker on the map. Hover over any button to see the name of the marker. Clicking the most top left button will toggle every single TvarkauMiesta.lt marker. Useful when you want to filter out which markers you want to see on the map.',
    overlayX: 20,
    overlayY: 17,
  },
  {
    id: 3,
    title: "Marker Information Panel",
    icon: "📋",
    short: "View selected marker information",
    description:
      "Click any marker on the map to open the Report panel on the left. It shows all the relevant information about the selected marker. It may be closed by pressing the X at the top right of the panel. This is the panel in which the option to comment on Forum posts is.",
    overlayX: 9,
    overlayY: 58,
  },
  {
    id: 4,
    title: "Location Information Panel",
    icon: "🔍",
    short: "Noise & safety data",
    description:
      "Click anywhere on the map to pin a point and see its address, day/night car traffic noise, railway noise, airport noise, and a safety score. You can save, compare locations, find nearby schools, or write a post.",
    overlayX: 89,
    overlayY: 59,
  },
  {
    id: 5,
    title: "Saving locations",
    icon: "💾",
    short: "Save a location for later",
    description:
      "Pressing Save location will save the address, the schools information and anything else that is related to the location you are trying to save. A saved location will appear to the left of the information panel in the form of a numbered button. You can have up to 4 saved locations. Hovering over the saved location button will show the saved address. In this case, the user has 4 saved locations so the button displays Max saved locations. pressing on a saved location will make this button display Remove saved location.",
    overlayX: 89,
    overlayY: 42,
  },
  {
    id: 6,
    title: "Comparing saved locations",
    icon: "📊",
    short: "Compare your saved locations",
    description:
      "After pressing the button, a panel will apear in which you can compare your saved locations by noise level, distance to school and school route safety. ",
    overlayX: 89,
    overlayY: 47,
  },
  {
    id: 7,
    title: "Finding priority schools",
    icon: "🏫",
    short: "Find priority schools and how to get there from the selected location.",
    description:
      "Pressing Find priority schools will pop up a panel below in which you can select the language and the class of the schools you are looking for. It will then display the names, the route distance and the safety level of the routes below. It will also show the routes and the found schools on the map.",
    overlayX: 89,
    overlayY: 51,
  },
  {
    id: 8,
    title: "Writing a post",
    icon: "📝",
    short: "Write your thoughts about a selected location.",
    description:
      "Pressing this button will open up a form that you can fill in to display your thoughts about the selected location. The saved post will then appear on the map and in the forums page for others to see and to comment on.",
    overlayX: 89,
    overlayY: 56,
  },
  {
    id: 9,
    title: "Address search bar",
    icon: "🔎",
    short: "Find a location by using its address",
    description:
      "You can write an address in this search bar and it will take you to the location if found. The address does not have to be written in full. writing didlauk 47 will still find Didlaukio g. 47, Vilnius",
    overlayX: 89,
    overlayY: 12,
  },
  {
    id: 10,
    title: "Eldership view",
    icon: "🏛️",
    short: "View the borders of elderships",
    description:
      "Pressing the button will make elderships appear on the map. Hovering over them will show the name.", 
    overlayX: 4,
    overlayY: 97,
  },
  {
    id: 11,
    title: "Neighborhood forum page",
    icon: "💬",
    short: "Look, filter and rate trough all of the forum posts, and view their comments all in one place.",
    description:
      "Pressing Neighborhood forum will open a new page, in which you can look and filter trough all of the posts, view their comments, and even give them a like or dislike. ",
    overlayX: 16,
    overlayY: 5,
  },
];


function Home() {
  const [activeFeature, setActiveFeature] = useState(null);

  const handleFeatureClick = (feature) => {
    setActiveFeature(activeFeature?.id === feature.id ? null : feature);
  };

  return (
    <div className="flex flex-col flex-1 overflow-x-hidden h-full bg-white">
      <div className="flex flex-1 p-1 pr-0 gap-8">
        <div className="flex flex-col justify-start pt-2 shrink-0" style={{ width: "28vw", alignSelf: "flex-start" }}>
          <h1 className="text-5xl font-bold mb-2 ml-3 ">Welcome.</h1>
          <p className="text-sm leading-relaxed ml-4">
           VilniusLife tries to make the option of choosing where to live in Vilnius more easy and informed. This page explains all of the features of the website.
          </p>

          <div className="text-center py-2 mt-2">
            <span className="text-lg font-semibold">Features</span>
          </div>
          <div className="flex flex-col gap-2 ml-4 mr-2">
            {features.map((f) => {
              const isActive = activeFeature?.id === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => handleFeatureClick(f)}
                  className={`border rounded-lg p-1 text-left transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "border-red-500 bg-red-50 shadow-sm"
                      : "border-gray-400 bg-white hover:border-red-400 hover:bg-red-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{f.icon}</span>
                    <span
                      className={`font-semibold text-sm ${
                        isActive ? "text-red-700" : "text-black"
                      }`}
                    >
                      {f.title}
                    </span>
                  </div>
                  <p className="text-xs mt-1">{f.short}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4 min-w-0 p-3 relative">
          <div className="text-center text-xl font-semibold"></div>

          <div
            className="w-full rounded-lg shadow-sm relative mt-10"
            style={{ maxWidth: "66vw", position: "sticky", top: "32px" }}
          >
            <img
              src="/Map.png"
              alt="Vilnius Map"
              className="max-h-[66vh] max-w-[66vw] object-cover w-full"
            />

            {activeFeature && (
              <div
                className="absolute z-100 pointer-events-none"
                style={{
                  left: `${activeFeature.overlayX}%`,
                  top: `${activeFeature.overlayY}%`,
                  transform: "translate(-50%, 0)"
                }}
              >
                <div
                  className="w-3 h-3 rounded-full border-2 border-white mx-auto mb-1"
                  style={{ backgroundColor: "#c0392b" }}
                />
                <div
                  className="bg-white rounded-lg shadow-xl border border-gray-800 p-3 text-left"
                  style={{ width: "220px", pointerEvents: "none" }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">{activeFeature.icon}</span>
                    <span className="font-bold text-sm">
                      {activeFeature.title}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed">
                    {activeFeature.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
