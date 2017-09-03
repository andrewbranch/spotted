import { MapsProvider } from './mapsProvider';

export interface Recipient {
  name: string;
  phone: string;
  preferences: {
    mapsProvider: MapsProvider;
  };
};
