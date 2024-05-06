import express from 'express'
import { ROUTES } from '/config'

const router = express.Router()

router.get(ROUTES.index, (_, res) => {
  res.send('Hello World!')
})

export default router