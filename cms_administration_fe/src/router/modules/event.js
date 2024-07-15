
import Layout from '@/layout'

const eventRouter = {
  path: '/event',
  component: Layout,
  // redirect: 'lists',
  name: 'Event',
  meta: {
    roles: ['role_master', 'role_admin', 'role_super_admin', 'role_admin_event'],
    title: 'Sự kiện - Giải đấu ',
    icon: 'el-icon-document-remove'
  },
  children: [

    {
      path: 'list',
      component: () => import('@/views/event/List'),
      name: 'List Event',
      meta: { title: 'Quản lý sự kiện' }
    },
    {
      path: 'tournament',
      component: () => import('@/views/event/listTournament'),
      name: 'List Tournament',
      meta: { title: 'Quản lý tournament' }
    },
    {
      path: 'company',
      component: () => import('@/views/event/ListCompany'),
      name: 'List Company',
      meta: { title: 'Quản lý Doanh Nghiệp' }
    },
    {
      path: 'achievement/event-draf',
      component: () => import('@/views/event/ListEventDraf'),
      name: 'ListEventDraf',
      meta: { title: 'QL sự kiện draf' }
    },
    {
      path: 'organization/list',
      component: () => import('@/views/event/Organization'),
      name: 'List Unit',
      meta: { title: 'QL đơn vị tổ chức sự kiện' }
    },
    {
      path: 'organization/option/list',
      component: () => import('@/views/event/OrganizationOption'),
      name: 'List Unit',
      meta: { title: 'QL Option đơn vị tổ chức sự kiện' }
    },
    {
      path: 'achievement/option/list',
      component: () => import('@/views/event/ListOptionAchievement'),
      name: 'ListOptionAchievement',
      meta: { title: 'QL Option thành tích' }
    }
  ]
}
export default eventRouter
