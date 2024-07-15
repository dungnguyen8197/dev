import { Box, Typography } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { routeComponent, linkComponent } from "constant/component";
import styles from "assets/styles/examples/Navbar/LandingNavbar/NestedRoute";

export default function NestedRoute({ item }) {
  return (
    <Box
      {...(item.route && routeComponent({ route: item.route }))}
      {...(item.href && linkComponent({ href: item.href }))}
    >
      <Box sx={(e) => styles.nestedContainer(e, { description: item.description })}>
        {item.description ? (
          <Box>
            {item.name}
            <Typography color="initial" sx={styles.descriptionText}>
              {item.description}
            </Typography>
          </Box>
        ) : (
          <Typography>{item.name}</Typography>
        )}
        {item.collapse && <KeyboardArrowRightIcon />}
      </Box>
    </Box>
  );
}
