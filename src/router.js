import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      name: 'Login',
      path: '/login',
      component: () => import('@/views/auth/UserLogin'),
    },
    {
      path: '/',
      component: () => import('@/views/dashboard/Index'),
      children: [
        // Dashboard
        {
          name: 'Dashboard',
          path: '',
          component: () => import('@/views/wash/pages/ManageWash'),
          meta: { requiresAuth: true }, // Add this meta field for protected routes
        },
        {
          name: 'WashInvoice',
          path: '/invoice',
          component: () => import('@/views/wash/pages/WashInvoice'),
          meta: { requiresAuth: true }, // Add this meta field for protected routes
        },
        // Pages
        {
          name: 'StaffProfile',
          path: 'pages/staff/:id',
          component: () => import('@/views/staff/pages/StaffProfile'),
          meta: { requiresAuth: true },
        },
        
        {
          name: 'User Profile',
          path: 'pages/user',
          component: () => import('@/views/dashboard/pages/UserProfile'),
          meta: { requiresAuth: true },
        },
        {
          name: 'Manage Staff',
          path: 'pages/staff',
          component: () => import('@/views/staff/pages/ManageStaff'),
          meta: { requiresAuth: true },
        },
        {
          name: 'Manage Customer',
          path: 'pages/customer',
          component: () => import('@/views/customer/pages/Dashboard'),
          meta: { requiresAuth: true },
        },
        {
          name: 'CustomerProfile',
          path: 'pages/customer/:id',
          component: () => import('@/views/customer/pages/CustomerProfile'),
          meta: { requiresAuth: true },
        },
        {
          name: 'Plan View',
          path: 'pages/plans',
          component: () => import('@/views/plans/pages/PlanView'),
          meta: { requiresAuth: true },
        },
        {
          name: 'Order View',
          path: 'pages/orders',
          component: () => import('@/views/orders/pages/OrdersView'),
          meta: { requiresAuth: true },
        },
      ],
    },
  ],
})
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // Check if the user is logged in
    if (store.getters.isLoggedIn) {
      next(); // Proceed to the route
    } else {
      // Redirect to the login page if not logged in
      next('/login');
    }
  } else {
    // If the user is already logged in and tries to access the login page, redirect to the dashboard
    if (to.name === 'Login' && store.getters.isLoggedIn) {
      next('/'); // Redirect to the dashboard
    } else {
      next(); // Continue to other routes
    }
  }
});
export default router;
