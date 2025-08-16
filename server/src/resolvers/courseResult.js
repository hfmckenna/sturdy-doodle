import { randomUUID } from 'crypto'

export default {
  CourseResult: {
    name: async (parent, args, context, info) => parent.name,
    score: async (parent, args, context, info) => parent.score,
    learnerId:  async (parent, args, context, info) => parent.learnerId
  },
  Query: {
    courseResults: async (parent, args, { db }, info) => {
      return db.get('courseResults').value()
    },
    courseResult: async (parent, { id }, { db }, info) => {
      return db.chain.get('courseResults').find({ id }).value()
    }
  },
  Mutation: {
    createCourseResult: async (parent, { name, score, learnerId }, { db }, info) => {
      const newCourse = { id: randomUUID(), name, score, learnerId }
      await db.update(({ courseResults }) => {
        courseResults.push(newCourse)
      })
      return newCourse
    },
    deleteCourseResult: async (parent, { id }, { db }, info) => {
      let deleted = false
      await db.update(({ courseResults }) => {
        const idx = courseResults.findIndex(c => c.id === id)
        if (idx !== -1) {
          courseResults.splice(idx, 1)
          deleted = true
        }
      })
      return deleted
    },
    updateCourseResult: async (parent, { id, name, score, learnerId }, { db }, info) => {
      let updated = null
      await db.update(({ courseResults }) => {
        const idx = courseResults.findIndex(c => c.id === id)
        if (idx !== -1) {
          const current = courseResults[idx]
          const next = {
            ...current,
            ...(name !== undefined ? { name } : {}),
            ...(score !== undefined ? { score } : {}),
            ...(learnerId !== undefined ? { learnerId } : {}),
          }
          courseResults[idx] = next
          updated = next
        }
      })
      return updated
    }
  }
}
