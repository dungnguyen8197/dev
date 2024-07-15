import Layout from '@/layout'

const revenueSaleRouter = {
  path: '/revenue-sale',
  component: Layout,
  name: 'Booking',
  meta: {
    title: 'Quản lý doanh thu sale',
    icon: 'el-icon-collection',
    roles: ['role_master', 'role_admin', 'role_super_admin', 'role_tee_time', 'role_cs', 'role_statistic']
  },
  // component: () => import('@/views/manage-booking/revenue-sale'),
  children: [
    {
      path: 'list',
      component: () => import('@/views/manage-booking/revenue-sale/List'),
      name: 'Quản lý doanh thu sale',
      meta: { title: 'Quản lý doanh thu sale' }
      // BOSS ONLY
    }
  ]
}
export default revenueSaleRouter
