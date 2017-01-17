/* @flow */

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
  string: 'half a {unit}',
}, {
  number: 1,
  string: 'a {unit}',
}];

export const colloquialDistance = (
  distance: number,
  unitSingular: string,
  unitPlural: string,
  fixed: number = 1,
  colloquialThreshold: number = 0.1,
  colloquialisms: Colloquialism[] = COLLOQUIALISMS
) => {
  for (let i = 0; i < colloquialisms.length; i++) {
    const colloquialism = colloquialisms[i];
    if (abs(distance - colloquialism.number) <= colloquialThreshold * distance) {
      return colloquialism.string.replace(/{unit(s)?}/g, (_, s) => (
        s ? unitPlural : unitSingular)
      );
    }
  }

  return `${distance.toFixed(fixed)} ${unitPlural}`;
};
