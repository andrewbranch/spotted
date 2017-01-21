/* @flow */

import article from 'indefinite-article';
const { abs } = Math;

export const cardinalDirection = (bearing: number, precision: 2 | 3): string => {
  const interval = { '2': 45, '3': 22.5 };
  const bearings = {
    '2': ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'],
    '3': ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N'],
  };

  for (let i = 0; i < bearings[precision].length; i++) {
    const t = interval[precision] * (i + 0.5);
    if (bearing < t) return bearings[precision][i];
  }

  throw new Error(`Bearing must be a number in degrees between 0 and 360.`);
};

export type Colloquialism = {
  number: number;
  string: string;
};

export const COLLOQUIALISMS: Colloquialism[] = [{
  number: 0.25,
  string: 'a quarter {unit}',
}, {
  number: 0.5,
  string: 'half {a} {unit}',
}, {
  number: 1,
  string: '{a} {unit}',
}];

const isClose = (a: number, b: number, threshold: number) => (
  abs(b - a) <= threshold * b
);

// Why try matching the rounded distance as well as the original?
// Say you called `colloquialDistance(0.501, 'mile', 'miles', 1, 0)`.
// While you expressed a threshold of 0, the distance delta is smaller
// than the smallest delta that can be expressed at the decimal
// precision you requested (1, i.e. round to the nearest 0.1).
// Therefore, if we didn’t try matching the rounded number, the result
//  of the above example would be “0.5 miles” which is semantically
// equivalent to the exactly-matching colloquialism “half a mile,”
// so there’s no reason not to return the matched colloquialism.
//
// However, we don’t want to miss anything by rounding that would
// otherwise have been a match, e.g. `0.25` to “a quarter mile” with
// a fixed precision of 1 and a threshold of 0.1 (10%). If we only
// checked the rounded number, it would be rounded to 0.3, which is
// not within 10% of 0.25. But of course, it would be ridiculous
// not to return any colloquialism which exactly matches.
//
// So, we give both the rounded number and the exact distance a
// chance to match.
export const colloquialDistance = (
  distance: number,
  unitSingular: string,
  unitPlural: string,
  fixed: number = 1,
  colloquialThreshold: number = 0.1,
  colloquialisms: Colloquialism[] = COLLOQUIALISMS
) => {
  const rounded = parseFloat(distance.toFixed(fixed));
  for (let i = 0; i < colloquialisms.length; i++) {
    const col = colloquialisms[i];
    if (
      isClose(distance, col.number, colloquialThreshold) ||
      isClose(rounded, col.number, colloquialThreshold)
    ) {
      return col.string.replace(/({a} )?{unit(s)?}/g, (_, a, s) => {
        const word = s ? unitPlural : unitSingular;
        return a ? `${article(word)} ${word}` : word;
      });
    }
  }

  return `${rounded} ${rounded === 1 ? unitSingular : unitPlural}`;
};
