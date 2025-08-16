import {gql} from "@apollo/client";

export const CREATE_COURSE_RESULT = gql`
    mutation CreateCourseResult($name: String!, $score: Int!, $learnerId: ID!) {
        createCourseResult(name: $name, score: $score, learnerId: $learnerId) {
            id
            name
            score
            learnerId
        }
    }
`

export const DELETE_COURSE_RESULT = gql`
    mutation DeleteCourseResult($id: ID!) {
        deleteCourseResult(id: $id)
    }
`

export const UPDATE_COURSE_RESULT = gql`
    mutation UpdateCourseResult($id: ID!, $name: String!, $score: Int!) {
        updateCourseResult(id: $id, name: $name, score: $score) {
            id
            name
            score
            learnerId
        }
    }
`
