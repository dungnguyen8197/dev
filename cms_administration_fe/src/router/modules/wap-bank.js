
import Layout from '@/layout'

const wapBankRouter = {
  path: '/cms/wap',
  component: Layout,
  name: 'Quản lý wap bank',
  meta: {
    roles: ['role_master', 'role_admin', 'role_statistic', 'role_cs', 'role_tee_time'],
    title: 'Quản lý wap bank',
    icon: 'el-icon-office-building'
  },
  children: [
    {
      path: 'package-sale',
      component: () => import('@/views/wap-bank/WapPackageSale'),
      name: 'Gói bán wap',
      meta: { title: 'Gói bán wap', roles: ['role_master', 'role_admin', 'role_statistic', 'role_cs', 'role_tee_time'] }
    },
    {
      path: 'preferential-price',
      component: () => import('@/views/wap-bank/WapPreferentialPrice'),
      name: 'Giá ưu đãi wap',
      meta: { title: 'Giá ưu đãi wap', roles: ['role_master', 'role_admin', 'role_statistic', 'role_cs', 'role_tee_time'] }
    },
    {
      path: 'list-bank',
      component: () => import('@/views/wap-bank/ListBank'),
      name: 'QL danh sách Bank',
      meta: { title: 'QL danh sách Bank', roles: ['role_master', 'role_admin', 'role_statistic', 'role_cs', 'role_tee_time'] }
    }
    // {
    //   path: 'list-tag',
    //   component: () => import('@/views/wap-bank/ListTag'),
    //   name: 'QL danh sách Tag',
    //   meta: { title: 'QL danh sách Tag', roles: ['role_master', 'role_admin', 'role_statistic', 'role_cs', 'role_tee_time'] }
    // }
  ]
}
export default wapBankRouter
