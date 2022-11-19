import { DatabaseRepository } from '@repository';
import { LibraryData } from '../controllers/addLibrary/types';
import { Property } from '../models';

interface Properties extends LibraryData {
  review: string;
  repoURL: string;
  stars: number;
  npmDownloads: number;
  summary: string;
}

const nameToDbPropertyName: Record<keyof Properties, string> = {
  name: 'name',
  npmDownloads: 'npm weekly downloads',
  platform: 'platform',
  repoURL: 'repo link',
  review: 'review',
  rating: 'score /5',
  stars: 'github stars',
  status: 'status',
  summary: 'summary',
  tags: 'tags',
};

export const propertyToModel = async (
  properties: Properties,
  notionRepository: DatabaseRepository,
): Promise<Property[]> => {
  const eitherProperties = await notionRepository.getProperties();

  if (eitherProperties.isLeft()) {
    throw new Error('[propertyMapper]: properties is left');
  }

  const dbProperties = eitherProperties.unwrap();

  const propertiesModels = dbProperties.map(
    ({ id, name, type }) => new Property({ id, name, type, value: null }),
  );

  const models = Object.entries(properties).map(([name, value]) => {
    const dbPropertyName = nameToDbPropertyName[name as keyof Properties];

    const model = propertiesModels.find((prop) => prop.name.toLowerCase() === dbPropertyName);

    if (!model) {
      throw new Error(
        `[propertyMapper]: cannot find name model with name "${dbPropertyName}" in map`,
      );
    }

    model.setValue(value);

    return model;
  });

  return models;
};
