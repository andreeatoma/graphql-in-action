import pgClient from '../pg-client';
import { getTasksByTypes } from './loaders/getTasksByTypes';
import { getUsersById } from './loaders/getUsersById';
import { approachLists } from './loaders/approachLists';
import { getTasksById } from './loaders/getTasksById';

const pgApiWrapper = async () => {
  const { pgPool } = await pgClient();
  const query = (text, params = {}) =>
    pgPool.query(text, Object.values(params));
  return {
    loaders: {
      getTasksByTypes: getTasksByTypes(query),
      getUsersById: getUsersById(query),
      approachLists: approachLists(query),
      getTasksById: getTasksById(query),
      // getTaskListsByUserIds: getTaskListsByUserIds(query),
      // searchResults: searchResults(query),
    },
  };
};

export default pgApiWrapper;

// The pg-api.js file will define the functions, and the sqls.js file will define the SQL statements.
// Also note that I introduced a new function, pgQuery, which is a wrapper for pgPool.query. The pgPool.query function is the current driver’s method, and it expects query variables as an array. The pgQuery function is something we can control any time when needed, and I made it receive query variables as an object (which will make the code a bit more readable, in my opinion).
