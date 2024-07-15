import { baseSpacing, drawerWidth } from "constant/layout";

export default {
  container: {
    display: "flex",
    backgroundColor: "#e1e1e1",
    width: "100%",
    minWidth: "fit-content",
  },
  drawer: ({ transitions, breakpoints }, { open, expand }) => ({
    // on open
    ...((open || expand) && {
      width: drawerWidth,
      transition: transitions.create("width", {
        easing: transitions.easing.sharp,
        duration: transitions.duration.enteringScreen,
      }),

      "& .MuiDrawer-paper": {
        p: 2,
        left: "16px",
        top: "16px",
        bottom: "16px",
        height: "calc( 100% - 32px )",
        border: "none",
        background: "linear-gradient(195deg,#42424a,#191919)",
        borderRadius: "12px",
        width: drawerWidth,
        transition: transitions.create("width", {
          easing: transitions.easing.sharp,
          duration: transitions.duration.enteringScreen,
        }),
      },
    }),
    // on close
    ...(!(open || expand) && {
      transition: transitions.create("width", {
        easing: transitions.easing.sharp,
        duration: transitions.duration.leavingScreen,
      }),
      width: `${baseSpacing * 7}px`,
      [breakpoints.up("sm")]: {
        width: `${baseSpacing * 8}px`,
      },
      "& .MuiDrawer-paper": {
        background: "linear-gradient(195deg,#42424a,#191919)",
        borderRadius: "12px",
        left: "16px",
        top: "16px",
        bottom: "16px",
        border: "none",
        height: "calc( 100% - 32px )",
        transition: transitions.create("width", {
          easing: transitions.easing.sharp,
          duration: transitions.duration.leavingScreen,
        }),
        width: `${baseSpacing * 7}px`,
        [breakpoints.up("sm")]: {
          width: `${baseSpacing * 8}px`,
        },
      },
    }),
  }),
  brand: ({ open, expand, brandDescription }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: open || expand || !brandDescription ? "flex-start" : "center",
    height: "48px",
    mt: open || expand ? 0 : 2,
    px: open || expand || !brandDescription ? 2 : 0,
  }),
  brandDescription: ({ open, expand }) => ({
    display: open || expand ? "block" : "none",
    pl: 2,
  }),
  brandOnly: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "48px",
  },
  divider: {
    backgroundImage: "linear-gradient(90deg,hsla(0,0%,100%,0.2),#fff,hsla(0,0%,100%,0.2))",
  },
  contentContainer: {
    width: "100%",
    ml: 4,
    mr: 2,
    minHeight: "100vh",
  },
};
