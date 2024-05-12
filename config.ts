export const ROUTES = {
  index: '/',
  api: '/api',
  img: '/img',
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
