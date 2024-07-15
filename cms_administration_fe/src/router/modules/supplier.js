import Layout from '@/layout'
import roleSupplier from '@/constant/supplier'

const allRoles = Object.keys(roleSupplier).reduce((acc, key) => {
  if (roleSupplier[key]) {
    acc.push(...roleSupplier[key].roles)
  }
  return acc
}, [])

const supplierRouter = {
  path: '/supplier',
  component: Layout,
  redirect: 'lists',
  name: 'Supplier',
  meta: {
    roles: [...allRoles],
    title: 'Nhà cung cấp',
    icon: 'el-icon-s-goods'
  },
  children: [
    {
      path: 'manage',
      redirect: 'lists'
      // component: () => import('@/views/supplier/manage_service/List.vue'),
      // name: 'Manage Service',
      // meta: { icon: 'list', title: 'Quản lý hạng mục', roles: roleSupplier['manage-service'].roles }
    },
    {
      path: 'manage-permission',
      component: () => import('@/views/supplier/manage_permission/index.vue'),
      name: 'Manage Permission',
      meta: { icon: 'peoples', title: 'Quản lý phân quyền', roles: roleSupplier['manage-permission'].roles }
      // BOSS ONLY
    },
    {
      path: 'manage-supplier',
      component: () => import('@/views/supplier/manage_supplier/index.vue'),
      name: 'Manage Supplier',
      meta: { icon: 'shop', title: 'Quản lý nhà cung cấp', roles: roleSupplier['manage-supplier'].roles }
      // BOSS ONLY
    },
    {
      path: 'manage-service',
      component: () => import('@/views/supplier/manage_service/List.vue'),
      name: 'Manage Service',
      meta: { icon: 'list', title: 'Quản lý hạng mục', roles: roleSupplier['manage-service'].roles }
      // BOSS ONLY
    },
    {
      path: 'manage-brand',
      component: () => import('@/views/supplier/manage_brand/index.vue'),
      name: 'Manage Brand',
      meta: { icon: 'trademarked', title: 'Quản lý thương hiệu', roles: roleSupplier['manage-brand'].roles }
      // BOSS ONLY
    },
    {
      path: 'manage-tag',
      component: () => import('@/views/supplier/manage_tag/index.vue'),
      name: 'Manage Tag',
      meta: { icon: 'tag', title: 'Quản lý tag', roles: roleSupplier['manage-tag'].roles }
      // BOSS ONLY
    },
    {
      path: 'manage-product',
      component: () => import('@/views/supplier/manage_product/List.vue'),
      name: 'Manage Products',
      meta: { icon: 'product', title: 'Quản lý sản phẩm', roles: roleSupplier['manage-product'].roles }
      // BOSS ONLY
    },
    {
      path: 'manage-debt',
      component: () => import('@/views/supplier/manage_debt/index.vue'),
      name: 'Manage Debt',
      meta: { icon: 'revenue', title: 'Quản lý công nợ', roles: roleSupplier['manage-debt'].roles },
      children: [
        {
          path: 'list-debt',
          component: () => import('@/views/supplier/manage_debt/list_debt/index.vue'),
          name: 'Debt',
          meta: { icon: 'payment', title: 'Danh sách công nợ', roles: roleSupplier['manage-debt'].roles }
        },
        {
          path: 'trade-history',
          component: () => import('@/views/supplier/manage_debt/trade_history/index.vue'),
          name: 'History',
          meta: { icon: 'documentation', title: 'Lịch sử thanh toán', roles: roleSupplier['manage-debt'].roles }
        }
      ]
      // BOSS ONLY
    },
    {
      path: 'manage-warehouse',
      component: () => import('@/views/supplier/manage_warehouse/index.vue'),
      name: 'Manage Warehouse',
      meta: { icon: 'el-icon-box', title: 'Quản lý kho', roles: roleSupplier['manage-debt'].roles },
      children: [
        {
          path: 'warehouse-product',
          component: () => import('@/views/supplier/manage_warehouse/warehouse_product/index.vue'),
          name: 'Warehouse Product',
          meta: { icon: 'el-icon-reading', title: 'Quản lý sản phẩm kho', roles: roleSupplier['manage-warehouse'].roles }
        },
        {
          path: 'received-note',
          component: () => import('@/views/supplier/manage_warehouse/received_note/index.vue'),
          name: 'Received Note',
          meta: { icon: 'el-icon-document-add', title: 'Quản lý phiếu nhập kho', roles: roleSupplier['manage-warehouse'].roles }
        },
        {
          path: 'delivery-note',
          component: () => import('@/views/supplier/manage_warehouse/delivery_note/index.vue'),
          name: 'Delivery Note',
          meta: { icon: 'el-icon-document-remove', title: 'Quản lý phiếu xuất kho', roles: roleSupplier['manage-warehouse'].roles }
        }
      ]
      // BOSS ONLY
    },
    {
      path: 'manage-revenue',
      component: () => import('@/views/supplier/manage_revenue/index.vue'),
      name: 'Manage Revenue',
      meta: { icon: 'money', title: 'Quản lý doanh thu', roles: roleSupplier['manage-revenue'].roles }
      // BOSS ONLY
    },
    {
      path: 'supplier-statistics',
      component: () => import('@/views/supplier/supplier_statistics/ShopStatisticalHomeView.vue'),
      name: 'Supplier Statistics',
      meta: { icon: 'reivew', title: 'Thống kê doanh thu', roles: roleSupplier['manage-statistics'].roles }
      // BOSS ONLY
    }
  ]
}
export default supplierRouter
