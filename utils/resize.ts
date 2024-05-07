import sharp, { type AvailableFormatInfo, type FormatEnum } from 'sharp'
import path from 'path'
import fs from 'fs'

export default class SharpResize {
  constructor(
    file: Express.Multer.File,
    rootFolder: string,
    ext?: keyof FormatEnum | AvailableFormatInfo,
    subFolder?: string,
    name?: string,
    width?: number,
    height?: number
  ) {
    this.file = file
    this.rootFolder = rootFolder
    this.subFolder = subFolder
    this.width = width
    this.height = height
    this.ext = ext
    this.name = name || this.file.originalname.trim().replace(/\s/g, '-')
    this.index++
  }

  private sharper() {
    return sharp(this.file.path)
  }

  resize(width?: number, height?: number) {
    return this.sharper().resize(
      this.width || width || 1000,
      this.height || height || null
    )
  }

  reformat(format?: typeof this.ext, width?: number, height?: number) {
    return this.resize(width, height)
      .toFormat(format || this.ext || 'webp')
      .webp({ quality: 100, force: true })
  }

  save(
    subFolder?: string,
    width?: number,
    height?: number,
    format?: typeof this.ext
  ) {
    this.subFolder = subFolder || this.index.toString()
    const dir = `./${this.rootFolder}/${this.subFolder || this.index}`

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

    this.reformat(format, width, height).toFile(
      path.join(dir, this.name),
      (err) => {
        if (err) return `Error resizing image ${err}`
      }
    )
    this.paths[this.subFolder || this.index] = `/${this.subFolder}/${this.name}`
  }

  fullFilePath() {
    return this.paths
  }

  private file
  private height
  private rootFolder
  private subFolder
  private width
  private ext
  private name
  private index: number = 0
  private paths: {
    [key: string | number]: string
  } = {}
}
