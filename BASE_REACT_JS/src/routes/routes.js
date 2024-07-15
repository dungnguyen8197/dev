import HomePage from "pages/HomePage";

import DashboardIcon from "@mui/icons-material/Dashboard";

// name: string,
// route: string,
// icon: node,
// columns: number,
// rowsPerColumn: number,
// description: string,
// href: string,
// component: node,
// dropdown: boolean
// collapse: array

const routes = [
  // single
  {
    name: "Home Page",
    route: "/",
    component: <HomePage />,
  },
  // multiple row
  {
    name: "Pages",
    icon: <DashboardIcon />,
    columns: 1,
    rowsPerColumn: 2,
    collapse: [
      {
        name: "landing pages",
        collapse: [
          {
            name: "about us 1",
            route: "/pages/landing-pages/about-us",
            component: <HomePage />,
          },
        ],
      },
      {
        name: "account",
        collapse: [
          {
            name: "sign in 1",
            route: "/pages/authentication/sign-in",
            component: <HomePage />,
          },
        ],
      },
    ],
  },
  // multiple column
  {
    name: "Dashboard",
    icon: <DashboardIcon />,
    columns: 2,
    rowsPerColumn: 1,
    collapse: [
      {
        name: "landing pages",
        collapse: [
          {
            name: "about us 2",
            route: "/dashboard/landing-pages/about-us",
            component: <HomePage />,
          },
        ],
      },
      {
        name: "account",
        collapse: [
          {
            name: "sign in 2",
            route: "/dashboard/authentication/sign-in",
            component: <HomePage />,
          },
        ],
      },
    ],
  },
  // multiple route
  {
    name: "Landing",
    icon: <DashboardIcon />,
    collapse: [
      {
        name: "about us 3",
        href: "https://google.com",
      },
      {
        name: "sign in 3",
        route: "/landing/authentication/sign-in",
        component: <HomePage />,
      },
    ],
  },
  // multiple route has sub route
  {
    name: "section",
    icon: <DashboardIcon />,
    collapse: [
      {
        name: "page sections",
        dropdown: true,
        collapse: [
          {
            name: "page headers",
            route: "/sections/page-sections/page-headers",
            component: <HomePage />,
          },
          {
            name: "features",
            route: "/sections/page-sections/features",
            component: <HomePage />,
          },
        ],
      },
    ],
  },
];

export default routes;
