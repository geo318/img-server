export { default as resizeImage } from './resize'
import { resizeImage } from '/utils'
import crypto from 'crypto'
import env from '/env'

export const addNewImage = (image: Express.Multer.File, userFolder: string) => {
  let [name, ext] = image.originalname.trim().replace(/\s/g, '-').split(/\./)
  name = `${name}-${new Date().getTime()}.${ext}`

  const imageToResize = new resizeImage(
    image,
    'assets/images',
    'webp',
    undefined,
    name
  )
  imageToResize.save(userFolder, 1500)
  const path = imageToResize.fullFilePath()
  return path
}

export const hashString = (password: string) => {
  const hashedString = crypto.createHmac('SHA256', env.SECRET).update(password)
  return hashedString.digest('hex')
}
