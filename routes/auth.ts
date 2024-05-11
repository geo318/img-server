import express from 'express'
import { ROUTES } from '/config'
import { userSchema } from '/schema'
import { ZodError } from 'zod'
import { db, user } from '/db'
import { DrizzleError } from 'drizzle-orm'
import { DatabaseError } from 'pg'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import env from '/env'
import { hashString } from '/utils'

const router = express.Router()

router.post(ROUTES.register, async (req, res) => {
  try {
    const newUser = userSchema.parse(req.body)
    await db
      .insert(user)
      .values({
        ...newUser,
        folder: newUser.name.replace(/\s/g, '-'),
        password: hashString(newUser.password),
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
    res.status(400).send(JSON.stringify(error))
  }
})

router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  (req, res) => {
    const { email } = req.body
    const token = jwt.sign({ username: email }, env.SECRET)

    res.json({ token })
  }
)

export default router
