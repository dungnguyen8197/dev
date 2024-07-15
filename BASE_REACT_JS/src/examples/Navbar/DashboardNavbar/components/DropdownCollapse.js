import { Box, Button, Collapse, Typography } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useEffect, useState } from "react";
import styles from "assets/styles/examples/Navbar/DashboardNavbar/DropdownCollapse";
import { useLocation } from "react-router-dom";
import DropdownMenu from "./DropdownMenu";

export default function DropdownCollapse({ route, open, expand }) {
  const location = useLocation();
  const [collapseOpen, setCollapseOpen] = useState(false);
  const handleOpenCollapse = () => setCollapseOpen(!collapseOpen);
  useEffect(() => {
    if (route.collapse.map(({ route: r }) => r).includes(location.pathname)) setCollapseOpen(true);
  }, []);

  return (
    <Box sx={styles.container}>
      <Button onClick={handleOpenCollapse} color="secondary" sx={styles.collapseButton}>
        <Box sx={styles.collapseContainer}>
          <Box sx={() => styles.collapseIcon({ open, expand })}>
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
        </Box>
        {route.collapse && (open || expand) && (
          <ExpandLessIcon sx={(e) => styles.expandIcon(e, { collapseOpen })} />
        )}
      </Button>
      <Collapse in={route.collapse && collapseOpen} timeout="auto" unmountOnExit>
        {route.collapse.map((r) => (
          <Box key={r.name} sx={styles.childrenContainer}>
            {r.collapse ? (
              <DropdownCollapse key={r.name} route={r} open={open} expand={expand} />
            ) : (
              <DropdownMenu route={r} expand={expand} open={open} key={r.name} />
            )}
          </Box>
        ))}
      </Collapse>
    </Box>
  );
}
