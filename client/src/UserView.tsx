import {useQuery} from '@apollo/client';
import {UserProfile} from "./components/UserProfile.tsx";
import {GET_USERS} from "./services/user.ts";
import type {User} from "./models/domain.ts";

export const UserView = () => {
    const {loading, error, data} = useQuery(GET_USERS)
    console.log(error)
    if (loading) return <p>Loading...</p>
    if (error) return <p>Error!</p>
    const users: User[] = data?.users ?? []

    return (
        <div style={{padding: 16}}>
            <h1>User View</h1>
            <ul>
                {users.map((u: User) => <UserProfile key={u.id} user={u}/>)}
            </ul>
        </div>
    )
}
