import sharp, { type AvailableFormatInfo, type FormatEnum } from 'sharp'
import path from 'path'
import fs from 'fs'

export default class SharpResize<TFolder extends string = string> {
  constructor(
    file: Express.Multer.File,
    rootFolder: string,
    ext: keyof FormatEnum | AvailableFormatInfo,
    subFolder?: string,
    name = 'image.webp',
    width?: number,
    height?: number
  ) {
    this.file = file
    this.rootFolder = rootFolder
    this.subFolder = subFolder
    this.width = width
    this.height = height
    this.ext = ext
    this.name = name
    this.index++
  }

  private sharper() {
    const file = this.file
    if (file.buffer instanceof Buffer) {
      return sharp(Buffer.from(file.buffer))
    } else {
      return sharp(file.path)
    }
  }

  resize(width?: number, height?: number) {
    return this.sharper().resize(
      this.width || width || 1000,
      this.height || height || null
    )
  }

  reformat(format = this.ext, width?: number, height?: number) {
    this.name = this.name.replace(/\.\w+$/, `.${format}`)
    return this.resize(width, height)
      .toFormat(format, {
        force: true,
      })
      .webp({ quality: 90, force: true })
  }

  save(
    subSubFolder = this.index.toString() as TFolder,
    width?: number,
    height?: number,
    format?: typeof this.ext
  ) {
    this.subFolder ??= subSubFolder

    const dir = `${this.rootFolder}/${this.subFolder}/${subSubFolder}`

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(`.${dir}`, { recursive: true })
    }
    
    this.reformat(format, width, height).toFile(
      path.join(dir.slice(1), this.name || 'name'),
      (err) => {
        if (err) return `Error resizing image ${err}`
      }
    )

    this.paths[subSubFolder] = `/${this.subFolder}/${subSubFolder}/${this.name}`
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
  private index = 0
  private paths = {} as Record<TFolder, string>
}
