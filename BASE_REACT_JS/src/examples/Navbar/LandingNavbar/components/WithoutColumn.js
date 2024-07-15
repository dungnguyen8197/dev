import { Typography, Box } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { linkComponent, routeComponent } from "constant/component";
import styles from "assets/styles/examples/Navbar/LandingNavbar/WithoutColumn";

export default function WithoutColumn({ item, defaultNavbarHook }) {
  return (
    <Box
      {...(item.route && routeComponent({ route: item.route }))}
      {...(item.href && linkComponent({ href: item.href }))}
      onMouseEnter={({ currentTarget }) => {
        if (item.dropdown) {
          defaultNavbarHook.setNestedDropdown(currentTarget);
          defaultNavbarHook.setNestedDropdownEl(currentTarget);
          defaultNavbarHook.setNestedDropdownName(item.name);
        }
      }}
      onMouseLeave={() => {
        if (item.dropdown) defaultNavbarHook.setNestedDropdown(null);
      }}
    >
      <Box sx={(e) => styles.container(e, { description: item.description })}>
        {item.description ? (
          <Box>
            <Typography sx={styles.name}>{item.name}</Typography>
            <Typography sx={styles.descriptionText}>{item.description}</Typography>
          </Box>
        ) : (
          <Typography sx={styles.name}>{item.name}</Typography>
        )}
        {item.collapse && <KeyboardArrowRightIcon />}
      </Box>
    </Box>
  );
}
