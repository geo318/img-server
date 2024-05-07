import express from 'express'
import { ROUTES } from '/config'

const router = express.Router()

router.get(ROUTES.index, async (_, res) => {
  res.send('Hello My Api!')
})

export default router
