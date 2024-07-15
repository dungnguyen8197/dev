import borders from "assets/theme/base/borders";
import colors from "assets/theme/base/colors";

const { borderRadius } = borders;
const { light } = colors;

export default {
  styleOverrides: {
    root: {
      height: "6px",
      borderRadius: borderRadius.md,
      overflow: "visible",
      position: "relative",
    },

    colorPrimary: {
      backgroundColor: light.main,
    },

    colorSecondary: {
      backgroundColor: light.main,
    },

    bar: {
      height: "6px",
      borderRadius: borderRadius.sm,
      position: "absolute",
      transform: `translate(0, 0) !important`,
      transition: "width 0.6s ease !important",
    },
  },
};
