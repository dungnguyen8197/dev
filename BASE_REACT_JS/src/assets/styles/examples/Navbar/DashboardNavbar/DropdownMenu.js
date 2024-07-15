export default {
  container: {
    display: "flex",
    width: "100%",
  },
  dropdownButton: ({ palette }, { route, location }) => ({
    display: "flex",
    backgroundImage:
      location.pathname === route.route
        ? `linear-gradient(195deg,${palette.primary.main},${palette.primary.main})`
        : "transparent",
    width: "100%",
    justifyContent: "flex-start",
    height: "48px",
  }),
  dropdownContainer: ({ open, expand }) => ({
    minWidth: "16px",
    mr: open || expand ? 1.5 : 0,
    display: "flex",
    alignItems: "center",
  }),
};
