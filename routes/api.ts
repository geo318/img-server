import express from 'express'
import { ROUTES } from '/config'
import { api, db } from '/db'
import { sql } from 'drizzle-orm'
import { insertApiTokenSchema } from '/schema'

const router = express.Router()

router.get(ROUTES.api, async (_, res) => {
  const newUser = await db.select().from(api).execute()
  res.send(JSON.stringify(newUser))
})

router.post(ROUTES.api, async (req, res) => {
  try {
    const { name, user_id, secret } = insertApiTokenSchema.parse(req.body)
    const names = await db.execute(
      sql`SELECT name FROM apis WHERE user_id = ${user_id}`
    )

    if (names.rows.some((n) => n?.['name'] === name)) {
      res
        .status(400)
        .send({ error: 'Api with this name already exists, choose another' })
      return
    }
    await db.execute(
      sql`INSERT INTO apis (name, secret, user_id) VALUES (${name}, ${secret}, ${user_id})`
    )
    res.send('new api token created')
  } catch (error) {
    res.status(500).send(JSON.stringify(error))
  }
})

export default router
