/* @flow */

import type { Coordinates } from '../types/coordinates';
const { PI, sin, cos, tan, atan2, floor } = Math;

const rad = (x: number) => x * PI / 180;
const deg = (x: number) => x * 180 / PI;
const radAbs = (x: number) => (
  x - floor(x / (2 * PI)) * 2 * PI
);

// Bearing is in degrees E of N
const greatCircleInitialCourse = (a: Coordinates, b: Coordinates) => (
  deg(radAbs(atan2(
    sin(rad(b[1] - a[1])) * cos(rad(b[0])),
    cos(rad(a[0])) * sin(rad(b[0])) - sin(rad(a[0])) * cos(rad(b[0])) * cos(rad(b[1] - a[1]))
  )))
);

export const bearing = (a: Coordinates, b: Coordinates, precision: 2 | 3) => {
  const d = greatCircleInitialCourse(a, b);
  const interval = { '2': 45, '3': 22.5 };
  const headings = {
    '2': ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'],
    '3': ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N'],
  };
  
  for (let i = 0; i < headings[precision].length; i++) {
    const t = interval[precision] * i + interval[precision] / 2;
    if (d < t) return headings[precision][i];
  }
}
