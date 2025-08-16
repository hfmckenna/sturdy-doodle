import {randomUUID} from 'crypto'

export default {
    User: {
        firstName: async (parent, args, context, info) => parent.firstName,
        lastName: async (parent, args, context, info) => parent.lastName,
        email: async (parent, args, context, info) => parent.email,
        courseResults: async (parent, args, {db}, info) => {
            return db.chain.get('courseResults').filter({learnerId: parent.id}).value()
        }
    },
    Query: {
        users: async (parent, args, {db}, info) => {
            return db.chain.get('users').value()
        },
        user: async (parent, {id}, {db}, info) => {
            return db.chain.get('users').getById(id).value()
        }
    },
    Mutation: {
        createUser: async (parent, {lastName, email}, {db}, info) => {
            const newUser = {
                id: randomUUID(),
                firstName,
                lastName,
                email
            }
            db.update(({users}) => users.push(newUser))

            return newUser
        },
        deleteUser: async (parent, {id}, {db}, info) => {
            const existing = db.chain.get('users')
            if (!existing) return false
            db.update(({users}) => {
                const idx = users.findIndex(u => u.id === id)
                if (idx !== -1) users.splice(idx, 1)
            })
            return true
        },
        updateUser: async (parent, {id, firstName, lastName, email}, {db}, info) => {
            // ToDo: Update user
        }
    }
}
