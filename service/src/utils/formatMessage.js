/* @flow */

import type { Model } from '../types/mongoose';
import type { PopulatedRule } from '../models/rule';
import type { SpotData } from '../types/spotData';
import moment from 'moment-timezone';

type TokenReplacer = (data: SpotData, params: Set<string>) => string;

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
  elapsedTime: data => moment(data.time).fromNow(),
  deviceName: data => data.deviceName,
  message: data => data.message,
  latitude: (data, params) => (
    params.has('dms') ? formatLat(data.coordinates[0]) : data.coordinates[0].toString()
  ),
  longitude: (data, params) => (
    params.has('dms') ? formatLng(data.coordinates[1]) : data.coordinates[1].toString()
  ),
  coordinates: (data, params) => (
    params.has('dms')
      ? [formatLat(data.coordinates[0]), formatLng(data.coordinates[1])].join(' ')
      : [data.coordinates[0], data.coordinates[1]].join(', ')
  ),
};

export default (template: string, data: SpotData): Promise<string> => {
  return Promise.resolve(
    template.replace(/{([a-z]+?)(:([a-z,]+?))?}/ig, (input, token, __, params = '') => {
      const replacer = tokenReplacers[token];
      return replacer ? replacer(data, new Set(params.split(','))) : input;
    })
  );
};
