import express, { type Request, type Response } from 'express'
import { ROUTES } from '/config'
import { addNewImage } from '/utils'
import { db } from '/db'
import { uploadMiddleWare } from '/middleware/upload'
import { imgSchemaArray, secretSchema } from '/schema'
import { ZodError } from 'zod'

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
       */

      const images = imgSchemaArray.parse(req.files)

      let imagePaths = []
      for (const img of images) {
        const dest = `${userWithSecret?.user.folder}/${userWithSecret?.name}`
        const fullPath = addNewImage(img, dest)
        imagePaths.push(fullPath)
      }

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

router.get(ROUTES.image, async (req, res) => {
  const params = new URLSearchParams(req.url.split('?')[1])
  const name = req.url.split('/').at(-1)?.split('?')[0]
  const folder = params.get('id')
  const width = params.get('width')
  const height = params.get('height')
  res.send(JSON.stringify([name, folder, width, height]))
})

export default router
