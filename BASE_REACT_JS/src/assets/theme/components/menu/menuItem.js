// base styles
import colors from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";
import typography from "assets/theme/base/typography";

const { initial, grey } = colors;
const { borderRadius } = borders;
const { size } = typography;

export default {
  styleOverrides: {
    root: {
      padding: `4.8px 16px`,
      borderRadius: borderRadius.sm,
      fontSize: size.sm,
      color: initial.main,
      transition: "background-color 300ms ease, color 300ms ease",

      "&:hover, &:focus, &.Mui-selected, &.Mui-selected:hover, &.Mui-selected:focus": {
        backgroundColor: grey[400],
      },
    },
  },
};
