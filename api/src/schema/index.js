import { GraphQLSchema, printSchema } from 'graphql';
import QueryType from './queries';
export const schema = new GraphQLSchema({
  query: QueryType,
});
console.log(printSchema(schema));

// The context object

// This means the type for the taskMainList field should be new GraphQLList(new
// GraphQLNonNull(Task)). To resolve this field, we need to execute this SQL statement
// on the PostgreSQL database.

// SELECT *
// FROM azdev.tasks
// WHERE is_private = FALSE
// ORDER BY created_at DESC
// LIMIT 100

// EXPLANATIONS

// Don’t include private Task objects.
// Sorts Tasks by creation date, newest first
// Limits the results to 100 Task objects

// !!!!!!!!!!! IMPORTANT Before a client can execute commands on a database and retrieve data from it, it needs to connect to it. There are many ways to connect to both PostgreSQL and MongoDB from the Node drivers.

// Before we can execute this SQL query, we need to open the pool of connections to
// PostgreSQL. To do that, we need to import the api/src/db/pg-client.js module and
// invoke its default export (the pgClient function). But where exactly should we do this?
//  The pool of connections to a database should be started when the server is started
// and then made available to all the resolver functions that are going to use it.

// This is a lot more efficient than connecting to the database from within resolver functions.
// The GraphQL.js implementation has a feature to help us make a pool of connections globally available to all resolvers. It’s called the context object.

// The special context object enables resolver functions to communicate and share
// information because it is passed to all of them (as their third argument). They can
// read it and write to it if needed. We only need a readable context for sharing the pool
// of database connections.

// You can pass any object as the context object to the graphql executor function or
// the graphqlHTTP listener function. The object that we need to make part of the global
// context here is the pgPool object that is returned by the pgClient function.
// Here are the changes we need in api/src/server.js to make the pgPool object available using the GraphQL context concept.

// IMPORTANT //

// Using a subset of fields in SQL

// Since we did a SELECT * operation, all fields available in the azdev.tasks table will be available on the parent source object in the Task type. However, only the properties represented by the defined fields will be available in the API. You can optimize the SQL statement to only include the fields that the API is interested in.
// For example:
// SELECT id, content, tags, approach_count, created_at FROM azdev.tasks
// WHERE ·-·-·

// Transforming field names

// In some cases, we need the API to represent columns and rows in the database with a different structure. Maybe the database has a confusing column name; or maybe we want the API to consistently use camel-case for all field names, and the database uses snake-case for its columns. This latter situation is exactly what we have to deal with next. Columns on the azdev.tasks table are snake-case in the database (for example, created_at), and we planned to represent all fields as camel-case in the API (createdAt). This means we cannot rely on the DEFAULT RESOLVERS as we did for the id and content fields.

// With camel-case fields, the default resolver tries to find the property createdAt on the row returned by the database. That property does not exist. That’s why we got an error when we tried to ask for createdAt.
// There are three main methods to deal with this issue.

// METHOD #2

// We can create custom resolvers for the fields that need to be converted. For example, we can change the createdAt field in listing 6.7 to include this resolve function.
