import { gql } from "@apollo/client";

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
