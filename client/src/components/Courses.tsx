import type {CourseResult} from "../models/domain.ts";
import { useMutation, useQuery } from "@apollo/client";
import { DELETE_COURSE_RESULT } from "../services/courseResult.ts";
import { GET_USERS } from "../services/user.ts";
import { useState } from "react";
import { CourseResultForm } from "./CourseResultForm.tsx";

export const Courses = ({courses}: { courses: CourseResult[] }) => {
    const { refetch } = useQuery(GET_USERS);
    const [deleteCourse] = useMutation(DELETE_COURSE_RESULT);
    const [editId, setEditId] = useState<string | null>(null);

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
                    <li key={cr.id ?? idx} style={{ marginBottom: 6 }}>
                        {editId === cr.id ? (
                            <CourseResultForm
                                course={cr}
                                onCancel={() => setEditId(null)}
                                onSubmitted={() => setEditId(null)}
                            />
                        ) : (
                            <>
                                <span>{cr.name}</span>: <span>{cr.score}</span>
                                <button style={{ marginLeft: 8 }} onClick={() => setEditId(cr.id ?? null)}>Edit</button>
                                <button style={{ marginLeft: 8 }} onClick={() => handleDelete(cr.id, cr.name)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
