import type {CourseResult} from "../models/domain.ts";
import { useMutation, useQuery } from "@apollo/client";
import { DELETE_COURSE_RESULT } from "../services/courseResult.ts";
import { GET_USERS } from "../services/user.ts";
import { useState } from "react";
import { CourseResultForm } from "./CourseResultForm.tsx";
import styles from './Courses.module.css';

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
        <div className={styles.container}>
            <div className={styles.header}>Course Results</div>
            <ul className={styles.list}>
                {courses.map((cr, idx) => (
                    <li key={cr.id ?? idx} className={styles.listItem}>
                        {editId === cr.id ? (
                            <CourseResultForm
                                course={cr}
                                onCancel={() => setEditId(null)}
                                onSubmitted={() => setEditId(null)}
                            />
                        ) : (
                            <>
                                <span>{cr.name}</span>: <span>{cr.score}</span>
                                <button className={styles.editBtn} onClick={() => setEditId(cr.id ?? null)}>Edit</button>
                                <button className={styles.deleteBtn} onClick={() => handleDelete(cr.id, cr.name)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
