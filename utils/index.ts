export { default as resizeImage } from './resize'
import { resizeImage } from '.'

export const addNewImage = (image: Express.Multer.File) => {
  const imageToResize = new resizeImage(image, 'assets/images', 'webp')
  imageToResize.save('paintings', 800)
  imageToResize.save('thumbnails', 20)
  const { paintings, thumbnails } = imageToResize.fullFilePath()
  return { fullSize: paintings, thumbnail: thumbnails }
}
