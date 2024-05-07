import express from 'express'
import { ROUTES } from '/config'
import { api, db } from '/db'
import crypto from 'crypto'

const router = express.Router()

router.get(ROUTES.api, async (_, res) => {
  const newUser = await db.select().from(api).execute()
  res.send(JSON.stringify(newUser))
})

router.post(ROUTES.api, async (req, res) => {
  const { name, user_id } = req.body
  //implement zod validation here

  const secret = crypto.randomBytes(8).toString('hex')
  try {
    await db
      .insert(api)
      .values({
        name,
        secret,
        user_id,
      })
      .execute()

    res.send('token created')
  } catch (error) {
    res.status(500).send(JSON.stringify(error))
  }
})

export default router
