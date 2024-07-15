// Base Styles
import borders from "assets/theme/base/borders";

const { borderRadius } = borders;

export default {
  styleOverrides: {
    root: {
      borderRadius: borderRadius.md,
    },

    media: {
      width: "auto",
    },
  },
};
