// routes
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import routes from "routes/routes";
import cmsRoutes from "routes/cmsRoutes";
import { getRoutes } from "utils/route";
// layout
import LandingLayout from "layouts/LandingLayout";
import DashboardLayout from "layouts/DashboardLayout";
// page
import Login from "pages/Login";
// i18next
import { I18nextProvider, withTranslation } from "react-i18next";
import i18next from "middleware/i18next";
// material ui
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "assets/theme";
// react query
import { QueryClientProvider } from "react-query";
import { queryClient } from "config/config";
// redux
import { Provider } from "react-redux";
import store from "redux/store";
// console'
import "middleware/console";

function App() {
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18next}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<LandingLayout />}>
                  {getRoutes(routes)}
                </Route>
                <Route path="/" element={<DashboardLayout />}>
                  {getRoutes(cmsRoutes)}
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </BrowserRouter>
          </ThemeProvider>
        </QueryClientProvider>
      </I18nextProvider>
    </Provider>
  );
}

export default withTranslation()(App);
