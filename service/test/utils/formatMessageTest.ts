import { SpotData } from '../../src/types/spotData';
import tape from 'tape';
import moment from 'moment-timezone';
import td, { when } from 'testdouble';

const data: SpotData = {
  time: new Date('1/1/2016 12:00:00 PM PST'),
  timeZone: 'PST',
  deviceName: 'Where is Andrew',
  coordinates: [37.77402, -122.41721],
  message: 'This is the message from SPOT',
  messageType: 'ok',
  fullText: '',
};

tape('formatMessage: simple tokens', async t => {
  t.equal(await formatMessage('{elapsedTime}', data), moment(data.time).fromNow(), 'elapsedTime token works');
  t.equal(await formatMessage('{deviceName}', data), data.deviceName, 'deviceName token works');
  t.equal(await formatMessage('{message}', data), data.message, 'message token works');
  t.equal(await formatMessage('{latitude}', data), '37.77402', 'latitude token works');
  t.equal(await formatMessage('{longitude}', data), '-122.41721', 'longitude token works');
  t.equal(await formatMessage('{coordinates}', data), '37.77402, -122.41721', 'coordinates token works');
  t.equal(await formatMessage('{googleMapsURL}', data), 'https://www.google.com/maps/place/37.77402+-122.41721/@37.77402,-122.41721,10z', 'googleMapsURL works');
  t.equal(await formatMessage('{latitude:dms}', data), `37° 46' 26.5" N`, 'latitude token supports dms param');
  t.equal(await formatMessage('{longitude:dms}', data), `122° 25' 2.0" W`, 'longitude token supports dms param');
  t.equal(await formatMessage('{coordinates:dms}', data), `37° 46' 26.5" N 122° 25' 2.0" W`, 'coordinates token supports dms param');
  t.equal(await formatMessage('{googleMapsURL:zoom=5}', data), 'https://www.google.com/maps/place/37.77402+-122.41721/@37.77402,-122.41721,5z', 'googleMapsURL supports zoom param');
  
  t.equal(
    await formatMessage('{elapsedTime}', Object.assign({}, data, { time: new Date(Date.now() + 5000) })),
    'just now',
    'elapsedTime says “just now” for future times'
  );
  
  t.equal(await formatMessage('{latitude} and {longitude}', data), '37.77402 and -122.41721', 'multiple tokens are interpolated in templates');
  t.end();
});

const POI = td.replace('../../src/models/poi', { near: td.function('near') });
const cityHallModel = {
  name: 'City Hall',
  presenceRadius: 1,
  preposition: 'at',
  location: {
    type: 'Point',
    coordinates: [-122.4214533, 37.7792639],
  },
  coordinates: [37.7792639, -122.4214533],
};

when(POI.near(data.coordinates, Infinity)).thenResolve([cityHallModel]);
const data2 = Object.assign({}, data, { coordinates: [37.774021, -122.417211] });
when(POI.near([37.774021, -122.417211], Infinity)).thenResolve([Object.assign({}, cityHallModel, {
  presenceRadius: 0.1,
})]);

when(POI.near(data.coordinates, 10)).thenResolve([cityHallModel]);
when(POI.near(data.coordinates, 0.1)).thenResolve([]);

const formatMessage = require('../../src/utils/formatMessage').default;

tape('formatMessage: {nearestPOI}', async t => {
  t.equal(await formatMessage('{nearestPOI}', data), 'at City Hall', '{nearestPOI} works within presenceRadius');
  t.equal(await formatMessage('{nearestPOI}', data2), '0.4 miles SE of City Hall', '{nearestPOI} works outside of presenceRadius');
  t.equal(await formatMessage('{nearestPOI:prefix=They are}', data), 'They are at City Hall', '{nearestPOI} supports prefix param');
  t.equal(await formatMessage('{nearestPOI:within=10}', data), 'at City Hall', '{nearestPOI} supports within param');
  t.equal(await formatMessage('{nearestPOI:prefix=They are,within=0.1}', data), '', '{nearestPOI} resolves to empty string when nothing matches');
  t.end();
});
