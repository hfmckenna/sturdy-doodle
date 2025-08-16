import type {CourseResult} from "../models/domain.ts";
import { useMutation, useQuery } from "@apollo/client";
import { DELETE_COURSE_RESULT } from "../services/courseResult.ts";
import { GET_USERS } from "../services/user.ts";

export const Courses = ({courses}: { courses: CourseResult[] }) => {
    const { refetch } = useQuery(GET_USERS);
    const [deleteCourse] = useMutation(DELETE_COURSE_RESULT);

    const handleDelete = async (id?: string, name?: string) => {
        if (!id) return; // cannot delete without id
        const ok = window.confirm(`Are you sure you want to delete the course "${name || ''}"?`);
        if (!ok) return;
        await deleteCourse({ variables: { id } });
        await refetch();
    };

    return (
        <div style={{marginTop: 8}}>
            <div style={{fontWeight: 600}}>Course Results</div>
            <ul style={{margin: '4px 0 0 16px', padding: 0}}>
                {courses.map((cr, idx) => (
                    <Course key={cr.id ?? idx} course={cr} onDelete={handleDelete} />
                ))}
            </ul>
        </div>
    );
}

export const Course = ({course, onDelete}: { course: CourseResult, onDelete: (id?: string, name?: string) => void }) => (
    <li>
        <span>{course.name}</span>: <span>{course.score}</span>
        <button style={{ marginLeft: 8 }} onClick={() => onDelete(course.id, course.name)}>Delete</button>
    </li>
)
