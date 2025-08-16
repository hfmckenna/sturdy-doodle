import GraphQLJSON from 'graphql-type-json'
import pkg from 'graphql-iso-date'
import userResolvers from './user.js'
import courseResultResolvers from './courseResult.js'

// This is required due to the package being set as a module for LowDB
const { GraphQLDate, GraphQLTime, GraphQLDateTime } = pkg;

/*
  This allows us to use JSON/Date/Time/DateTime types when returning data from GraphQL
 */
const customScalarResolver = {
  JSON: GraphQLJSON,
  Date: GraphQLDate,
  Time: GraphQLTime,
  DateTime: GraphQLDateTime
}

export default [
  customScalarResolver,
  userResolvers,
  courseResultResolvers
]