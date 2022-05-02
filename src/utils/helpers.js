/**
 * Convert rotaion period (in days) to radians per second
 * @param { Number } rotation_period
 * @returns { Number } radiansPerSecond
 */
export function convertRotationPerDayToRadians(rotation_period) {
  const minutesInDay = 24 * 60
  const fullRevolutionInMinutes = rotation_period * minutesInDay
  const degreesPerMinute = 1 * 360 / fullRevolutionInMinutes
  const radiansPerMinute = degreesPerMinute * (2 * Math.PI)
  const radiansPerSecond = radiansPerMinute / 60;
  return radiansPerSecond
}

/**
 * Formula adjusted by texture map wrapping offset
 * the x-axis goes through long,lat (0,0), so longitude 0 meets the equator;
 * the y-axis goes through (0,90);
 * and the z-axis goes through the poles.
 *   x = R * cos(lat) * cos(lon)
 *   y = R * cos(lat) * sin(lon)
 *   z = R *sin(lat)
 * @param {*} lat
 * @param {*} lng
 * @returns
 */
export function calcPosFromLatLngRad(lat, lng, radius) {

  // divide angle by 180deg and multiplay by Math.PI to get radians
  const phi = (90-lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -((radius) * Math.sin(phi) * Math.cos(theta));
  const y = ((radius) * Math.sin(phi) * Math.sin(theta));
  const z = ((radius) * Math.cos(phi));

  return { x, y, z };
}