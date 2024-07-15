import PropTypes from "prop-types";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { linkComponent, routeComponent } from "constant/component";
import styles from "assets/styles/examples/Navbar/LandingNavbar/DefaultNavbarDropdown";

function DefaultNavbarDropdown(props) {
  const { name, icon, children, collapseStatus, light, href, route, collapse, ...rest } = props;
  return (
    <>
      <Box
        {...rest}
        sx={(e) => styles.container(e, { light })}
        {...(route && routeComponent(route))}
        {...(href && linkComponent(href))}
      >
        <Box sx={styles.icon}>{icon}</Box>
        <Typography sx={(e) => styles.name(e, { light })}>{name}</Typography>
        <Typography color={light ? "white" : "inherit"} sx={styles.downIcon}>
          {collapse && <KeyboardArrowDownIcon />}
        </Typography>
      </Box>
      {children && (
        <Collapse in={Boolean(collapseStatus)} timeout={400} unmountOnExit>
          {children}
        </Collapse>
      )}
    </>
  );
}

DefaultNavbarDropdown.defaultProps = {
  children: false,
  collapseStatus: false,
  light: false,
  href: "",
  route: "",
  icon: <div />,
};

DefaultNavbarDropdown.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.node,
  children: PropTypes.node,
  collapseStatus: PropTypes.bool,
  light: PropTypes.bool,
  href: PropTypes.string,
  route: PropTypes.string,
  collapse: PropTypes.bool.isRequired,
};

export default DefaultNavbarDropdown;
