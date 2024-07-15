import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Grow from "@mui/material/Grow";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { useNavigate } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";
import { setToken } from "utils/storage";
import styles from "assets/styles/examples/Navbar/DashboardNavbar/HeaderBar";

export default function HeaderBar({ open, expand, transparent, handleDrawerToggle }) {
  const navigate = useNavigate();
  const [openSetting, setOpenSetting] = useState(false);
  const [anchor, setAnchorEl] = useState(null);

  const handleLogout = () => {
    setToken("");
    navigate("/sign-in");
  };

  const handleClose = () => {
    setOpenSetting(false);
  };

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenSetting((prevOpen) => !prevOpen);
  };

  return (
    <AppBar sx={(e) => styles.appBar(e, { open, expand })}>
      <Toolbar sx={() => styles.toolbar({ transparent })}>
        <Box sx={styles.expandIcon}>
          <IconButton color="inherit" onClick={handleDrawerToggle} edge="start">
            {open ? <MenuIcon /> : <MenuOpenIcon />}
          </IconButton>
        </Box>

        <Box>
          <IconButton onClick={handleOpen}>
            <SettingsIcon sx={styles.settingIcon} />
          </IconButton>
        </Box>
        <Popper
          placement="bottom-end"
          open={openSetting}
          anchorEl={anchor}
          role={undefined}
          transition
          disablePortal
          popperOptions={{ modifiers: [{ name: "offset", options: { offset: [0, 14] } }] }}
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps}>
              <Paper>
                <ClickAwayListener disableReactTree onClickAway={handleClose}>
                  <Box sx={styles.listContainer}>
                    <List sx={styles.list}>
                      <ListItemButton sx={styles.listItemButton} onClick={handleLogout}>
                        <ListItemIcon>
                          <LogoutIcon />
                        </ListItemIcon>
                        <Typography sx={styles.listItem} variant="body2">
                          Logout
                        </Typography>
                      </ListItemButton>
                    </List>
                  </Box>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Toolbar>
    </AppBar>
  );
}
