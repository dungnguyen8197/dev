import Layout from '@/layout'

const voucherRouter = {
  path: '/voucher',
  component: Layout,
  name: 'Voucher',
  meta: {
    title: 'Voucher',
    icon: 'el-icon-price-tag',
    roles: ['role_master', 'role_admin', 'role_super_admin', 'role_statistic']
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/voucher/List'),
      name: 'Quản lý voucher',
      meta: { title: 'Quản lý voucher' }
      // BOSS ONLY
    },
    {
      path: 'list-provide',
      component: () => import('@/views/voucher/ListProvider'),
      name: 'Quản lý nhà cung cấp',
      meta: { title: 'Quản lý nhà cung cấp' }
      // BOSS ONLY
    },
    {
      path: 'list-screen',
      component: () => import('@/views/voucher/ListScreen'),
      name: 'Quản lý màn hình sử dụng',
      meta: { title: 'Quản lý màn hình sử dụng' }
      // BOSS ONLY
    }
  ]
}
export default voucherRouter
