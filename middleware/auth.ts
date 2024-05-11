import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { db } from '/db'
import type { User } from '/types'
import { hashString } from '/utils'
import env from '/env'

passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const authUser = await db.query.user.findFirst({
          where: (user, { eq }) => eq(user.email, email),
        })

        if (!authUser) return done(null, false, { message: 'User not found' })

        const passwordMatch = authUser.password === hashString(password)
        if (!passwordMatch) done(null, false, { message: 'Incorrect password' })

        done(null, authUser)
      } catch (error) {
        done(error, false)
      }
    }
  )
)

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.SECRET,
    },
    async (jwtPayload: string, done) => {
      try {
        const user = db.query.user
          .findFirst({
            where: (user, { eq }) => eq(user.id, Number(jwtPayload.sub)),
          })
          .execute()
        done(null, user)
      } catch (error) {
        done(error, false)
      }
    }
  )
)

passport.serializeUser((user: Partial<User>, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id: string, done) => {
  try {
    const authUser = await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.id, Number(id)),
    })
    done(null, authUser)
  } catch (err) {
    done(err, null)
  }
})
