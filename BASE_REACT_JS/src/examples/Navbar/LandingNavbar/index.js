import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { linkComponent, routeComponent } from "constant/component";
import styles from "assets/styles/examples/Navbar/LandingNavbar";
import DefaultNavbarDropdown from "./DefaultNavbarDropdown";
import DefaultNavbarMobile from "./DefaultNavbarMobile";
import DefaultNavbarHook from "./hook/DefaultNavbarHook";
import DropdownMenu from "./components/DropdownMenu";
import NestedDropdownMenu from "./components/NestedDropdownMenu";

function DefaultNavbar(props) {
  const defaultNavbarHook = DefaultNavbarHook();
  const { brand, routes, transparent, light, action, sticky, relative, center, fullWidth } = props;

  return (
    <Box component={fullWidth ? Box : Container} sx={sticky ? styles.stickyContainer : null}>
      <Box sx={(e) => styles.containerSection(e, { transparent, relative, light })}>
        <Box sx={styles.webContainer}>
          <Box component={Link} to="/">
            <Box sx={(e) => styles.brand(e, { light, transparent, relative })}>{brand}</Box>
          </Box>
          <Box sx={() => styles.navbarItem({ center })}>
            {routes &&
              routes.map(({ name, icon, href, route, collapse }) => (
                <DefaultNavbarDropdown
                  key={name}
                  name={name}
                  icon={icon}
                  href={href}
                  route={route}
                  collapse={Boolean(collapse)}
                  onMouseEnter={({ currentTarget }) => {
                    if (collapse) {
                      defaultNavbarHook.setDropdown(currentTarget);
                      defaultNavbarHook.setDropdownEl(currentTarget);
                      defaultNavbarHook.setDropdownName(name);
                    }
                  }}
                  onMouseLeave={() => collapse && defaultNavbarHook.setDropdown(null)}
                  light={light}
                />
              ))}
          </Box>
          <Box sx={styles.withoutNavbarItem}>
            {action && (
              <Button
                variant="gradient"
                {...(action.type === "internal"
                  ? routeComponent(action.route)
                  : linkComponent(action.route))}
                color="info"
              >
                {action.label}
              </Button>
            )}
          </Box>
          <Box
            sx={() => styles.menuIcon({ transparent })}
            onClick={defaultNavbarHook.openMobileNavbar}
          >
            {defaultNavbarHook.mobileNavbar ? <CloseIcon /> : <MenuIcon />}
          </Box>
        </Box>
        <Box sx={() => styles.mobileContainer({ transparent })}>
          {defaultNavbarHook.mobileView && (
            <DefaultNavbarMobile routes={routes} open={defaultNavbarHook.mobileNavbar} />
          )}
        </Box>
      </Box>
      <DropdownMenu routes={routes} defaultNavbarHook={defaultNavbarHook} />
      <NestedDropdownMenu defaultNavbarHook={defaultNavbarHook} routes={routes} />
    </Box>
  );
}

DefaultNavbar.defaultProps = {
  brand: "",
  transparent: false,
  light: false,
  action: false,
  sticky: false,
  relative: false,
  center: false,
  fullWidth: false,
};

DefaultNavbar.propTypes = {
  brand: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
  transparent: PropTypes.bool,
  light: PropTypes.bool,
  action: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      type: PropTypes.oneOf(["external", "internal"]).isRequired,
      route: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ]),
  sticky: PropTypes.bool,
  relative: PropTypes.bool,
  center: PropTypes.bool,
  fullWidth: PropTypes.bool,
};

export default DefaultNavbar;
