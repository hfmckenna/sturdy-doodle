import {useQuery} from '@apollo/client';
import {UserProfile} from "./components/UserProfile.tsx";
import {GET_USERS} from "./services/user.ts";
import type {User} from "./models/domain.ts";
import {UserForm} from "./components/UserForm.tsx";

export const UserView = () => {
    const {loading, error, data} = useQuery(GET_USERS)
    console.log(error)
    if (loading) return <p>Loading...</p>
    if (error) return <p>Error!</p>
    const users: User[] = data?.users ?? []

    return (
        <div style={{padding: 16}}>
            <h1>User View</h1>
            <UserForm/>
            <ul>
                {users.map((u: User) => <UserProfile key={u.id} user={u}/>)}
            </ul>
        </div>
    )
}
