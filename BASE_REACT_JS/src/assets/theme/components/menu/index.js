// base styles
import boxShadows from "assets/theme/base/boxShadows";
import typography from "assets/theme/base/typography";
import colors from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";

const { lg } = boxShadows;
const { size } = typography;
const { initial, white } = colors;
const { borderRadius } = borders;

export default {
  defaultProps: {
    disableAutoFocusItem: true,
  },

  styleOverrides: {
    paper: {
      minWidth: "160px",
      boxShadow: lg,
      padding: "16px 8px",
      fontSize: size.sm,
      color: initial.main,
      textAlign: "left",
      backgroundColor: `${white.main} !important`,
      borderRadius: borderRadius.xs,
    },
  },
};
