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