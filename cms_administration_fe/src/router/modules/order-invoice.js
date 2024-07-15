import Layout from '@/layout'

const bookingRouter = {
  path: '/order-invoice',
  component: Layout,
  //   redirect: 'list',
  name: '',
  meta: {
    // roles: ['role_master', 'role_admin', 'role_super_admin', 'role_tee_time', 'role_cs', 'role_statistic'],
    title: 'Quản lý yêu cầu xuất hóa đơn',
    icon: 'el-icon-star-on'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/order-invoice/Index.vue'),
      name: '',
      meta: {
        title: 'Quản lý yêu cầu xuất hóa đơn'
        // roles: ['role_master', 'role_admin', 'role_super_admin', 'role_cs', 'role_tee_time']
      }
    }
  ]
}
export default bookingRouter
