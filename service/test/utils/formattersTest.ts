import { Colloquialism } from '../../src/utils/formatters';
import * as tape from 'tape';
import { cardinalDirection, colloquialDistance } from '../../src/utils/formatters';

tape('formatters: cardinalDirection (2)', t => {
  t.equal(cardinalDirection(22, 2, 0), 'N', '22° is N');
  t.equal(cardinalDirection(23, 2, 0), 'NE', '23° is NE');
  t.equal(cardinalDirection(67, 2, 0), 'NE', '67° is NE');
  t.equal(cardinalDirection(68, 2, 0), 'E', '68° is E');
  t.equal(cardinalDirection(112, 2, 0), 'E', '112° is E');
  t.equal(cardinalDirection(113, 2, 0), 'SE', '113° is SE');
  t.equal(cardinalDirection(157, 2, 0), 'SE', '157° is SE');
  t.equal(cardinalDirection(158, 2, 0), 'S', '158° is S');
  t.equal(cardinalDirection(202, 2, 0), 'S', '202° is S');
  t.equal(cardinalDirection(203, 2, 0), 'SW', '203° is SW');
  t.equal(cardinalDirection(247, 2, 0), 'SW', '247° is SW');
  t.equal(cardinalDirection(248, 2, 0), 'W', '248° is W');
  t.equal(cardinalDirection(292, 2, 0), 'W', '292° is W');
  t.equal(cardinalDirection(293, 2, 0), 'NW', '293° is NW');
  t.equal(cardinalDirection(337, 2, 0), 'NW', '337 is NW');
  t.end();
});

tape('formatters: cardinalDirection (3)', t => {
  t.equal(cardinalDirection(11, 3, 0), 'N', '11° is N');
  t.equal(cardinalDirection(12, 3, 0), 'NNE', '12° is NNE');
  t.equal(cardinalDirection(33, 3, 0), 'NNE', '33° is NNE');
  t.equal(cardinalDirection(34, 3, 0), 'NE', '34° is NE');
  t.equal(cardinalDirection(56, 3, 0), 'NE', '56° is NE');
  t.equal(cardinalDirection(57, 3, 0), 'ENE', '57° is ENE');
  t.equal(cardinalDirection(78, 3, 0), 'ENE', '78° is ENE');
  t.equal(cardinalDirection(79, 3, 0), 'E', '79° is E');
  t.equal(cardinalDirection(101, 3, 0), 'E', '101° is E');
  t.equal(cardinalDirection(102, 3, 0), 'ESE', '102° is ESE');
  t.equal(cardinalDirection(123, 3, 0), 'ESE', '123° is ESE');
  t.equal(cardinalDirection(124, 3, 0), 'SE', '124° is SE');
  t.equal(cardinalDirection(146, 3, 0), 'SE', '146° is SE');
  t.equal(cardinalDirection(147, 3, 0), 'SSE', '147° is SSE');
  t.equal(cardinalDirection(168, 3, 0), 'SSE', '168° is SSE');
  t.equal(cardinalDirection(169, 3, 0), 'S', '169° is S');
  t.equal(cardinalDirection(191, 3, 0), 'S', '191 is S');
  t.equal(cardinalDirection(192, 3, 0), 'SSW', '192° is SSW');
  t.equal(cardinalDirection(213, 3, 0), 'SSW', '213° is SSW');
  t.equal(cardinalDirection(214, 3, 0), 'SW', '214° is SW');
  t.equal(cardinalDirection(236, 3, 0), 'SW', '236° is SW');
  t.equal(cardinalDirection(237, 3, 0), 'WSW', '237° is WSW');
  t.equal(cardinalDirection(258, 3, 0), 'WSW', '258° is WSW');
  t.equal(cardinalDirection(259, 3, 0), 'W', '259° is W');
  t.equal(cardinalDirection(281, 3, 0), 'W', '281° is W');
  t.equal(cardinalDirection(282, 3, 0), 'WNW', '282° is WNW');
  t.equal(cardinalDirection(303, 3, 0), 'WNW', '303° is WNW');
  t.equal(cardinalDirection(304, 3, 0), 'NW', '304° is NW');
  t.equal(cardinalDirection(326, 3, 0), 'NW', '326° is NW');
  t.equal(cardinalDirection(327, 3, 0), 'NNW', '327° is NNW');
  t.equal(cardinalDirection(348, 3, 0), 'NNW', '348° is NNW');
  t.equal(cardinalDirection(349, 3, 0), 'N', '349° is N');
  t.end();
});

tape('formatters: cardinalDirection (unabbreviation)', t => {
  t.equal(cardinalDirection(192, 3, 3), 'south-southwest', 'bearings with length within `unabbreviate` get spelled out');
  t.equal(cardinalDirection(192, 3, 2), 'SSW', 'bearings with longer length within `unabbreviate` get abbreviated');
  t.equal(cardinalDirection(230, 3), 'SW', 'intercardinal directions are abbreviated by default');
  t.equal(cardinalDirection(0, 3), 'north', 'cardinal directions are spelled out by default');
  t.end();
});

const colloquialMiles = (distance: number, fixed?: number, colloquialThreshold?: number, colloquialisms?: Colloquialism[]) => colloquialDistance(distance, 'mile', 'miles', fixed, colloquialThreshold, colloquialisms);
tape('formatters: colloquialDistance', t => {
  t.equal(colloquialMiles(0.25), 'a quarter mile', '“a quarter {unit}” is a default colloquialism');
  t.equal(colloquialMiles(0.5), 'half a mile', '“half a {unit}” is a default colloquialism');
  t.equal(colloquialMiles(1), 'a mile', '“a {unit}” is a default colloquialism');
  t.equal(colloquialMiles(0.225, 3, 0.1), 'a quarter mile', 'distances match colloquialisms inside a threshold');
  t.equal(colloquialMiles(0.224, 3, 0.1), '0.224 miles', 'distances outside the colloquial threshold get formatted normally');
  t.equal(colloquialMiles(0.224, 1, 0.1), '0.2 miles', 'distances get formatted to a given precision');
  t.equal(colloquialMiles(0.224, 1, 0.1), '0.2 miles', 'distances get formatted to a given precision');
  t.equal(colloquialMiles(100, 1, 0.1, [{ number: 100, string: 'a century' }]), 'a century', 'custom colloquialisms can be passed');
  t.equal(colloquialMiles(87, 1, 0.1, [{ number: 87, string: 'four score and seven {units}' }]), 'four score and seven miles', 'colloquialisms with plural units work');
  t.equal(colloquialMiles(0.5, 1, 0), 'half a mile', 'colloquialThreshold matches exact numbers at 0');
  t.equal(colloquialMiles(0.501, 3, 0), '0.501 miles', 'colloquialThreshold rejects non-exact numbers at 0');
  t.equal(colloquialMiles(0.501, 2, 0), 'half a mile', 'the precision-formatted distance can match colloquialisms');
  t.equal(colloquialMiles(1, 1, 0, []), '1 mile', 'when `1` gets formatted normally, the singular unit is used');
  t.equal(colloquialDistance(1, 'inch', 'inches'), 'an inch', 'uses correct indefinite article (“an inch”)');
  t.equal(colloquialDistance(1, 'hour', 'hour'), 'an hour', 'uses correct indefinite article (“an hour”)');
  t.end();
});
