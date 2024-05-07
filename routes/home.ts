import express from 'express'
import { ROUTES } from '/config'
import { db, user } from '/db'
import { password } from 'bun'

const router = express.Router()

router.get(ROUTES.index, async (_, res) => {
  const newUser = await db.insert(user).values({
    name: 'John Doe',
    email: 'geo.lomidze@gmail.com',
    password: await password.hash('123456'),
    folder: 'new-folder',
  })
  res.send(JSON.stringify(newUser))
})

export default router
