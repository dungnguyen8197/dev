export default {
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  collapseButton: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    height: "48px",
  },
  collapseContainer: {
    display: "flex",
    alignItems: "center",
  },
  collapseIcon: ({ open, expand }) => ({
    display: "flex",
    minWidth: "16px",
    mr: open || expand ? 1.5 : 0,
    justifyContent: "center",
  }),
  grow: {
    transformOrigin: "0 0 0",
  },
  expandIcon: ({ palette }, { collapseOpen }) => ({
    transform: collapseOpen ? "rotate(180deg)" : "rotate(90deg)",
    transition: "transform 0.25s",
    color: palette.white.main,
  }),
  childrenContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    minWidth: 0,
  },
};
