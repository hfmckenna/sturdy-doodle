import {useMutation, useQuery} from "@apollo/client";
import {DELETE_USER, GET_USERS} from "../services/user.ts";
import type {User} from "../models/domain.ts";
import {Courses} from "./Courses.tsx";
import {UserForm} from "./UserForm.tsx";
import {CourseResultForm} from "./CourseResultForm.tsx";
import styles from './UserProfile.module.css';

export const UserProfile = ({user}: { user: User }) => {
    const {refetch} = useQuery(GET_USERS)
    const [deleteUser] = useMutation(DELETE_USER)
    const handleDelete = async (id: string) => {
        await deleteUser({variables: {id}})
        await refetch()
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
                    <details className={styles.details}>
                        <summary className={styles.summary}>Edit User</summary>
                        <div className={styles.details}>
                            <UserForm user={user}/>
                        </div>
                    </details>
                </div>
                <div className={styles.actions}>
                    <button onClick={() => handleDelete(user.id)}>Delete</button>
                </div>
            </div>
        </li>)
}