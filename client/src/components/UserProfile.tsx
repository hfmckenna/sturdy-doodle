import {useMutation, useQuery} from "@apollo/client";
import {DELETE_USER, GET_USERS} from "../services/user.ts";
import type {User} from "../models/domain.ts";
import {Courses} from "./Courses.tsx";
import {UserForm} from "./UserForm.tsx";
import {CourseResultForm} from "./CourseResultForm.tsx";
import {useState} from 'react';
import {Modal} from './Modal.tsx';
import styles from './UserProfile.module.css';

export const UserProfile = ({user}: { user: User }) => {
    const {refetch} = useQuery(GET_USERS)
    const [deleteUser] = useMutation(DELETE_USER)
    const [showEdit, setShowEdit] = useState(false)

    const handleDelete = async (id: string) => {
        const ok = window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)
        if (!ok) return;
        await deleteUser({variables: {id}})
        await refetch()
        setShowEdit(false)
    }
    return (
        <li key={user.id} className={styles.item}>
            <div className={styles.row}>
                <div>
                    <strong>{user.firstName} {user.lastName}</strong>
                    <div>{user.email}</div>
                    {user.courseResults && user.courseResults.length > 0 && (
                        <Courses courses={user.courseResults}/>
                    )}
                    {/* Always show add form so user can add results even if none exist yet */}
                    <CourseResultForm learnerId={user.id}/>
                </div>
                <div className={styles.actions}>
                    <button onClick={() => setShowEdit(true)}>Edit User</button>
                </div>
            </div>
            <Modal open={showEdit} title="Edit User" onClose={() => setShowEdit(false)}>
                <UserForm user={user} onSubmitted={() => setShowEdit(false)} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                    <button onClick={() => handleDelete(user.id)}>Delete</button>
                </div>
            </Modal>
        </li>)
}