// type Approach implement SearchResultItems {
//     id: ID!
//     createdAt: String!
//     content: String!
//     voteCount: Int!
//     author: User!
//     task: Task!
//     detailsList: [ApproachDetail!]!
// }

// The implementation of this type is mostly similar to the Task type. We can use the default resolvers for id and content, voteCount, the same ISO casting for createdAt, and the same code we used for the author field.

import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql';
import User from './user';
import Task from './task';

const Approach = new GraphQLObjectType({
  name: 'Approach',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    voteCount: { type: new GraphQLNonNull(GraphQLInt) },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ createdAt }) => createdAt.toISOString(),
    },
    author: {
      type: new GraphQLNonNull(User),
      resolve: (source, _, { loaders }) =>
        loaders.getUsersById.load(source.userId),
    },
    task: {
      type: new GraphQLNonNull(Task),
      resolve: (source, _, { loaders }) =>
        loaders.getTasksById.load(source.taskId),
    },
  }),
});
export default Approach;

// The changes to these types are identical. We use the new loaders object in the resolver’s context object (instead of the previous pgApi object) and then use a .load call on the usersDataLoader instance.
//  DataLoader takes care of the rest! When multiple .load calls are made in the same execution context while the GraphQL query is being resolved, DataLoader batches the calls. It prepares an array from all the loaded IDs and executes the batch-loading function just once. It then uses the response for that single call to satisfy all user data requirements that were made in the query.
