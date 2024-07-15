import { Route } from "react-router-dom";

const getRoutes = (allRoutes) =>
  allRoutes.map((route, index) => {
    if (route.collapse) {
      return getRoutes(route.collapse);
    }

    if (route.route) {
      return <Route path={route.route} element={route.component} key={index} exact />;
    }

    return null;
  });

export { getRoutes };
