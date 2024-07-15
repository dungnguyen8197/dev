export default {
  container: ({ palette, borders }, { description }) => ({
    borderRadius: borders.borderRadius.xs,
    cursor: "pointer",
    transition: "all 300ms linear",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    textTransform: "capitalize",
    minWidth: description ? "14rem" : "12rem",
    color: palette.grey[700],
    fontWeight: description ? "bold" : "regular",
    py: description ? 1 : 0.625,
    px: 2,

    "&:hover": {
      backgroundColor: palette.grey[200],
      color: palette.grey[700],

      "& *": {
        color: palette.grey[700],
      },
    },
  }),
  descriptionText: ({ palette }) => ({
    transition: "all 300ms linear",
    display: "block",
    fontWeight: "regular",
    color: palette.grey[700],
  }),
  name: ({ palette }) => ({
    color: palette.grey[700],
  }),
};
