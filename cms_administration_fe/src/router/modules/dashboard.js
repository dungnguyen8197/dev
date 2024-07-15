
import Layout from '@/layout'

const dashboardRouter = {
  path: '/report',
  component: Layout,
  redirect: 'lists',
  name: 'Report',
  meta: {
    // roles: ['role_master', 'role_super_admin', 'role_statistic'],
    title: 'Báo cáo tổng',
    icon: 'el-icon-s-marketing'
    // Boss, SA-A-SAG-AG (ALL)
  },
  children: [
    {
      path: 'report-business',
      component: () => import('@/views/report/report-business/index'),
      name: 'Report Business ',
      meta: { title: 'Báo Cáo Kinh Doanh' }
      // BOSS ONLY
    },
    {
      path: 'planning',
      component: () => import('@/views/report/planning/index'),
      name: 'Planning',
      meta: { title: 'Chi Tiêu - Kế Hoạch' }
      // BOSS ONLY
    },
    {
      path: 'working',
      name: 'Working ',
      meta: { title: 'Báo Cáo Vận Hành' },
      // BOSS ONLY
      children: [
        {
          path: 'vnews',
          component: () => import('@/views/report/working/vnews/index'),
          name: 'Vnews ',
          meta: { title: 'Vnews' }
          // BOSS ONLY
        },
        {
          path: 'booking',
          component: () => import('@/views/report/working/booking/index'),
          name: 'Booking ',
          meta: { title: 'Booking' }
          // BOSS ONLY
        },
        {
          path: 'WGHN',
          component: () => import('@/views/report/working/wghn/index'),
          name: 'WGHN ',
          meta: { title: 'WGHN' }
          // BOSS ONLY
        }
      ]
    }
  ]
}
export default dashboardRouter
