export default {
  container: {
    position: "relative",
  },
  name: ({ palette }, { index }) => ({
    display: "block",
    fontWeight: "bold",
    textTransform: "capitalize",
    p: 0.5,
    mt: index !== 0 ? 2 : 0,
    color: palette.grey[700],
  }),
  columnName: ({ palette, borders }) => ({
    borderRadius: borders.borderRadius.xs,
    cursor: "pointer",
    transition: "all 300ms linear",
    minWidth: "11.25rem",
    display: "block",
    textTransform: "capitalize",
    fontWeight: "regular",
    py: 0.625,
    px: 2,
    color: palette.grey[700],

    "&:hover": {
      backgroundColor: palette.grey[200],
    },
  }),
  divider: {
    position: "absolute",
    top: "50%",
    left: "-4px",
    transform: "translateY(-45%)",
    height: "90%",
  },
};
