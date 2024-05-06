import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import env from './env'

const server = express()

server.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  })
)
server.use(bodyParser.json())
server.use(express.static('assets/images'))

const port = env.PORT

server.listen(port, () => console.log(`Server started on port ${port}`))
