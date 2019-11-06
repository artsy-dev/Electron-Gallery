import { Router } from './electron-router/router';

// Be aware this uses a different new electron router and not the old router
export const router = new Router({
  default: {
    script: ({id}) => `../views/${id}.js`,
    title: ({id}) => id[0].toUpperCase() + id.substr(1).toLowerCase(),
    visible: ({depth}) => depth < 1,
    tagName: ({id}) => `${id}-page`,
    autoTitle: false
  },
  routes: {
    dashboard: {},
    gallery: {}
  }
})