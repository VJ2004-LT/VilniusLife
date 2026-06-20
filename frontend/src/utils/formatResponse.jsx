function midpoint(range) {
  if (!range) return null;
  const [min, max] = range.split('-').map(Number);
  return isNaN(max) ? range : Math.round((min + max) / 2);
}

export function formatAddress(address) {
  if (!address || address.error) return null;
  const road = [address?.street, address?.housenumber].filter(Boolean).join(' ') || null;
  const parts = [
    address?.name !== road ? address?.name : null,
    road,
    address?.city,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : null;
}

export function formatNoise(noise) {
  if (!noise) return null;
  const parts = [
    noise.dayCarNoiseLevel && `Day car traffic: ${midpoint(noise.dayCarNoiseLevel)} dB`,
    noise.nightCarNoiseLevel && `Night car traffic: ${midpoint(noise.nightCarNoiseLevel)} dB`,
    noise.railwayNoiseLevel && `Railway: ${midpoint(noise.railwayNoiseLevel)} dB`,
    noise.airportNoiseLevel && `Airport: ${midpoint(noise.airportNoiseLevel)} dB`,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(',\n') : null;
}
