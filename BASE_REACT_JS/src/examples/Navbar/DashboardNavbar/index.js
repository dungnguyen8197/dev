import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import { Divider, List } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "assets/styles/examples/Navbar/DashboardNavbar";
import DropdownCollapse from "./components/DropdownCollapse";
import DropdownMenu from "./components/DropdownMenu";
import HeaderBar from "./components/HeaderBar";

export default function DashboardNavbar({ brand, brandDescription, routes, children }) {
  const [open, setOpen] = useState(true);
  const [expand, setExpand] = useState(false);
  const [transparent, setTransparent] = useState(false);

  const handleDrawerExpand = () => {
    setExpand(true);
  };

  const handleDrawerMinimize = () => {
    setExpand(false);
  };

  const handleDrawerToggle = () => {
    setOpen((o) => !o);
  };

  useEffect(() => {
    const updateNavbarColor = () => {
      if (document.documentElement.scrollTop > 0 || document.body.scrollTop > 0) {
        setTransparent(true);
      } else if (document.documentElement.scrollTop < 1 || document.body.scrollTop < 1) {
        setTransparent(false);
      }
    };
    window.addEventListener("scroll", updateNavbarColor);
    return function cleanup() {
      window.removeEventListener("scroll", updateNavbarColor);
    };
  });

  return (
    <Box sx={styles.container}>
      <Drawer
        sx={(e) => styles.drawer(e, { open, expand })}
        onMouseEnter={handleDrawerExpand}
        onMouseLeave={handleDrawerMinimize}
        variant="permanent"
        open={open || expand}
      >
        <Box component={Link} to="/dashboard">
          {brand && brandDescription ? (
            <Box sx={() => styles.brand({ open, expand, brandDescription })}>
              {brand}
              <Typography
                variant="h6"
                color="white.main"
                sx={() => styles.brandDescription({ open, expand })}
              >
                {brandDescription}
              </Typography>
            </Box>
          ) : (
            brand && <Box sx={styles.brandOnly}>{brand}</Box>
          )}
        </Box>

        <Divider sx={styles.divider} />

        <List>
          {routes.map((route) =>
            route.collapse ? (
              <DropdownCollapse key={route.name} expand={expand} open={open} route={route} />
            ) : (
              <DropdownMenu key={route.name} expand={expand} open={open} route={route} />
            )
          )}
        </List>
      </Drawer>

      <Box sx={styles.contentContainer}>
        <HeaderBar
          transparent={transparent}
          open={open}
          expand={expand}
          handleDrawerToggle={handleDrawerToggle}
        />
        {children}
      </Box>
    </Box>
  );
}
