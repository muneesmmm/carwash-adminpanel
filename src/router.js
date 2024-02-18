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


        // Pages
        {
          name: 'StaffProfile',
          path: 'pages/staff/:id',
          component: () => import('@/views/staff/pages/StaffProfile'),
        },
        
        {
          name: 'User Profile',
          path: 'pages/user',
          component: () => import('@/views/dashboard/pages/UserProfile'),
        },
        {
          name: 'Manage Staff',
          path: 'pages/staff',
          component: () => import('@/views/staff/pages/ManageStaff'),
        },
        {
          name: 'Manage Customer',
          path: 'pages/customer',
          component: () => import('@/views/customer/pages/Dashboard'),
        },
        {
          name: 'CustomerProfile',
          path: 'pages/customer/:id',
          component: () => import('@/views/customer/pages/CustomerProfile'),
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
