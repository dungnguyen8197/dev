export default {
  stickyContainer: {
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  containerSection: ({ palette, functions }, { transparent, relative, light }) => ({
    backgroundColor: transparent
      ? palette.transparent.main
      : functions.rgba(palette.white.main, 0.8),
    backdropFilter: transparent ? "none" : `saturate(200%) blur(30px)`,
    py: 1,
    px: { xs: 4, sm: transparent ? 2 : 3, lg: transparent ? 0 : 2 },
    my: relative ? 0 : 2,
    mx: relative ? 0 : 3,
    width: relative ? "100%" : "calc(100% - 48px)",
    borderRadius: "xl",
    shadow: transparent ? "none" : "md",
    color: light ? "white" : "dark",
    position: relative ? "relative" : "absolute",
    left: 0,
    zIndex: 3,
  }),
  webContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: ({ palette, typography }, { light, transparent, relative }) => ({
    color: light ? palette.white.main : palette.dark.main,
    py: transparent ? 1.5 : 0.75,
    pl: relative || transparent ? 0 : { xs: 0, lg: 1 },
    fontWeight: typography.fontWeightBold,
    cursor: "pointer",
  }),
  navbarItem: ({ center }) => ({
    display: { xs: "none", lg: "flex" },
    ml: "auto",
    mr: center ? "auto" : 0,
  }),
  withoutNavbarItem: {
    ml: { xs: "auto", lg: 0 },
  },
  menuIcon: ({ transparent }) => ({
    cursor: "pointer",
    display: { xs: "inline-block", lg: "none" },
    lineHeight: 0,
    py: 1.5,
    pl: 1.5,
    color: transparent ? "white" : "inherit",
  }),
  mobileContainer: ({ transparent }) => ({
    backgroundColor: transparent ? "white" : "transparent",
    shadow: transparent ? "lg" : "none",
    borderRadius: "xl",
    px: transparent ? 2 : 0,
  }),
};
