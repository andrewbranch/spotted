import { Coordinates } from '../../src/types';
import * as tape from 'tape';
import { greatCircleInitialCourse, distance } from '../../src/utils';

const sf: Coordinates = [37.7573683, -122.7177862];
const pensacola: Coordinates = [30.4540011, -87.3439368];
const seattle: Coordinates = [47.6145069, -122.6160864];
const laptevSea: Coordinates = [75.945205, 126.935170];
const fortConger: Coordinates = [81.74494, -64.7880197];

// Within half a percent
const isClose = (a: number, b: number) => Math.abs(b - a) / b < .005;
tape('test helper: isClose', t => {
  t.notOk(isClose(99.5, 100), '99.5 is not close to 100');
  t.ok(isClose(99.5001, 100), '99.5001 is close to 100');
  t.end();
});

const isWithinPointOne = (a: number, b: number) => Math.abs(b - a) < 0.1;

// Answers are from http://williams.best.vwh.net/gccalc.htm
tape('geometry: greatCircleInitialCourse', t => {
  t.ok(isWithinPointOne(greatCircleInitialCourse(sf, pensacola), 93.341303), 'SF to Pensacola');
  t.ok(isWithinPointOne(greatCircleInitialCourse(pensacola, sf), 293.659459), 'Pensacola to SF');
  t.ok(isWithinPointOne(greatCircleInitialCourse(sf, seattle), 0.4020284), 'SF to Seattle');
  t.ok(isWithinPointOne(greatCircleInitialCourse(laptevSea, fortConger), 4.428599), 'Siberia to Greenland');
  t.end();
});

tape('geometry: distance', t => {
  t.ok(isClose(distance(sf, pensacola), 2076.385), 'SF to Pensacola');
  t.ok(isClose(distance(sf, seattle), 680.420), 'SF to Seattle');
  t.ok(isClose(distance(laptevSea, fortConger), 1540.509), 'Siberia to Greenland');
  t.end();
});
