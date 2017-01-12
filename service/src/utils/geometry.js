/* @flow */

import type { Coordinates } from '../types/coordinates';
const { PI, sin, cos, tan, atan2, floor } = Math;

const rad = (x: number) => x * PI / 180;
const deg = (x: number) => x * 180 / PI;
const radAbs = (x: number) => (
  x - floor(x / (2 * PI)) * 2 * PI
);

const greatCircleInitialCourse = (a: Coordinates, b: Coordinates) => {
  const s = sin(rad(b[1] - a[1])) * cos(rad(b[0]));
  const c = cos(rad(a[0])) * sin(rad(b[0])) - sin(rad(a[0])) * cos(rad(b[0])) * cos(rad(b[1] - a[1]));
  return radAbs(2 * PI - (atan2(s, c) - PI / 2));
};

export const bearing = (a: Coordinates, b: Coordinates, precision: 2 | 3) => {
  const d = deg(greatCircleInitialCourse(a, b));
  const interval = { '2': 45, '3': 22.5 };
  const headings = {
    '2': ['E', 'NE', 'N', 'NW', 'W', 'SW', 'S', 'SE', 'E'],
    '3': ['E', 'ENE', 'NE', 'NNE', 'N', 'NNW', 'NW', 'WNW', 'W', 'WSW', 'SW', 'SSW', 'S', 'SSE', 'SE', 'ESE', 'E'],
  };
  
  for (let i = 0; i < headings[precision].length; i++) {
    const t = interval[precision] * i + interval[precision] / 2;
    if (d < t) return headings[precision][i];
  }
}
