import Layout from '@/layout'

const partnerServiceRouter = {
  path: '/partner-service',
  component: Layout,
  name: 'Partner Service',
  meta: {
    title: 'Quản lý dịch vụ đối tác',
    icon: 'el-icon-wallet',
    roles: ['role_master', 'role_admin', 'role_super_admin', 'role_statistic', 'role_admin_partner']
  },
  children: [
    {
      path: 'list-stand',
      component: () => import('@/views/partner-service/ListStand'),
      name: 'Quản lý gian hàng',
      meta: { title: 'Quản lý gian hàng' }
      // BOSS ONLY
    },
    {
      path: 'list-partner',
      component: () => import('@/views/partner-service/ListPartner'),
      name: 'Quản lý đối tác',
      meta: { title: 'Quản lý đối tác' }
      // BOSS ONLY
    },
    {
      path: 'list-voucher',
      component: () => import('@/views/partner-service/ListVoucher'),
      name: 'Quản lý voucher',
      meta: { title: 'Quản lý voucher' }
      // BOSS ONLY
    },
    {
      path: 'list-product',
      component: () => import('@/views/partner-service/ListProduct'),
      name: 'Quản lý sản phẩm',
      meta: { title: 'Quản lý sản phẩm' }
      // BOSS ONLY
    },
    {
      path: 'list-category',
      component: () => import('@/views/partner-service/ListCategory'),
      name: 'Quản lý danh mục',
      meta: { title: 'Quản lý danh mục' }
      // BOSS ONLY
    }
  ]
}
export default partnerServiceRouter
