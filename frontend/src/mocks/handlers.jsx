import { http, HttpResponse } from 'msw'

const STORAGE_KEY = 'saved_locations';
const BACKEND_URL = import.meta.env.VITE_API_URL;

function getLocations() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
}

function saveLocations(locations) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(locations))
}

export const handlers = [
  http.get(`${BACKEND_URL}/savedLocations`, () => {
    return HttpResponse.json(getLocations())
  }),

  http.post(`${BACKEND_URL}/saveLocation`, async ({ request }) => {
    const body = await request.json()
    const locations = getLocations()
    if (locations.length >= 4) {
      return HttpResponse.json({ error: 'Max 4 locations' }, { status: 400 })
    }
    const newLocation = {
      locationId: Date.now(),
      coordsLat: body.lat,
      coordsLng: body.lng,
      riskScore: body.riskScore,
      avgNoiseLevel: body.avgNoiseLevel,
      address: body.address,
      schools: body.schools ?? [],
      routeInfos : body.routeInfos ?? [],
    }
    saveLocations([...locations, newLocation])
    return HttpResponse.json(newLocation, { status: 201 })
  }),

  http.delete(`${BACKEND_URL}/savedLocations/:id`, ({ params }) => {
    const locations = getLocations()
    saveLocations(locations.filter(l => l.locationId !== Number(params.id)))
    return HttpResponse.json({ success: true })
  }),
]
