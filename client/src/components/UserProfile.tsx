import {useMutation, useQuery} from "@apollo/client";
import {DELETE_USER, GET_USERS} from "../services/user.ts";
import type {User} from "../models/domain.ts";
import {Courses} from "./Courses.tsx";
import {UserForm} from "./UserForm.tsx";

export const UserProfile = ({user}: { user: User }) => {
    const {refetch} = useQuery(GET_USERS)
    const [deleteUser] = useMutation(DELETE_USER)
    const handleDelete = async (id: string) => {
        await deleteUser({variables: {id}})
        await refetch()
    }
    return (
        <li key={user.id} style={{border: '1px solid #ddd', margin: '8px 0', padding: 8}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div>
                    <strong>{user.firstName} {user.lastName}</strong>
                    <div>{user.email}</div>
                    {user.courseResults && user.courseResults.length > 0 && (
                        <Courses courses={user.courseResults}/>
                    )}
                    <details style={{marginTop: 8}}>
                        <summary style={{cursor: 'pointer'}}>Edit</summary>
                        <div style={{marginTop: 8}}>
                            <UserForm user={user} />
                        </div>
                    </details>
                </div>
                <div>
                    <button onClick={() => handleDelete(user.id)}>Delete</button>
                </div>
            </div>
        </li>)
}