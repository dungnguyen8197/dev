
import Layout from '@/layout'

const historyRouter = {
  path: '/history',
  component: Layout,
  redirect: 'lists',
  name: 'Loyal Customer',
  meta: {
    roles: ['role_master', 'role_admin', 'role_super_admin', 'role_statistic', 'role_agency'],
    title: '',
    icon: 'el-icon-s-shop'
  },

  children: [
    {
      path: 'transaction',
      component: () => import('@/views/history/historyTransaction'),
      name: 'Lịch sử giao dịch',
      meta: { title: 'Lịch sử giao dịch' }
    }
  ]
}
export default historyRouter
