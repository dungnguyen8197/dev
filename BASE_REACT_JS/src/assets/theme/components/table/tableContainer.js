// base styles
import colors from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";

const { white } = colors;
const { borderRadius } = borders;

export default {
  styleOverrides: {
    root: {
      backgroundColor: white.main,
      // boxShadow: "0px 0px 5px 0px #00000033",
      borderRadius: borderRadius.md,
    },
  },
};
