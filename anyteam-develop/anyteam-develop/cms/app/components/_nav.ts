export default [
  {
    _name: "CSidebarNav",
    _children: [
      {
        _name: "CSidebarNavItem",
        name: "ダッシュボード",
        to: "/",
        icon: "cil-speedometer",
        badge: {
          color: "primary",
          text: "NEW",
        },
      },
      {
        _name: "CSidebarNavTitle",
        _children: ["管理メニュー"],
      },
      {
        _name: 'CSidebarNavDropdown',
        name: 'ユーザ管理',
        route: '/administrators',
        icon: 'cil-user',
        items: [
          {
            name: 'ユーザ一覧',
            to: '/administrators/list'
          },
          {
            name: 'ユーザ新規登録',
            to: '/administrators/create'
          }
        ]
      },
      {
        _name: "CSidebarNavDropdown",
        name: "競技管理",
        route: "/competitions",
        icon: "cil-user",
        items: [
          {
            name: "競技一覧",
            to: "/competitions/list",
          },
          {
            name: "競技新規登録",
            to: "/competitions/create",
          },
        ],
      },
      {
        _name: "CSidebarNavDropdown",
        name: "組織管理",
        route: "/organizations",
        icon: "cid-group",
        items: [
          {
            name: "組織一覧",
            to: "/organizations/list",
          },
          {
            name: "組織新規登録",
            to: "/organizations/create",
          },
        ],
      },
      {
        _name: "CSidebarNavItem",
        name: "設定",
        to: "/configs",
        icon: "cil-puzzle",
      },
    ],
  },
];
