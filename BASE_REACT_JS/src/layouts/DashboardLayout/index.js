import * as React from "react";
import Box from "@mui/material/Box";
import DashboardNavbar from "examples/Navbar/DashboardNavbar";
import routes from "routes/cmsRoutes";
import VGSLogo from "assets/images/logo/logo.png";
import { Outlet } from "react-router-dom";
import BaseLayout from "base/BaseLayout";

export default function DashboardLayout() {
  return (
    <BaseLayout>
      <DashboardNavbar
        brandDescription="VGS"
        brand={<Box component="img" src={VGSLogo} sx={{ width: "40px", height: "40px" }} />}
        routes={routes}
      >
        <Outlet />
      </DashboardNavbar>
    </BaseLayout>
  );
}
