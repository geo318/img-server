import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import env from './env'
import { apiRouter, homeRouter } from './routes'

const server = express()

server.use(bodyParser.json());
server.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
server.use(
  cors({
    origin: ['*'],
    credentials: true,
  })
)
server.use(express.static('assets/images'))
server.use(homeRouter)
server.use(apiRouter)
const port = env.PORT

server.listen(port, () => console.log(`Server started on port ${port}`))
