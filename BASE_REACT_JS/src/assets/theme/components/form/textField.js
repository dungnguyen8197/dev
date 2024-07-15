// Base Styles
import colors from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";
// import rgba from "assets/theme/functions/rgba";

const { white, inputBorderColor } = colors;
const { borderRadius } = borders;

export default {
  styleOverrides: {
    root: {
      backgroundColor: white.main,
      borderRadius: borderRadius.sm,
      fieldset: {
        borderRadius: borderRadius.sm,
        borderColor: inputBorderColor.main,
      },
    },
  },
};
