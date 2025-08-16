import type {CourseResult} from "../models/domain.ts";

export const Courses = ({courses}: { courses: CourseResult[] }) => <div style={{marginTop: 8}}>
    <div style={{fontWeight: 600}}>Course Results</div>
    <ul style={{margin: '4px 0 0 16px', padding: 0}}>
        {courses.map((cr, idx) => (
            <Course key={idx} course={cr}/>
        ))}
    </ul>
</div>

export const Course = ({course}: { course: CourseResult }) => <li>
    <span>{course.name}</span>: <span>{course.score}</span>
</li>
