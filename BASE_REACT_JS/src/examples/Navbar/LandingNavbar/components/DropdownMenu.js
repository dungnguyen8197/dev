import { Grow, Popper, Box } from "@mui/material";
import styles from "assets/styles/examples/Navbar/LandingNavbar/DropdownMenu";
import WithColumn from "./WithColumn";
import WithoutColumn from "./WithoutColumn";

export default function DropdownMenu({ defaultNavbarHook, routes }) {
  return (
    <Popper
      anchorEl={defaultNavbarHook.dropdown}
      popperRef={null}
      open={Boolean(defaultNavbarHook.dropdown)}
      placement="top-start"
      transition
      sx={() => styles.popper({ dropdown: defaultNavbarHook.dropdown })}
      modifiers={[
        {
          name: "arrow",
          enabled: true,
          options: {
            element: defaultNavbarHook.arrowRef,
          },
        },
      ]}
      onMouseEnter={() => defaultNavbarHook.setDropdown(defaultNavbarHook.dropdownEl)}
      onMouseLeave={() => {
        if (!defaultNavbarHook.nestedDropdown) {
          defaultNavbarHook.setDropdown(null);
          defaultNavbarHook.setDropdownName("");
        }
      }}
    >
      {({ TransitionProps }) => (
        <Grow {...TransitionProps} sx={styles.grow}>
          <Box sx={styles.dropdownContainer}>
            <Box ref={defaultNavbarHook.setArrowRef} />
            <Box sx={styles.dropdownSection}>
              {routes.map(({ name, collapse, columns, rowsPerColumn }) => {
                let template;
                if (collapse && columns && name === defaultNavbarHook.dropdownName) {
                  const calculateColumns = collapse.reduce((resultArray, item, index) => {
                    const newResultArray = resultArray;
                    const chunkIndex = Math.floor(index / rowsPerColumn);
                    if (!newResultArray[chunkIndex]) newResultArray[chunkIndex] = [];
                    newResultArray[chunkIndex].push(item);
                    return newResultArray;
                  }, []);
                  template = (
                    <WithColumn key={name} columns={columns} calculateColumns={calculateColumns} />
                  );
                } else if (collapse && name === defaultNavbarHook.dropdownName) {
                  template = collapse.map((item) => (
                    <WithoutColumn
                      key={item.name}
                      item={item}
                      defaultNavbarHook={defaultNavbarHook}
                    />
                  ));
                }
                return template;
              })}
            </Box>
          </Box>
        </Grow>
      )}
    </Popper>
  );
}
