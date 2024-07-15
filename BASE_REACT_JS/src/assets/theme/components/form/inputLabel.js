import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";

const { initial } = colors;
const { size } = typography;

export default {
  styleOverrides: {
    root: {
      fontSize: size.xs,
      color: initial.main,
      opacity: 0.4,
      lineHeight: "100%",
      marginTop: "-4px",
      marginLeft: "-2px",
      paddingTop: 0,

      display: "flex",
      alignItems: "center",
      justifyContainer: "center",

      "&.Mui-focused": {
        color: initial.main,
      },

      "&.MuiInputLabel-shrink": {
        marginTop: "2px !important",
        fontSize: size.md,

        "~ .MuiInputBase-root .MuiOutlinedInput-notchedOutline legend": {
          fontSize: "0.85em",
        },
      },
    },

    sizeSmall: {
      fontSize: size.xs,

      "&.MuiInputLabel-shrink": {
        fontSize: size.sm,

        "~ .MuiInputBase-root .MuiOutlinedInput-notchedOutline legend": {
          fontSize: "0.72em",
        },
      },
    },
  },
};
