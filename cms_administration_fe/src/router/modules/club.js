
import Layout from '@/layout'

const clubRouter = {
  path: '/club',
  component: Layout,
  name: 'Club',
  meta: {
    roles: ['role_boss_club', 'role_leader_club', 'role_secretary_club'],
    title: 'Câu lạc bộ',
    icon: 'el-icon-document-remove'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/club/List'),
      name: 'ListClub',
      meta: { title: 'Quản lý CLB' }
    },
    {
      path: 'detail/:id',
      component: () => import('@/views/club/detail/Index'),
      name: 'DetailClub'
    }
  ]
}
export default clubRouter
