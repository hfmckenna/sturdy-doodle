import {useQuery} from '@apollo/client';
import {useState} from 'react';
import {UserProfile} from "./components/UserProfile.tsx";
import {GET_USERS} from "./services/user.ts";
import type {User} from "./models/domain.ts";
import {UserForm} from "./components/UserForm.tsx";
import {Modal} from './components/Modal.tsx';
import styles from './UserView.module.css';

export const UserView = () => {
    const {loading, error, data} = useQuery(GET_USERS)
    const [showCreate, setShowCreate] = useState(false)
    if (loading) return <p>Loading...</p>
    if (error) return <p>Error!</p>
    const users: User[] = data?.users ?? []

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>User View</h1>
            <button className={styles.newUserButton} onClick={() => setShowCreate(true)}>New User</button>
            <Modal open={showCreate} title="Create User" onClose={() => setShowCreate(false)}>
                <UserForm onSubmitted={() => setShowCreate(false)} />
            </Modal>
            <ul className={styles.list}>
                {users.map((u: User) => <UserProfile key={u.id} user={u}/>)}
            </ul>
        </div>
    )
}
