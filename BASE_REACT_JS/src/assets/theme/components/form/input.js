import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";

const { info, inputBorderColor, grey } = colors;
const { size } = typography;

export default {
  styleOverrides: {
    root: {
      fontSize: size.xs,
      color: grey[700],

      "&:hover:not(.Mui-disabled):before": {
        borderBottom: `1px solid ${inputBorderColor.main}`,
      },

      "&:before": {
        borderColor: inputBorderColor.main,
      },

      "&:after": {
        borderColor: info.main,
      },
    },
  },
};
