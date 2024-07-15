import PropTypes from "prop-types";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { linkComponent, routeComponent } from "constant/component";
import styles from "assets/styles/examples/Navbar/LandingNavbar/DefaultNavbarMobile";
import DefaultNavbarDropdown from "./DefaultNavbarDropdown";
import DefaultNavbarMobileHook from "./hook/DefaultNavbarMobile";

function DefaultNavbarMobile({ routes, open }) {
  const defaultNavbarMobileHook = DefaultNavbarMobileHook();

  return (
    <Collapse in={Boolean(open)} timeout="auto" unmountOnExit>
      <Box sx={styles.container}>
        {routes &&
          routes.map(
            ({ name, icon, collapse: routeCollapses, href, route, collapse: navCollapse }) => (
              <DefaultNavbarDropdown
                key={name}
                name={name}
                icon={icon}
                collapseStatus={name === defaultNavbarMobileHook.collapse}
                onClick={() => defaultNavbarMobileHook.handleSetCollapse(name)}
                href={href}
                route={route}
                collapse={Boolean(navCollapse)}
              >
                <Box sx={styles.mobileContainer}>
                  {routeCollapses &&
                    routeCollapses.map((item) => (
                      <Box key={item.name} px={2}>
                        {item.collapse ? (
                          <>
                            <Typography sx={styles.name}>{item.name}</Typography>
                            {item.collapse.map((el) => (
                              <Typography
                                key={el.name}
                                {...(el.route && routeComponent(el.route))}
                                {...(el.href && linkComponent(el.href))}
                                sx={(e) => styles.collapseName(e)}
                              >
                                {el.name}
                              </Typography>
                            ))}
                          </>
                        ) : (
                          <Box
                            key={item.key}
                            {...(item.route && routeComponent(item.route))}
                            {...(item.href && linkComponent(item.href))}
                            sx={(e) => styles.itemName(e)}
                          >
                            <Typography sx={styles.itemText}>{item.name}</Typography>
                            <Typography sx={styles.itemDescription}>{item.description}</Typography>
                          </Box>
                        )}
                      </Box>
                    ))}
                </Box>
              </DefaultNavbarDropdown>
            )
          )}
      </Box>
    </Collapse>
  );
}

DefaultNavbarMobile.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
  open: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
};

export default DefaultNavbarMobile;
