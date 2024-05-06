import express from 'express'

export const ROUTES = ['/register', '/login', '/logout', '/profile', '/images']

const app = express()

app.get('/', (_, res) => {
  res.send('Hello World!')
})
