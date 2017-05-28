/* @flow */

import type { Model } from '../types/mongoose';
import type { PopulatedRule } from '../models/rule';
import type { Recipient } from '../models/recipient';
import type { SpotData } from '../types/spotData';
import moment from 'moment-timezone';
import POI from '../models/poi';
import * as geo from './geometry';
import * as format from './formatters';

type TokenReplacer = (data: SpotData, params: Map<string, string>) => Promise<string>;

const dms = (deg: number): [number, number, number] => {
  const degree = Math.abs(deg);
  const d = Math.floor(degree);
  const m = Math.floor((degree - d) * 60);
  const s = (degree - d) * 3600 - m * 60;
  return [d, m, s];
};

const formatDeg = (hemispheres: [string, string]) => (deg: number) => {
  const n = dms(deg);
  const hemi = hemispheres[deg > 0 ? 0 : 1];
  return `${n[0]}° ${n[1]}' ${n[2].toFixed(1)}" ${hemi}`;
}

const formatLat = formatDeg(['N', 'S']);
const formatLng = formatDeg(['E', 'W']);

const tokenReplacers: { [key: string]: TokenReplacer } = {
  deviceName: data => Promise.resolve(data.deviceName),
  message: data => Promise.resolve(data.message),
  elapsedTime: data => Promise.resolve(
    data.time > Date.now() ? 'just now' : moment(data.time).fromNow()
  ),
  latitude: ({ coordinates }, _, params) => Promise.resolve(
    params.has('dms') ? formatLat(coordinates[0]) : coordinates[0].toString()
  ),
  longitude: ({ coordinates }, _, params) => Promise.resolve(
    params.has('dms') ? formatLng(coordinates[1]) : coordinates[1].toString()
  ),
  coordinates: ({ coordinates }, _, params) => Promise.resolve(
    params.has('dms')
      ? [formatLat(coordinates[0]), formatLng(coordinates[1])].join(' ')
      : [coordinates[0], coordinates[1]].join(', ')
  ),
  mapsURL: ({ coordinates }, { preferences }, params) => Promise.resolve({
    Google: `https://www.google.com/maps/place/${coordinates[0]}+${coordinates[1]}/@${coordinates[0]},${coordinates[1]},${params.get('zoom') || '10'}z`,
    Apple: `https://maps.apple.com/?q=${coordinates[0]},${coordinates[1]}&sll=${coordinates[0]},${coordinates[1]}&z=${params.get('zoom') || '10'}`
  }[preferences.mapsProvider]),
  nearestPOI: ({ coordinates }, params) => {
    const within = params.get('within');
    return POI.near(coordinates, within ? parseFloat(within) : Infinity).then(pois => {
      if (pois.length) {
        const nearest = pois[0];
        if (nearest) {
          const distance = geo.distance(nearest.coordinates, coordinates);
          if (distance <= nearest.presenceRadius) {
            return `${params.get('prefix') || ''} ${nearest.preposition} ${nearest.name}`.trim();
          }

          const bearing = format.cardinalDirection(geo.greatCircleInitialCourse(nearest.coordinates, coordinates), 2);
          return `${params.get('prefix') || ''} ${format.colloquialDistance(distance, 'mile', 'miles')} ${bearing} of ${nearest.name}`.trim();
        }
      }

      return '';
    });
  },
};

export default (template: string, data: SpotData, recipient: Recipient): Promise<string> => {
  let match;
  const matcher = /{([a-z]+?)(:([^}]+))?}/ig;
  const replacements = [];
  while (match = matcher.exec(template)) {
    const [token, tokenName, , params = ''] = match;
    const replacer = tokenReplacers[tokenName];
    if (replacer) {
      replacements.push(replacer(data, recipient, new Map(
        params.split(',').map(pair => pair.split('='))
      )).then(value => ({ token, value })));
    }
  }
  
  return Promise.all(replacements).then(reps => (
    reps.reduce((result, rep) => result.replace(rep.token, rep.value), template)
  ));
};
