import multer from 'multer'

const MAX_COUNT = 10
const MAX_SIZE = 10 * 1024 * 1024

export const uploadMiddleWare = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_COUNT * MAX_SIZE },
}).array('images')