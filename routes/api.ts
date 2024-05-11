import express from 'express'
import { ROUTES } from '/config'
import { db } from '/db'
import { sql } from 'drizzle-orm'
import { insertApiTokenSchema, selectUserSchema } from '/schema'
import passport from 'passport'

const router = express.Router()

router.get(
  ROUTES.api,
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const user = selectUserSchema.parse(req.user)
      const userTokens = await db.query.api.findMany({
        where: (api, { eq }) => eq(api.user_id, user.id),
      })
      res.send(JSON.stringify({ userTokens }))
    } catch (error) {
      res.status(500).send(JSON.stringify(error))
    }
  }
)

router.post(
  ROUTES.api,
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const user = selectUserSchema.parse(req.user)
      const { name, secret } = insertApiTokenSchema.parse(req.body)
      const names = await db.execute(
        sql`SELECT name FROM apis WHERE user_id = ${user.id}`
      )

      if (names.rows.some((n) => n?.['name'] === name)) {
        res
          .status(400)
          .send({ error: 'Api with this name already exists, choose another' })
        return
      }
      await db.execute(
        sql`INSERT INTO apis (name, secret, user_id) VALUES (${name}, ${secret}, ${user.id})`
      )
      res.send(secret)
    } catch (error) {
      res.status(500).send(JSON.stringify(error))
    }
  }
)

export default router
