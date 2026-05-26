import { createRouter, createWebHashHistory } from 'vue-router'
import { getToken } from '@/utils/storage'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import('@/views/Home.vue'),
      meta: { title: '首页', tabIndex: 0, keepAlive: true },
    },
    {
      path: '/categories',
      name: 'Categories',
      component: () => import('@/views/Categories.vue'),
      meta: { title: '分类', tabIndex: 1, keepAlive: true },
    },
    {
      path: '/bookshelf',
      name: 'Bookshelf',
      component: () => import('@/views/Bookshelf.vue'),
      meta: { title: '书架', tabIndex: 2, keepAlive: true },
    },
    {
      path: '/user',
      name: 'User',
      component: () => import('@/views/User.vue'),
      meta: { title: '我的', tabIndex: 3 },
    },
    {
      path: '/novel/:id',
      name: 'NovelDetail',
      component: () => import('@/views/NovelDetail.vue'),
      meta: { title: '书籍详情' },
    },
    {
      path: '/reader/:novelId/:chapterNumber?',
      name: 'Reader',
      component: () => import('@/views/Reader.vue'),
      meta: { title: '阅读', fullscreen: true },
    },
    {
      path: '/search',
      name: 'Search',
      component: () => import('@/views/Search.vue'),
      meta: { title: '搜索' },
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: { title: '登录' },
    },
  ],
})

// Navigation guard: redirect to login only if explicitly required by meta
// We don't block navigation to bookshelf - just show a prompt there
router.beforeEach((to, _from, next) => {
  if (to.meta.title) {
    document.title = String(to.meta.title) + ' - 番茄阅读'
  }
  next()
})

export default router
