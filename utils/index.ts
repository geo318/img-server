export { default as resizeImage } from './resize'
import { resizeImage } from '/utils'
import crypto from 'crypto'
import env from '/env'
import getSize from 'image-size'
import { ROUTES } from '/config'

export const addNewImage = async (
  image: Express.Multer.File,
  userFolder: string
) => {
  let [name, ext] = image.originalname.trim().replace(/\s/g, '-').split(/\.$/)
  name = `${name}-${new Date().getTime()}.${ext}`

  const imageToResize = new resizeImage<'full' | 'thumb'>(
    image,
    ROUTES.getStaticDir(),
    'webp',
    userFolder,
    name
  )
  const { width, height } = getSize(image.path || image.buffer)
  const imgWidth = width && width <= 2000 ? width : undefined
  const imgHeight = height && height <= 2000 ? height : undefined

  imageToResize.save('full', imgWidth, imgHeight)
  imageToResize.save('thumb', 10)

  const path = imageToResize.fullFilePath()
  return path
}

export const hashString = (password: string) => {
  const hashedString = crypto.createHmac('SHA256', env.SECRET).update(password)
  return hashedString.digest('hex')
}
