import express from 'express'
import passport from 'passport'
import './auth'
const server = express()

server.use(passport.initialize())