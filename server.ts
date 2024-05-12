import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import env from '/env'
import routes from '/routes'
import passport from 'passport'
import '/middleware/auth'

const server = express()

server.use(passport.initialize())
server.use(bodyParser.json())
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
server.use(routes)

const port = env.PORT
server.listen(port, () => console.log(`Server started on port ${port}`))
