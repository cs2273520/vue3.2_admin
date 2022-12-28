import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login')
  },
  {
    path: '/',
    name: '/',
    component: () => import('../layout'),
    redirect: '/mechanism',
    children: [
      {
        path: '/mechanism',
        name: 'mechanism',
        component: () => import('@/views/mechanism/index.vue')
      },
      {
        path: '/mechanism1',
        name: 'mechanism1',
        component: () => import('@/views/mechanism1/index.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
