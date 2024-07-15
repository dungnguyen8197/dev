import Layout from '@/layout'

const bookingRouter = {
  path: '/booking',
  component: Layout,
  redirect: 'lists',
  name: 'Booking',
  meta: {
    roles: ['role_master', 'role_admin', 'role_super_admin', 'role_tee_time', 'role_cs', 'role_statistic'],
    title: 'Bill tổng',
    icon: 'el-icon-star-on'
  },
  children: [
    {
      path: 'bill-by-sale',
      component: () => import('@/views/booking/bill/List.vue'),
      name: 'List Bill',
      meta: {
        title: 'Quản ly Bill ( màn Sale )',
        roles: ['role_master', 'role_admin', 'role_super_admin', 'role_cs', 'role_tee_time']
      }
      // BOSS ONLY
    },
    {
      path: 'bill-by-statistic',
      component: () => import('@/views/booking/billByStatistic/List.vue'),
      name: 'List Bill',
      meta: {
        title: 'Quản ly Bill  ( màn kế toán )',
        roles: ['role_master', 'role_admin', 'role_super_admin', 'role_statistic']
      }
      // BOSS ONLY
    },
    {
      path: 'list-insurance',
      component: () => import('@/views/HIO/insurance/listInsurance/listInsurance.vue'),
      name: 'List Insurance ',
      meta: { title: 'Danh sách đơn Bảo Hiểm' }
      // BOSS ONLY
    },
    {
      path: 'statistic-nama',
      component: () => import('@/views/booking/statistic-nama'),
      name: 'Đối soát Nam A Bank',
      meta: {
        title: 'Đối soát Nam A Bank'
        // roles: ['role_master', 'role_admin', 'role_super_admin', 'role_statistic']
      }
    },
    {
      path: 'statistic-sacom',
      component: () => import('@/views/booking/statistic-sacom'),
      name: 'Đối soát SacomBank',
      meta: {
        title: 'Đối soát SacomBank'
        // roles: ['role_master', 'role_admin', 'role_super_admin', 'role_statistic']
      }
    }

  ]
}
export default bookingRouter
