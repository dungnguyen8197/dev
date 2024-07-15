import Layout from '@/layout'

const advertisementRouter = {
  path: '/advertisement',
  component: Layout,
  redirect: 'lists',
  name: 'Advertisement',
  meta: {
    roles: ['role_master', 'role_admin', 'role_super_admin', 'role_cs', 'role_admin_adv', 'role_admin_bussiness'],
    title: 'Quản lý quảng cáo',
    icon: 'el-icon-s-marketing'
  },
  children: [
    {
      path: 'adv-popup',
      component: () => import('@/views/adv/Popup.vue'),
      name: 'Adv Popup',
      meta: { title: 'Quảng cáo Popup' }
      // BOSS ONLY
    },
    {
      path: 'adv-home',
      component: () => import('@/views/adv/Home.vue'),
      name: 'Adv Home',
      meta: { title: 'Quảng cáo Banner' }
      // BOSS ONLY
    },
    {
      path: 'adv-score-card',
      component: () => import('@/views/adv/ScoreCard.vue'),
      name: 'Adv Score Card',
      meta: { title: 'Quảng cáo màn Score Card' }
      // BOSS ONLY
    },
    {
      path: 'noti-in-app',
      component: () => import('@/views/adv/Notify.vue'),
      name: 'Noti in app',
      meta: { title: 'Quản lý Notification' }
      // BOSS ONLY
    }

  ]
}
export default advertisementRouter
