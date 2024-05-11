import homeRouter from './home'
import apiRouter from './api'
import imgRouter from './image'
import authRouter from './auth'
import express from 'express'

const routes = express.Router()

routes.use(homeRouter)
routes.use(apiRouter)
routes.use(imgRouter)
routes.use(authRouter)

export default routes
