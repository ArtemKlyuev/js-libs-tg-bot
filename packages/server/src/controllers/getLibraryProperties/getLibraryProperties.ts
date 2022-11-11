import { DatabaseRepository } from '@repository';

interface NameToConfig {
  [name: string]: {
    name: string;
    type: 'text' | 'multiline_text' | 'select' | 'multi_select';
    label: string;
    required: boolean;
    order: number;
  };
}

const nameToConfig: NameToConfig = {
  Name: { name: 'name', type: 'text', label: 'Название библиотеки', required: true, order: 1 },
  Platform: {
    name: 'platform',
    type: 'select',
    label: 'Выберите платформу',
    required: true,
    order: 2,
  },
  Tags: { name: 'tags', type: 'multi_select', label: 'Выберите теги', required: true, order: 3 },
  Status: { name: 'status', type: 'select', label: 'Выберите статус', required: true, order: 4 },
  'Score /5': {
    name: 'rating',
    type: 'select',
    label: 'Поставьте рейтинг',
    required: false,
    order: 5,
  },
  Review: {
    name: 'review',
    type: 'multiline_text',
    label: 'Напишите ревью',
    required: false,
    order: 6,
  },
};

// TODO: исправить ошибку
export const getLibraryProperties = (dbRepository: DatabaseRepository) => {
  return dbRepository.getProperties().then((eitherProperties) => {
    return eitherProperties.mapRight((properties) => {
      return properties
        .filter((prop) => prop.name in nameToConfig)
        .map((prop) => ({ ...prop, ...nameToConfig[prop.name] }))
        .sort((propA, propB) => propA.order - propB.order)
        .map(({ order, ...prop }) => prop);
    });
  });
};
