import Layout from '@/layout'

const physicalDamegeInsuranceRouter = {
  path: '/physical-damege-insurance',
  component: Layout,
  redirect: 'lists',
  name: 'HIO',
  meta: {
    roles: ['role_master', 'role_admin', 'role_super_admin', 'role_tee_time', 'role_cs', 'role_statistic'],
    title: 'Bảo hiểm HIO hiện vật',
    icon: 'el-icon-menu'
    // Boss, SA-A-SAG-AG (ALL)
  },
  children: [
    {
      path: 'product',
      component: () => import('@/views/HIO/physicalDamageInsurance/product/Index.vue'),
      name: 'List Product',
      meta: { title: 'Danh sách sản phẩm' }
    },
    {
      path: 'bill',
      component: () => import('@/views/HIO/physicalDamageInsurance/bill/Index.vue'),
      name: 'List Bill',
      meta: { title: 'Quản lý đơn hàng' }
    },
    {
      path: 'bill-outsystem',
      component: () => import('@/views/HIO/physicalDamageInsurance/bill/ListOutsystem.vue'),
      name: 'List Bill OutSystem',
      meta: { title: 'Order ngoài hệ thống' }
    },
    {
      path: 'debt',
      component: () => import('@/views/HIO/physicalDamageInsurance/debt/Index.vue'),
      name: 'List Debt',
      meta: { title: 'Danh sách công nợ' }
    },
    {
      path: 'facility',
      component: () => import('@/views/HIO/physicalDamageInsurance/facility/Index.vue'),
      name: 'List Facility',
      meta: { title: 'Quản lý sân' }
    },
    {
      path: 'category',
      component: () => import('@/views/HIO/physicalDamageInsurance/category/Index.vue'),
      name: 'List Category',
      meta: { title: 'Danh mục sản phẩm' }
    },
    {
      path: 'callback-pvi',
      component: () => import('@/views/HIO/physicalDamageInsurance/logCallbackPVI/index.vue'),
      name: 'List Callback PVI',
      meta: { title: 'Log callback PVI' }
    },
    {
      path: 'user-inspector-material',
      component: () => import('@/views/HIO/physicalDamageInsurance/userInspectorMaterial/Index.vue'),
      name: 'List User Inspector Material',
      meta: { title: 'Danh sách người giám định' }
    }
  ]
}
export default physicalDamegeInsuranceRouter
