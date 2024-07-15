import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";

const { inherit } = colors;
const { size, fontWeightRegular } = typography;

export default {
  styleOverrides: {
    root: {
      display: "inline-block",
      minHeight: "24px",
    },

    label: {
      display: "inline-block",
      fontSize: size.sm,
      fontWeight: fontWeightRegular,
      color: inherit.main,

      "&.Mui-disabled": {
        color: inherit.main,
      },
    },
  },
};
