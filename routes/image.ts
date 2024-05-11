import express, { type Request, type Response } from 'express'
import { ROUTES } from '/config'
import multer from 'multer'
import { addNewImage } from '/utils'
import { db } from '/db'
import { z } from 'zod'

const router = express.Router()

const storage = multer.diskStorage({
  destination: './public/originals/',
  filename: (_, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.trim().replace(/\s/g, '-')}`),
})
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
})

router.post(
  ROUTES.assets,
  upload.single('img'),
  async (req: Request, res: Response) => {
    const secret = z.string().regex(/.{16}/).parse(req.body.secret)
    const userWithSecret = await db.query.api.findFirst({
      where: (api, { eq }) => eq(api.secret, secret),
      with: {
        user: true,
      },
    })
    const image = req.file
    if (!image) {
      res.status(400).send('No file uploaded.')
      return
    }
    const imagePaths = addNewImage(
      image,
      `${userWithSecret?.user.folder}/${userWithSecret?.name}`
    )
    res.send(imagePaths)
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
