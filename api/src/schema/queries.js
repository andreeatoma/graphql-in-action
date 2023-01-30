import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
} from 'graphql';
import NumbersInRange from './types/numbers-in-range';
import { numbersInRangeObject } from '../utils';
import Task from './types/task';
import { TASKS_TYPES } from '../db/pg-api/constants';

const QueryType = new GraphQLObjectType({
  description: 'The entry point of the API',
  name: 'Query',
  fields: {
    currentTime: {
      type: GraphQLString,
      resolve: () => {
        const isoString = new Date().toISOString();
        return isoString.slice(11, 19);
      },
    },
    numbersInRange: {
      type: NumbersInRange,
      args: {
        begin: { type: new GraphQLNonNull(GraphQLInt) },
        end: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: function (source, { begin, end }) {
        return numbersInRangeObject(begin, end);
      },
    },
    taskMainList: {
      description: 'A list of the most recent 100 Task objects',
      type: new GraphQLList(new GraphQLNonNull(Task)),
      resolve: (_, __, { loaders }) =>
        loaders.getTasksByTypes.load(TASKS_TYPES.latest),
    },
    taskInfo: {
      description: 'Get information about a Task entity by ID',
      type: Task,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: async (_, args, { loaders }) => {
        return loaders.getTasksById.load(args.id);
      },
    },
  },
});
export default QueryType;
