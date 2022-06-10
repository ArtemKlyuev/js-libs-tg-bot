import { Scene } from '../Scene';

import {
  titleStep,
  platformStep,
  tagsStep,
  fourthStep,
  fifthStep,
  sixthStep,
  seventhStep,
} from './steps';

export const addScene = new Scene(
  'add-scene',
  titleStep,
  platformStep,
  tagsStep,
  fourthStep,
  fifthStep,
  sixthStep,
  seventhStep,
);
