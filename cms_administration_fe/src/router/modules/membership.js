
import Layout from '@/layout'

const membershipRouter = {
  path: '/membership',
  component: Layout,
  redirect: 'lists',
  name: 'Membership',
  meta: {
    roles: ['role_master', 'role_admin', 'role_super_admin', 'role_admin_bussiness'],
    title: 'Quản lý khách hàng thân thiết',
    icon: 'el-icon-s-custom'
    // Boss, SA-A-SAG-AG (ALL)
  },
  children: [
    // {
    //   path: 'report',
    //   component: () => import('@/views/membership/report/report'),
    //   name: 'Report Statistic',
    //   meta: { title: 'Báo cáo - Thống kê' }
    //   // BOSS ONLY
    // },
    {
      path: 'list-golfer',
      component: () => import('@/views/membership/listGolfer/listGolferAll'),
      name: 'List golfer ',
      meta: { title: 'Danh sách Golfer' }
      // BOSS ONLY
    },
    // {
    //   path: 'history-upgrade',
    //   component: () => import('@/views/membership/history/listHistory'),
    //   name: 'History Upgrade',
    //   meta: { title: 'Danh sách giao dịch nâng cấp' }
    //   // BOSS ONLY
    // },
    {
      path: 'list',
      component: () => import('@/views/customer/List'),
      name: 'List Loyal Customer',
      meta: { title: 'Quản lý KH thân thiết' }
    },
    {
      path: 'list-document',
      component: () => import('@/views/membership/document/Index'),
      name: 'List document',
      meta: { title: 'Quản lý văn bản' }
    }
    // {
    //   path: 'list-passport',
    //   component: () => import('@/views/membership/listPassport/listPassport'),
    //   name: 'List passport',
    //   meta: { title: 'Danh sách Passport' }
    //   // BOSS ONLY
    // },
    // {
    //   path: 'edit-info-golfer',
    //   component: () => import('@/views/membership/editGolfer/index'),
    //   name: 'Edit info golfer',
    //   meta: { title: 'Biên tập golfer' }
    //   // BOSS ONLY
    // }
    // {
    //   path: 'upgrade-type-account',
    //   component: () => import('@/views/membership/typeAccount/listUpgradeTypeAccount'),
    //   name: 'upgrade type account',
    //   meta: { title: 'Lịch sử nâng cấp loại Tài Khoản' }
    //   // BOSS ONLY
    // }
  ]
}
export default membershipRouter
