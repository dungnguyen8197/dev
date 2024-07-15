export default {
  container: ({ palette }, { light }) => ({
    cursor: "pointer",
    userSelect: "none",
    mx: 1,
    p: 1,
    display: "flex",
    alignItems: "baseline",
    color: light ? palette.white.main : palette.dark.main,
    opacity: light ? 1 : 0.6,
  }),
  icon: ({ palette }) => ({
    lineHeight: 1,
    alignSelf: "center",
    "& *": {
      verticalAlign: "middle",
    },
    color: palette.inherit.main,
  }),
  name: ({ palette, typography }, { light }) => ({
    color: light ? palette.white.main : palette.black.main,
    ml: 1,
    mr: 0.25,
    fontWeight: typography.fontWeightBold,
    textTransform: "capitalize",
  }),
  downIcon: {
    ml: "auto",
  },
};
