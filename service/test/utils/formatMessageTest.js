/* @flow */

import type { SpotData } from '../../src/types/spotData';
import tape from 'tape';
import moment from 'moment-timezone';
import formatMessage from '../../src/utils/formatMessage';

const data: SpotData = {
  time: new Date('1/1/2016 12:00:00 PM PST'),
  timeZone: 'PST',
  deviceName: 'Where is Andrew',
  coordinates: [37.77402, -122.41721],
  message: 'This is the message from SPOT',
  messageType: 'ok',
  fullText: '',
};

tape('formatMessage', async t => {
  t.plan(12);
  t.equal(await formatMessage('{elapsedTime}', data), moment(data.time).fromNow(), 'elapsedTime token works');
  t.equal(await formatMessage('{deviceName}', data), data.deviceName, 'deviceName token works');
  t.equal(await formatMessage('{message}', data), data.message, 'message token works');
  t.equal(await formatMessage('{latitude}', data), '37.77402', 'latitude token works');
  t.equal(await formatMessage('{longitude}', data), '-122.41721', 'longitude token works');
  t.equal(await formatMessage('{coordinates}', data), '37.77402, -122.41721', 'coordinates token works');
  t.equal(await formatMessage('{googleMapsURL}', data), 'https://www.google.com/maps/@37.77402,-122.41721,10z', 'googleMapsURL works');
  t.equal(await formatMessage('{latitude:dms}', data), `37° 46' 26.5" N`, 'latitude token supports dms param');
  t.equal(await formatMessage('{longitude:dms}', data), `122° 25' 2.0" W`, 'longitude token supports dms param');
  t.equal(await formatMessage('{coordinates:dms}', data), `37° 46' 26.5" N 122° 25' 2.0" W`, 'coordinates token supports dms param');
  t.equal(await formatMessage('{googleMapsURL:zoom=5}', data), 'https://www.google.com/maps/@37.77402,-122.41721,5z', 'googleMapsURL supports zoom param');
  
  t.equal(
    await formatMessage('{elapsedTime}', Object.assign({}, data, { time: new Date(Date.now() + 5000) })),
    'just now',
    'elapsedTime says “just now” for future times'
  );
});
