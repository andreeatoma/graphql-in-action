// The taskMainList query

// type Task implements SearchResultItem {
// id: ID!
// createdAt: String!
// content: String!
// tags: [String!]!
// approachCount: Int!
// # author: User!
// # approachList: [Approach!]!
// }

// The first query field that will use this Task type is the list of the latest Tasks that will be
// displayed on the main page of the AZdev app. We named that field taskMainList.

// type Query {
// taskMainList: [Task!]
// }

// To learn the concepts in the right order, let’s start with the five simple scalar leaf fields
// under this type: id, content, tags, approachCount, and createdAt.
//  Here’s a GraphQL query that we can use to start testing this feature.

// query {
// taskMainList {
// id
// content
// tags
// approachCount
// createdAt
// }
// }

// This query should return an array of Task records. Each item in that array is an object
// with five properties whose values will come from the PostgreSQL azdev.tasks table
// (which has columns matching the five field names). Let’s implement this feature with
// the simplest code possible and improve it once we get it to work naively. As Kent Beck
// said, “Make it work. Make it right. Make it fast.”

//  To implement this feature, we need to follow these three steps:

// 1 Define a new object type named Task that has the five scalar fields.
// 2 Write any non-default resolvers for the Task type. We have to do date-to-string
// conversion for the created_at database column. We also decided to expose the
// tags GraphQL field as an array of strings instead of the comma-separated string
// values in the database.

// 3 Modify the Query type to have a field named taskMainList that is a list of nonnull Task items, and resolve it with an array of records from the azdev.tasks
// table.

// Let’s start by defining the Task type.

//  Defining object types
// Here’s a possible implementation of the new Task type (without any resolvers).

import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
} from 'graphql';
import User from './user';
import Approach from './approach';

const Task = new GraphQLObjectType({
  name: 'Task',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    tags: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLString))
      ),
      resolve: (source) => source.tags.split(','),
    },
    author: {
      type: new GraphQLNonNull(User),
      resolve: ({ userId }, _, { loaders }) => {
        return loaders.getUsersById.load(userId);
      },
    },
    approachCount: { type: new GraphQLNonNull(GraphQLInt) },
    createdAt: { type: new GraphQLNonNull(GraphQLString) },
    approachList: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Approach))),
      resolve: ({ id }, _, { loaders }) => loaders.approachLists.load(id),
    },
  }),
});

export default Task;

// The Task object here is just a direct translation of the SDL text in listing 6.4. The six
// lines in the SDL version more than tripled with all the object-based method boilerplate code. The worst part about this is probably the type for the tags field. The simple [String!]! had to be written with nested calls of three functions:
// new GraphQLNonNull(
// new GraphQLList(
// new GraphQLNonNull(
// GraphQLString
// )
// )
// )

// const Task = new GraphQLObjectType({
//   name: 'Task',
//   fields: {
//     //......
//     createdAt: {
//       type: new GraphQLNonNull(GraphQLString),
//       resolve: (source) => source.created_at,
//     }
//   }
// })

//
