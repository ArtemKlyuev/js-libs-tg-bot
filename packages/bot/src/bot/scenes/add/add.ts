import { Scene } from '../Scene';

import {
  titleStep,
  platformStep,
  tagsStep,
  statusStep,
  ratingStep,
  reviewStep,
  resultStep,
} from './steps';

export const addScene = new Scene(
  'add-scene',
  titleStep,
  platformStep,
  tagsStep,
  statusStep,
  ratingStep,
  reviewStep,
  resultStep,
);
