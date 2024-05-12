import multer from 'multer'

const storage = multer.diskStorage({
  destination: './public/originals/',
  filename: (_, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.trim().replace(/\s/g, '-')}`),
})

const MAX_COUNT = 10
const MAX_SIZE = 10 * 1024 * 1024

export const uploadMiddleWare = multer({
  storage: storage,
  limits: { fileSize: MAX_COUNT * MAX_SIZE },
}).any()