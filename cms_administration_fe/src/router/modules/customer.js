
import Layout from '@/layout'

const customerRouter = {
  path: '/loyal-customer',
  component: Layout,
  redirect: 'lists',
  name: 'Loyal Customer',
  meta: {
    roles: ['role_master', 'role_admin', 'role_super_admin'],

    title: 'Quản lý KH thân thiết',
    icon: 'el-icon-user'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/customer/List'),
      name: 'List Loyal Customer',
      meta: { title: 'Quản lý KH thân thiết', roles: ['boss'] }
    }
  ]
}
export default customerRouter
