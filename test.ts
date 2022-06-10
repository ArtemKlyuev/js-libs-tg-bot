import { NotionDatabase, GithubApi } from './src/services';

const AUTH_TOKEN = 'secret_EyJuzcuj2O3yV9VS5yKs0oBFy77ozzxa2ihRAR490WW';
const DB_ID = 'dfc9992253114650a390a14847f8a2b7';

const notionDb = new NotionDatabase({ authToken: AUTH_TOKEN, databaseID: DB_ID });

const main = async () => {
  const result = await notionDb.findByQuery('c8');

  result
    .mapLeft((error) => {
      // console.log('error=====', error);
      console.log('error TOJSON=====', {
        message: error.message,
        name: error.name,
        ...error,
        stack: error.stack,
      });
    })
    .mapRight((response) => {
      console.log('RESPONSE>>>>>');
      console.dir(response, { depth: null });
    });
};

// const main = async () => {
//   const github = new GithubApi();

//   const result = await github.getRepoInfo('gr2m', 'before-after-hook123');

//   result
//     .mapLeft((error) => {
//       console.log('GH ERROR string', error.toString());
//       console.log('GH ERROR', error);
//     })
//     .mapRight((res) => {
//       console.dir(res, { depth: null });
//     });
// };

main();
