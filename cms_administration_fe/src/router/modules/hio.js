
import Layout from '@/layout'

const hioRouter = {
  path: '/hio',
  component: Layout,
  redirect: 'lists',
  name: 'HIO',
  meta: {
    roles: ['role_master', 'role_admin', 'role_super_admin', 'role_sale_hio'],
    title: 'Quản Lý Trung Tâm HIO',
    icon: 'el-icon-menu'
    // Boss, SA-A-SAG-AG (ALL)
  },
  children: [
    {
      path: 'list-agent',
      component: () => import('@/views/HIO/agentHIO/listAgent'),
      name: 'List HIO Agent ',
      meta: { title: 'Danh sách Đại Lý' }
      // BOSS ONLY
    },
    {
      path: 'revenue-agent',
      component: () => import('@/views/HIO/statisticHIO/revenueAgent'),
      name: 'Revenue HIO agent',
      meta: { title: 'Quản lý doanh số đại lý' }
      // BOSS ONLY
    },
    {
      path: 'list-insurance-s',
      component: () => import('@/views/HIO/insuranceS/statistic/index'),
      name: 'Danh sách bh gói S',
      meta: { title: 'Danh sách bh gói S' }
      // BOSS ONLY
    },
    {
      path: 'list-contract',
      component: () => import('@/views/HIO/contract/index'),
      name: 'Hợp đồng HIO',
      meta: { title: 'Hợp đồng HIO' }
      // BOSS ONLY
    },
    {
      path: 'revenue-contract',
      component: () => import('@/views/HIO/contract/revenueContract'),
      name: 'Doanh thu theo hợp đồng',
      meta: { title: 'Doanh thu theo hợp đồng' }
      // BOSS ONLY
    }
  ]
}
export default hioRouter
