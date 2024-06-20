export const ROUTES = {
  index: '/',
  api: '/api',
  img: '/img',
  images: '/images',
  login: '/login',
  logout: '/logout',
  assets: '/assets',
  register: '/register',
  dashboard: '/dashboard',
  getStaticDir: function () {
    return `${this.assets}/images`
  },
  getCatchAllImgPath: function () {
    return `${this.img}/*`
  },
} as const
