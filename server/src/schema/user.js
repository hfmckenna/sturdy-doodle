import gql from 'graphql-tag'

export default gql`
    extend type Query {
        users: [User!]
        user(id: ID!): User!
    }

    type User {
        id: ID
        firstName: String
        lastName: String
        email: String
    }

    extend type Mutation {
        createUser(firstName: String!, lastName: String!, email: String!): User
        deleteUser(id: ID!): Boolean
        updateUser(id: ID!, firstName: String, lastName: String, email: String): User
    }
`
