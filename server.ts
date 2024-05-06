import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import env from './env'
import { homeRouter } from './routes'

const server = express()

server.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  })
)
server.use(bodyParser.json())
server.use(express.static('assets/images'))
server.use(homeRouter)

const port = env.PORT

server.listen(port, () => console.log(`Server started on port ${port}`))
