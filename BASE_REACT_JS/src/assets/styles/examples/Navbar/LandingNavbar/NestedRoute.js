export default {
  nestedContainer: ({ palette, borders: { borderRadius } }, { description }) => ({
    mt: 0.5,
    borderRadius: borderRadius.xs,
    cursor: "pointer",
    transition: "all 300ms linear",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    textTransform: "capitalize",
    minWidth: description ? "14rem" : "12rem",
    color: description ? palette.dark.main : palette.text.main,
    fontWeight: description ? "bold" : "regular",
    py: description ? 1 : 0.625,
    px: 2,

    "&:hover": {
      backgroundColor: palette.grey[200],
      color: palette.dark.main,

      "& *": {
        color: palette.dark.main,
      },
    },
  }),
  descriptionText: {
    transition: "all 300ms linear",
    display: "block",
    fontWeight: "regular",
  },
};
