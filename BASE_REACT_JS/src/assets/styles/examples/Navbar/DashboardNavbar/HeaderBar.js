import { headerHeight } from "constant/layout";

export default {
  appBar: ({ transitions }, { open, expand }) => ({
    height: headerHeight,
    mb: 4,
    width: "100%",
    zIndex: 999,
    position: "sticky",
    transition: transitions.create(["width", "margin"], {
      easing: transitions.easing.sharp,
      duration: transitions.duration.leavingScreen,
    }),
    ...((open || expand) && {
      transition: transitions.create(["width", "margin"], {
        easing: transitions.easing.sharp,
        duration: transitions.duration.enteringScreen,
      }),
    }),
  }),
  toolbar: ({ transparent }) => ({
    backgroundColor: transparent ? "rgba(255, 255, 255, 0.7)" : "#fff",
    mt: 2,
    borderRadius: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }),
  expandIcon: {
    display: "flex",
    alignItems: "center",
  },
  settingIcon: ({ palette }) => ({
    color: palette.initial.main,
  }),
  listContainer: {
    px: 2,
    py: 2,
  },
  list: ({ borders: { borderRadius } }) => ({
    width: "100%",
    borderRadius: `${borderRadius.md} !important`,
    minWidth: "100px",
    "& .MuiListItemButton-root": {
      mt: 0.5,
    },
  }),
  listItemButton: ({ borders: { borderRadius } }) => ({
    borderRadius: borderRadius.xs,
    display: "flex",
  }),
  listItem: {
    display: "inline",
  },
};
