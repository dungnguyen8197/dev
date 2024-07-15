// Base Styles
import colors from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";
import typography from "assets/theme/base/typography";

const { inputBorderColor, black } = colors;
const { borderRadius } = borders;
const { size } = typography;

export default {
  styleOverrides: {
    root: {
      fontSize: size.xs,
      borderRadius: borderRadius.xs,

      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: inputBorderColor.main,
      },

      "&.Mui-focused": {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: inputBorderColor.focus,
          borderWidth: "1px",
        },
      },
    },

    notchedOutline: {
      borderColor: inputBorderColor.main,
    },

    input: {
      color: black.main,
      paddingTop: "8px",
      paddingBottom: "8px",
      paddingLeft: "12px",
      paddingRight: "12px",
    },

    inputSizeSmall: {
      fontSize: size.xs,
      paddingTop: "7px",
      paddingBottom: "7px",
      paddingLeft: "10px",
      paddingRight: "10px",
    },

    multiline: {
      color: black.main,
      padding: 0,
    },
  },
};
