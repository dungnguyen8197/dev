
import Layout from '@/layout'

const agencyRouter = {
  path: '/agency',
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
      path: 'list',
      component: () => import('@/views/agency/List'),
      name: 'List Agency',
      meta: { title: 'Quản lý đại lý' }
    }
  ]
}
export default agencyRouter
