import { Grow, Popper, Box } from "@mui/material";
import styles from "assets/styles/examples/Navbar/LandingNavbar/NestedDropdownMenu";
import NestedRoute from "./NestedRoute";

export default function NestedDropdownMenu({ defaultNavbarHook, routes }) {
  return (
    <Popper
      anchorEl={defaultNavbarHook.nestedDropdown}
      popperRef={null}
      open={Boolean(defaultNavbarHook.nestedDropdown)}
      placement="right-start"
      transition
      sx={() => styles.popper({ dropdown: defaultNavbarHook.nestedDropdown })}
      onMouseEnter={() => {
        defaultNavbarHook.setNestedDropdown(defaultNavbarHook.nestedDropdownEl);
      }}
      onMouseLeave={() => {
        defaultNavbarHook.setNestedDropdown(null);
        defaultNavbarHook.setNestedDropdownName("");
        defaultNavbarHook.setDropdown(null);
      }}
    >
      {({ TransitionProps }) => (
        <Grow {...TransitionProps} sx={styles.grow}>
          <Box sx={styles.dropdownContainer}>
            <Box sx={styles.dropdownSection}>
              {routes.map(({ collapse, columns }) =>
                collapse && !columns
                  ? collapse.map(({ name: parentName, collapse: nestedCollapse }) => {
                      let template;
                      if (parentName === defaultNavbarHook.nestedDropdownName) {
                        template =
                          nestedCollapse &&
                          nestedCollapse.map((item) => <NestedRoute key={item.name} item={item} />);
                      }
                      return template;
                    })
                  : null
              )}
            </Box>
          </Box>
        </Grow>
      )}
    </Popper>
  );
}
