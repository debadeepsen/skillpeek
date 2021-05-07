import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/companies',
    name: 'Companies',
    component: () => import('../views/Companies.vue')
  },
  {
    path: '/company/profile/:id',
    name: 'Company',
    component: () => import('../views/CompanyProfile.vue')
  },
  {
    path: '/job/:id',
    name: 'Job',
    component: () => import('../views/JobDetails.vue')
  },
  {
    path: '/search/results',
    name: 'Job',
    component: () => import('../views/SearchResults.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
