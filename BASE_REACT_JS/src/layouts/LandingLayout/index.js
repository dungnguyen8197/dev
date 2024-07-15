import { memo } from "react";
import { Outlet } from "react-router-dom";
import LandingNavbar from "examples/Navbar/LandingNavbar";
import LandingFooter from "examples/Footer/LandingFooter";
import routes from "routes/routes";
import BaseLayout from "base/BaseLayout";

function LandingLayout() {
  return (
    <BaseLayout>
      <LandingNavbar routes={routes} relative sticky fullWidth />
      <Outlet />
      <LandingFooter />
    </BaseLayout>
  );
}

export default memo(LandingLayout);
