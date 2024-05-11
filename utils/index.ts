export { default as resizeImage } from './resize'
import { resizeImage } from '.'
import crypto from 'crypto'
import env from '/env'

export const addNewImage = (image: Express.Multer.File) => {
  const imageToResize = new resizeImage(image, 'assets/images', 'webp')
  imageToResize.save('paintings', 800)
  imageToResize.save('thumbnails', 20)
  const { paintings, thumbnails } = imageToResize.fullFilePath()
  return { fullSize: paintings, thumbnail: thumbnails }
}

export const hashString = (password: string) => {
  const hashedString = crypto.createHmac('SHA256', env.SECRET).update(password)
  return hashedString.digest('hex')
}
