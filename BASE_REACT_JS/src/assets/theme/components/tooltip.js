// @mui material components
import Fade from "@mui/material/Fade";
// base styles
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";
import borders from "assets/theme/base/borders";

const { grey, white } = colors;
const { size, fontWeightRegular } = typography;
const { borderRadius } = borders;

export default {
  defaultProps: {
    arrow: true,
    TransitionComponent: Fade,
  },

  styleOverrides: {
    tooltip: {
      backgroundColor: grey[800],
      color: white.main,
      fontSize: size.xxs,
      fontWeight: fontWeightRegular,
      textAlign: "center",
      borderRadius: borderRadius.sm,
      opacity: 0.7,
      padding: "4px 8px ",
    },

    arrow: {
      color: grey[800],
    },
  },
};
