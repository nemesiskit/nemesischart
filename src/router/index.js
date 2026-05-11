import { createRouter, createWebHashHistory } from 'vue-router'

const Playground = () => import('../views/Playground.vue')
const Dashboard = () => import('../views/Dashboard.vue')
const Docs = () => import('../views/Docs.vue')

const routes = [
  { path: '/', redirect: '/playground' },
  { path: '/playground', name: 'playground', component: Playground, meta: { titulo: 'Playground' } },
  { path: '/dashboard', name: 'dashboard', component: Dashboard, meta: { titulo: 'Dashboard Dinâmico' } },
  { path: '/docs', name: 'docs', component: Docs, meta: { titulo: 'Documentação' } },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
