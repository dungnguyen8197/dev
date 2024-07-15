export default {
  container: {
    width: "calc(100% + 1.625rem)",
    my: 2,
    ml: -2,
  },
  mobileContainer: {
    height: "15rem",
    maxHeight: "15rem",
    overflowY: "scroll",
  },
  name: ({ typography }) => ({
    fontWeight: typography.fontWeightBold,
    textTransform: "capitalize",
    py: 1,
    px: 0.5,
  }),
  collapseName: ({ palette: { grey, dark }, borders: { borderRadius } }) => ({
    borderRadius: borderRadius.md,
    cursor: "pointer",
    transition: "all 300ms linear",
    minWidth: "11.25rem",
    display: "block",
    variant: "button",
    color: "text",
    textTransform: "capitalize",
    py: 0.625,
    px: 2,

    "&:hover": {
      backgroundColor: grey[200],
      color: dark.main,
    },
  }),
  itemName: ({ palette: { grey, dark }, borders: { borderRadius } }) => ({
    borderRadius: borderRadius.md,
    cursor: "pointer",
    transition: "all 300ms linear",
    py: 1,
    px: 1.625,
    display: "block",

    "&:hover": {
      backgroundColor: grey[200],
      color: dark.main,

      "& *": {
        color: dark.main,
      },
    },
  }),
  itemText: ({ typography }) => ({
    display: "block",
    variant: "button",
    fontWeight: typography.fontWeightBold,
    textTransform: "capitalize",
  }),
  itemDescription: {
    transition: "all 300ms linear",
    display: "block",
    variant: "button",
    color: "text",
  },
};
