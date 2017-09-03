import { SpotMessage, Recipient } from '../../src/types';
import { POI } from '../../src/models';
import { formatMessage } from '../../src/utils';
import * as tape from 'tape';
import * as moment from 'moment-timezone';
import { when, replace, function as fn } from 'testdouble';

const data: SpotMessage = {
  time: new Date('1/1/2016 12:00:00 PM PST'),
  deviceName: 'Where is Andrew',
  coordinates: [37.77402, -122.41721],
  message: 'This is the message from SPOT',
  messageType: 'ok',
  fullText: '',
};

const googleRecipient: Recipient = {
  name: 'User 1',
  phone: '+15555555555',
  preferences: {
    mapsProvider: 'Google'
  }
};

const appleRecipient: Recipient = {
  name: 'User 2',
  phone: '+15555555555',
  preferences: {
    mapsProvider: 'Apple'
  }
};

replace(POI, 'near', fn('near'));
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

tape('formatMessage: simple tokens', async t => {
  t.equal(await formatMessage('{elapsedTime}', data, googleRecipient), moment(data.time).fromNow(), 'elapsedTime token works');
  t.equal(await formatMessage('{deviceName}', data, googleRecipient), data.deviceName, 'deviceName token works');
  t.equal(await formatMessage('{message}', data, googleRecipient), data.message, 'message token works');
  t.equal(await formatMessage('{latitude}', data, googleRecipient), '37.77402', 'latitude token works');
  t.equal(await formatMessage('{longitude}', data, googleRecipient), '-122.41721', 'longitude token works');
  t.equal(await formatMessage('{coordinates}', data, googleRecipient), '37.77402, -122.41721', 'coordinates token works');
  t.equal(await formatMessage('{mapsURL}', data, googleRecipient), 'https://www.google.com/maps/place/37.77402+-122.41721/@37.77402,-122.41721,10z', 'mapsURL works with Google as mapsProvider');
  t.equal(await formatMessage('{mapsURL}', data, appleRecipient), 'https://maps.apple.com/?q=37.77402,-122.41721&sll=37.77402,-122.41721&z=10', 'mapsURL works with Apple as mapsProvider');
  t.equal(await formatMessage('{latitude:dms}', data, googleRecipient), `37° 46' 26.5" N`, 'latitude token supports dms param');
  t.equal(await formatMessage('{longitude:dms}', data, googleRecipient), `122° 25' 2.0" W`, 'longitude token supports dms param');
  t.equal(await formatMessage('{coordinates:dms}', data, googleRecipient), `37° 46' 26.5" N 122° 25' 2.0" W`, 'coordinates token supports dms param');
  t.equal(await formatMessage('{mapsURL:zoom=5}', data, googleRecipient), 'https://www.google.com/maps/place/37.77402+-122.41721/@37.77402,-122.41721,5z', 'mapsURL (Google) supports zoom param');
  t.equal(await formatMessage('{mapsURL:zoom=5}', data, appleRecipient), 'https://maps.apple.com/?q=37.77402,-122.41721&sll=37.77402,-122.41721&z=5', 'mapsURL (Apple) supports zoom param');
  
  t.equal(
    await formatMessage('{elapsedTime}', Object.assign({}, data, { time: new Date(Date.now() + 5000) }), googleRecipient),
    'just now',
    'elapsedTime says “just now” for future times'
  );
  
  t.equal(await formatMessage('{latitude} and {longitude}', data, googleRecipient), '37.77402 and -122.41721', 'multiple tokens are interpolated in templates');
  t.end();
});

tape('formatMessage: {nearestPOI}', async t => {
  t.equal(await formatMessage('{nearestPOI}', data, googleRecipient), 'at City Hall', '{nearestPOI} works within presenceRadius');
  t.equal(await formatMessage('{nearestPOI}', data2, googleRecipient), '0.4 miles SE of City Hall', '{nearestPOI} works outside of presenceRadius');
  t.equal(await formatMessage('{nearestPOI:prefix=They are}', data, googleRecipient), 'They are at City Hall', '{nearestPOI} supports prefix param');
  t.equal(await formatMessage('{nearestPOI:within=10}', data, googleRecipient), 'at City Hall', '{nearestPOI} supports within param');
  t.equal(await formatMessage('{nearestPOI:prefix=They are,within=0.1}', data, googleRecipient), '', '{nearestPOI} resolves to empty string when nothing matches');
  t.end();
});
