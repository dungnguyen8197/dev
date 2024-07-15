// Base Styles
import colors from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";
import boxShadows from "assets/theme/base/boxShadows";
// Helper Function
import rgba from "assets/theme/functions/rgba";

const { black, white } = colors;
const { borderWidth, borderRadius } = borders;
const { sm } = boxShadows;

export default {
  styleOverrides: {
    root: {
      display: "flex",
      flexDirection: "column",
      wordWrap: "break-word",
      backgroundColor: white.main,
      backgroundClip: "border-box",
      border: `${borderWidth[0]} solid ${rgba(black.main, 0.125)}`,
      borderRadius: borderRadius.md,
      boxShadow: sm,
      overflow: "hidden",
      padding: "16px",
    },
  },
};
