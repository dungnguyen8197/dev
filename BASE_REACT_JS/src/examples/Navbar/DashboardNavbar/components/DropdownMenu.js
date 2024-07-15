import { Box, Button, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "assets/styles/examples/Navbar/DashboardNavbar/DropdownMenu";

export default function DropdownMenu({ open, expand, route }) {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <Box sx={styles.container}>
      <Button
        onClick={() => navigate(route.route)}
        color="secondary"
        sx={(e) => styles.dropdownButton(e, { route, location })}
      >
        <Box sx={() => styles.dropdownContainer({ open, expand })}>
          {route.icon}
          {!route.icon && !(open || expand) && (
            <Typography variant="body1" color="white.main">
              {route.name?.charAt(0)?.toUpperCase()}
            </Typography>
          )}
        </Box>
        {(open || expand) && (
          <Typography color="white.main" variant="body2">
            {route.name}
          </Typography>
        )}
      </Button>
    </Box>
  );
}
