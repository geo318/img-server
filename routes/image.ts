import express, { type Request, type Response } from 'express'
import { ROUTES } from '/config'
import { addNewImage } from '/utils'
import { db, image } from '/db'
import { uploadMiddleWare } from '/middleware/upload'
import { imgSchemaArray, secretSchema } from '/schema'
import { ZodError } from 'zod'
import fs from 'fs'
import path from 'path'
import { sql } from 'drizzle-orm'

const router = express.Router()

router.post(
  ROUTES.assets,
  uploadMiddleWare,
  async (req: Request, res: Response) => {
    try {
      const secret = secretSchema.parse(req.body.secret)

      const userWithSecret = await db.query.api.findFirst({
        where: (api, { eq }) => eq(api.secret, secret),
        with: { user: true },
      })

      if (!userWithSecret) {
        res.status(400).send({ error: 'Api secret you provided doesn`t exist' })
        return
      }

      /* Here is an example of how to use the execute method with a raw SQL query:
       *
       * const rowQ = await db.execute(
       *   sql`SELECT DISTINCT * FROM apis LEFT JOIN users ON apis.user_id = users.id WHERE secret = ${secret}`
       * )
       */

      const images = imgSchemaArray.parse(req.files)

      let imagePaths = []
      let imageValues = []
      for (const img of images) {
        const dest = `${userWithSecret?.user.folder}/${userWithSecret?.name}`
        const fullPath = await addNewImage(img, dest)
        fullPath['full'] = `${ROUTES.img}${fullPath['full']}`
        fullPath['thumb'] = `${ROUTES.img}${fullPath['thumb']}`
        imagePaths.push(fullPath)

        imageValues.push({
          alt: img.originalname,
          paths: fullPath,
          user_id: userWithSecret.user.id,
        })
      }

      // awaiting the execute method is not necessary not to block the event loop
      db.insert(image).values(imageValues).execute()

      res.send(imagePaths)
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).send({
          error: error.issues[0].message,
        })
      }

      res.status(500).send(JSON.stringify(error))
    }
  }
)

router.get(ROUTES.getCatchAllImgPath(), async (req, res) => {
  const name = req.url

  /*
   * using await here would block the event loop
   * and prevent the image from being served as fast as possible
   */

  // sometimes it feels simpler to use raw SQL queries
  db.execute(
    sql`UPDATE images SET views = views + 1 WHERE paths->>'full' = ${name}`
  ).execute()

  const basePath = __dirname.split('/').slice(0, -1).join('/')
  const imagePath = path.join(
    basePath,
    ROUTES.getStaticDir(),
    req.path.replace(ROUTES.img, '')
  )

  fs.readFile(imagePath, (err) => {
    if (err) res.status(404).send('Image not found')

    res.sendFile(imagePath)
  })
})

router.get(ROUTES.images, async (req, res) => {
  try {
    const secret = secretSchema.parse(req.query['secret'])

    const userWithSecret = await db.query.api.findFirst({
      where: (api, { eq }) => eq(api.secret, secret),
      with: { user: true },
    })

    if (!userWithSecret) {
      res.status(400).send({ error: 'Api secret you provided doesn`t exist' })
      return
    }

    const images = await db.query.image.findMany({
      where: (img, { eq }) => eq(img.user_id, userWithSecret.user.id),
    })

    res.send(images)
  } catch (error) {
    res.status(500).send(JSON.stringify(error))
  }
})

export default router
