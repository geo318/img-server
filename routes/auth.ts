import express from 'express'
import { ROUTES } from '/config'
import { userSchema } from '/schema'
import { ZodError } from 'zod'
import { db, user } from '/db'
import { DrizzleError } from 'drizzle-orm'
import { DatabaseError } from 'pg'

const router = express.Router()

router.post(ROUTES.register, async (req, res) => {
  try {
    const newUser = userSchema.parse(req.body)
    await db
      .insert(user)
      .values({
        ...newUser,
        folder: newUser.name.replace(/\s/g, '-'),
      })
      .execute()
    res.send({ message: 'Registered successfully', newUser })
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).send({ error: error.issues })
    }
    if (error instanceof DatabaseError) {
      res.status(400).send({
        error: error.detail
          ?.replace(/(Key\s)|\(|\=/g, '')
          ?.replace(/\)/, ' ')
          ?.replace(/\)/, ''),
      })
    }
    if (error instanceof DrizzleError) {
      res.status(400).send({ error: error.message })
    }
    res.status(400).send({ error })
  }
})

export default router
