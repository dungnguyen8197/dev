import HomePage from "pages/HomePage";
import Admin from "pages/Admin";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// name: string,
// route: string,
// icon: node,
// description: string,
// collapse: array
// href: string,
// component: node,

const routes = [
  {
    name: "Dashboard",
    icon: <DashboardIcon sx={{ color: "#fff" }} />,
    route: "/dashboard",
    component: <HomePage />,
  },
  {
    name: "Account",
    icon: <AccountCircleIcon sx={{ color: "#fff" }} />,
    collapse: [
      {
        name: "Admin",
        route: "/account/admin",
        component: <Admin />,
      },
    ],
  },
];

export default routes;
