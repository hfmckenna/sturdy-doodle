import {useMutation, useQuery} from "@apollo/client";
import {CREATE_USER, GET_USERS} from "../services/user.ts";

export const UserForm = () => {
    const {refetch} = useQuery(GET_USERS)
    const [createUser] = useMutation(CREATE_USER)
    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget
        const formData = new FormData(form)
        const firstName = String(formData.get('firstName') || '')
        const lastName = String(formData.get('lastName') || '')
        const email = String(formData.get('email') || '')
        if (!firstName || !lastName || !email) return
        await createUser({variables: {firstName, lastName, email}})
        form.reset()
        await refetch()
    }

    return <form onSubmit={handleCreate} style={{display: 'flex', gap: 8, marginBottom: 16}}>
        <input name="firstName" placeholder="First name"/>
        <input name="lastName" placeholder="Last name"/>
        <input name="email" placeholder="Email" type="email"/>
        <button type="submit">Add User</button>
    </form>
}