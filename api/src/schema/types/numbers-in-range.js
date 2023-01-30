import { GraphQLObjectType, GraphQLInt, GraphQLNonNull } from "graphql";

const NumbersInRange = new GraphQLObjectType({
  name: "NumbersInRange",
  description: "Aggregate info on a range of numbers",
  fields: {
    sum: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    count: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
});

export default NumbersInRange;

// Besides the name property, we can give each type an optional description property to describe the type. Both of these will show up in
// GraphiQL’s Docs explorer when the new NumbersInRange type is used in the main schema

// Note that the sum and count fields in the NumbersInRange type do not have resolver functions.
// Although this design makes sum and count leaf fields, having resolver func- tions for them is optional. This is because these leaf fields can use the default trivial resolvers based on properties defined on their parent source object. For this to work, the object resolved as the parent object (which is of type NumbersInRange) has to respond to sum and count methods.
