// base styles
import colors from "assets/theme/base/colors";

const { transparent } = colors;

export default {
  styleOverrides: {
    select: {
      display: "grid",
      alignItems: "center",
      padding: `0 12px !important`,
      height: "44px",

      "& .Mui-selected": {
        backgroundColor: transparent.main,
      },
    },

    selectMenu: {
      background: "none",
      height: "none",
      minHeight: "none",
      overflow: "unset",
    },

    icon: {
      display: "none",
    },

    inputLabelRoot: {
      color: "red",
    },
    underline: {
      color: "red",
      "&::after": {
        borderBottom: "2px solid red",
      },
      "&::before": {
        borderBottom: "2px solid yellow",
      },
    },
  },
};
