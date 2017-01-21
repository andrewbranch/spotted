/* @flow */

import type { Coordinates } from '../types/coordinates';
const R_EARTH_MI = 3959;
const { PI, sin, cos, tan, atan2, acos, floor, abs } = Math;

const rad = (x: number) => x * PI / 180;
const deg = (x: number) => x * 180 / PI;
const radAbs = (x: number) => (x + 2 * PI) % (2 * PI);

// Bearing is in degrees E of N
export const greatCircleInitialCourse = (a: Coordinates, b: Coordinates) => (
  deg(radAbs(atan2(
    sin(rad(b[1] - a[1])) * cos(rad(b[0])),
    cos(rad(a[0])) * sin(rad(b[0])) - sin(rad(a[0])) * cos(rad(b[0])) * cos(rad(b[1] - a[1]))
  )))
);

export const distance = (a: Coordinates, b: Coordinates) => (
  R_EARTH_MI * acos(
    sin(rad(a[0])) * sin(rad(b[0])) +
    cos(rad(a[0])) * cos(rad(b[0])) * cos(rad(abs(b[1] - a[1])))
  )
);
