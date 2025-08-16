import gql from 'graphql-tag'

export default gql`
    extend type Query {
        courseResults: [CourseResult!]
        courseResult(id: ID!): CourseResult
    }

    # This allows us to query Users->CourseResults
    extend type User {
        courseResults: [CourseResult!]!
    }

    type CourseResult {
        id: String!
        name: String!
        score: Int!
        learnerId: ID!
    }

    # ToDo: Implement CRUD mutations
    extend type Mutation {
        createCourseResult(name: String!, score: Int!, learnerId: ID!): CourseResult
        deleteCourseResult(id: ID!): Boolean
        updateCourseResult(id: ID!, name: String!, score: Int!): CourseResult
    }
`
