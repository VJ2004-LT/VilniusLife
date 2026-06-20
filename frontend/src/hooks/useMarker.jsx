import { useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import { getMapIcon } from "../utils/getMapIcon";
import { getProblemCategory } from '../utils/getProblemCategory';

export function useProblemMarkers({ selected, problems, radius, visibleCategories, zoom, setSelectedPoint }) {
  return useMemo(() => (
    selected && problems
      .filter(problem => selected.distanceTo([problem.coordsLat, problem.coordsLng]) <= radius)
      .filter(problem => visibleCategories.includes(getProblemCategory(problem.problemTypeString)))
      .map((problem) => (
        <Marker
          key={problem.problemId}
          position={[problem.coordsLat, problem.coordsLng]}
          icon={getMapIcon(getProblemCategory(problem.problemTypeString), zoom) ?? undefined}
          eventHandlers={{ click: () => setSelectedPoint({ ...problem, category: "problem" }) }}
        />
      ))
  ), [selected, problems, radius, visibleCategories, zoom]);
}

export function useForumPostMarkers({ selected, forumPosts, radius, visibleCategories, zoom, setSelectedPoint }) {
  return useMemo(() => (
    selected && forumPosts
      .filter(post => selected.distanceTo([post.coordsLat, post.coordsLng]) <= radius)
      .filter(post => visibleCategories.includes("forumPosts"))
      .map((post) => (
        <Marker
          key={post.id}
          position={[post.coordsLat, post.coordsLng]}
          icon={getMapIcon("forumPosts", zoom) ?? undefined}
          eventHandlers={{ click: () => setSelectedPoint({ ...post, category: "forumPosts" }) }}
        />
      ))
  ), [selected, forumPosts, radius, visibleCategories, zoom]);
}

export function useSchoolMarkers({ schools, zoom, setSelectedPoint }) {
  return useMemo(() => (
    schools.map((school, i) => (
      <Marker
        key={i}
        position={[school.lat, school.lng]}
        icon={getMapIcon("school", zoom) ?? undefined}
        eventHandlers={{ click: () => setSelectedPoint({ ...school, category: "school" }) }}
      >
        <Popup>{school.institutionName}</Popup>
      </Marker>
    ))
  ), [schools, zoom]);
}
