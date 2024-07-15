
import Layout from '@/layout'

const accountRouter = {
  path: '/account',
  component: Layout,
  // redirect: 'lists',
  name: 'Account',
  meta: {
    roles: ['role_master', 'role_admin', 'role_super_admin', 'role_boss_club'],
    title: 'Quản lý tài khoản',
    icon: 'el-icon-user'
  },
  children: [

    {
      path: 'role',
      component: () => import('@/views/account/role'),
      name: 'List Role',
      meta: { title: 'Quản lý quyền', roles: ['role_master', 'role_admin', 'role_super_admin'] }
    },
    {
      path: 'lists',
      component: () => import('@/views/account/List'),
      name: 'List Admin',
      meta: { title: 'Quản lý tài khoản', roles: ['role_master', 'role_admin', 'role_super_admin'] }
    },
    // {
    //   path: 'list-account-club',
    //   components: () => import('@/views/account/ListAccountCLub'),
    //   name: 'List Account CLub',
    //   meta: { title: 'Quản lý tài khoản CLB', roles: ['role_boss_club', 'role_leader_club'] }
    // },
    {
      path: 'misa/lists',
      component: () => import('@/views/account/misa/List'),
      name: 'List Admin',
      meta: { title: 'Quản lý tài khoản MiSa', roles: ['role_master', 'role_admin', 'role_super_admin'] }
    },
    {
      path: 'business-account',
      component: () => import('@/views/account/business/index'),
      name: 'List Admin business',
      meta: { title: 'Quản lý tài khoản business', roles: ['role_master', 'role_admin', 'role_super_admin'] }
    },
    {
      path: 'facility',
      component: () => import('@/views/account/facility/List'),
      name: 'List facility',
      meta: { title: 'Quản lý sân' }
    }
  ]
}
export default accountRouter
