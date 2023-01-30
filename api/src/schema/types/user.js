import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';

const User = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    username: { type: new GraphQLNonNull(GraphQLString) },
    name: {
      type: GraphQLString,
      resolve: ({ firstName, lastName }) => {
        return [firstName, lastName].filter(Boolean).join(' ');
      },
    },
  },
});

export default User;
