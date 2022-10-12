import { ValueOf } from 'type-fest';
import { CreatePageResponse } from '@notionhq/client/build/src/api-endpoints';

type PageResponse = Extract<CreatePageResponse, { parent: {} }>;
type ExtractedProperties = PageResponse['properties'];

type Properties = ValueOf<ExtractedProperties>;

export type URL = Extract<Properties, { type: 'url' }>;
export type Number = Extract<Properties, { type: 'number' }>;
export type Select = Extract<Properties, { type: 'select' }>;
export type MultiSelect = Extract<Properties, { type: 'multi_select' }>;
export type RichText = Extract<Properties, { type: 'rich_text' }>;
export type Title = Extract<Properties, { type: 'title' }>;

interface DbPropertiesInfo {
  Name: { id: string; name: 'Name'; type: 'title'; title: {} };
  Platform: {
    id: string;
    name: 'Platform';
    type: 'select';
    select: {
      options: [
        {
          id: string;
          name: 'Frontend';
          color: 'yellow';
        },
        {
          id: string;
          name: 'Backend';
          color: 'green';
        },
        {
          id: string;
          name: 'Isomorphic';
          color: 'pink';
        },
      ];
    };
  };
  'Repo link': {
    id: string;
    name: 'Link';
    type: 'url';
    url: {};
  };
  'npm weekly downloads': {
    id: string;
    name: 'npm weekly downloads';
    type: 'number';
    number: {
      format: 'number_with_commas';
    };
  };
  Tags: {
    id: string;
    name: 'Tags';
    type: 'multi_select';
    multi_select: [
      {
        id: string;
        name: 'React';
        color: 'green';
      },
      {
        id: string;
        name: 'Date';
        color: 'orange';
      },
      {
        id: string;
        name: "Drag'n'Drop";
        color: 'blue';
      },
      {
        id: string;
        name: 'Emoji';
        color: 'yellow';
      },
      {
        id: string;
        name: 'Icons';
        color: 'brown';
      },
      {
        id: string;
        name: 'Rendering large lists';
        color: 'gray';
      },
      {
        id: string;
        name: 'Data compression';
        color: 'default';
      },
      {
        id: string;
        name: 'Zip';
        color: 'pink';
      },
      {
        id: string;
        name: 'Requests';
        color: 'purple';
      },
      {
        id: string;
        name: 'Testing';
        color: 'red';
      },
      {
        id: string;
        name: 'regex';
        color: 'red';
      },
      {
        id: string;
        name: 'Other';
        color: 'default';
      },
      {
        id: string;
        name: 'Shortcuts';
        color: 'orange';
      },
      {
        id: string;
        name: 'Text editor';
        color: 'brown';
      },
      {
        id: string;
        name: 'Keyboard';
        color: 'yellow';
      },
      {
        id: string;
        name: 'Markdown';
        color: 'blue';
      },
      {
        id: string;
        name: 'Utils';
        color: 'pink';
      },
      {
        id: string;
        name: 'functional programming';
        color: 'yellow';
      },
      {
        id: string;
        name: 'Text diff';
        color: 'red';
      },
      {
        id: string;
        name: 'Parsers and compilers';
        color: 'green';
      },
      {
        id: string;
        name: 'id';
        color: 'green';
      },
      {
        id: string;
        name: 'Clipboard';
        color: 'green';
      },
      {
        id: string;
        name: 'Cookies';
        color: 'orange';
      },
      {
        id: string;
        name: 'Next.js';
        color: 'green';
      },
      {
        id: string;
        name: 'Database';
        color: 'purple';
      },
      {
        id: string;
        name: 'Money';
        color: 'green';
      },
      {
        id: string;
        name: 'Number';
        color: 'red';
      },
      {
        id: string;
        name: 'CI';
        color: 'yellow';
      },
      {
        id: string;
        name: 'CLI';
        color: 'purple';
      },
      {
        id: string;
        name: 'String';
        color: 'pink';
      },
      {
        id: string;
        name: 'babel';
        color: 'yellow';
      },
      {
        id: string;
        name: 'Charts';
        color: 'gray';
      },
      {
        id: string;
        name: 'Graphics';
        color: 'blue';
      },
      {
        id: string;
        name: 'Canvas';
        color: 'yellow';
      },
      {
        id: string;
        name: 'Image';
        color: 'green';
      },
      {
        id: string;
        name: 'Search';
        color: 'red';
      },
      {
        id: string;
        name: 'Styling';
        color: 'green';
      },
      {
        id: string;
        name: 'CSS-in-JS';
        color: 'brown';
      },
      {
        id: string;
        name: 'Logging';
        color: 'brown';
      },
    ];
  };
  Summary: {
    id: string;
    name: 'Summary';
    type: 'rich_text';
    rich_text: {};
  };
  Status: {
    id: string;
    name: 'Status';
    type: 'select';
    select: {
      options: [
        {
          id: string;
          name: 'Backlog';
          color: 'default';
        },
        {
          id: string;
          name: 'To Do';
          color: 'gray';
        },
        {
          id: string;
          name: 'In Progress';
          color: 'purple';
        },
        {
          id: string;
          name: 'Waiting';
          color: 'yellow';
        },
        {
          id: string;
          name: 'Rejected';
          color: 'red';
        },
        {
          id: string;
          name: 'Done';
          color: 'green';
        },
      ];
    };
  };
  'Score /5': {
    id: string;
    name: 'Score /5';
    type: 'select';
    select: {
      options: [
        {
          id: string;
          name: '⭐️⭐️⭐️⭐️⭐️';
          color: 'green';
        },
        {
          id: string;
          name: '⭐️⭐️⭐️⭐️';
          color: 'green';
        },
        {
          id: string;
          name: '⭐️⭐️⭐️';
          color: 'yellow';
        },
        {
          id: string;
          name: '⭐️⭐️';
          color: 'red';
        },
        {
          id: string;
          name: '⭐️';
          color: 'red';
        },
      ];
    };
  };
  Review: {
    id: string;
    name: 'Review';
    type: 'rich_text';
    rich_text: {};
  };
}

/**
 * =========================================
 */
