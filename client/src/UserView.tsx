import {useQuery} from '@apollo/client';
import {UserProfile} from "./components/UserProfile.tsx";
import {GET_USERS} from "./services/user.ts";
import type {User} from "./models/domain.ts";
import {UserForm} from "./components/UserForm.tsx";
import styles from './UserView.module.css';

export const UserView = () => {
    const {loading, error, data} = useQuery(GET_USERS)
    if (loading) return <p>Loading...</p>
    if (error) return <p>Error!</p>
    const users: User[] = data?.users ?? []

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>User View</h1>
            <UserForm/>
            <ul className={styles.list}>
                {users.map((u: User) => <UserProfile key={u.id} user={u}/>)}
            </ul>
        </div>
    )
}
