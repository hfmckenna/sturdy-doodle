import {useMutation, useQuery} from "@apollo/client";
import {CREATE_USER, GET_USERS, UPDATE_USER} from "../services/user.ts";
import type { User } from "../models/domain.ts";

export const UserForm = ({ user }: { user?: User }) => {
    const {refetch} = useQuery(GET_USERS)
    const [createUser] = useMutation(CREATE_USER)
    const [updateUser] = useMutation(UPDATE_USER)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget
        const formData = new FormData(form)
        const firstName = String(formData.get('firstName') || '')
        const lastName = String(formData.get('lastName') || '')
        const email = String(formData.get('email') || '')
        if (!firstName || !lastName || !email) return

        if (user) {
            await updateUser({ variables: { id: user.id, firstName, lastName, email } })
        } else {
            await createUser({ variables: { firstName, lastName, email } })
            form.reset()
        }
        await refetch()
    }

    return <form onSubmit={handleSubmit} style={{display: 'flex', gap: 8, marginBottom: 16}}>
        <input name="firstName" placeholder="First name" defaultValue={user?.firstName}/>
        <input name="lastName" placeholder="Last name" defaultValue={user?.lastName}/>
        <input name="email" placeholder="Email" type="email" defaultValue={user?.email}/>
        <button type="submit">{user ? 'Update User' : 'Add User'}</button>
    </form>
}