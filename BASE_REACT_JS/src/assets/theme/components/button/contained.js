import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";

const { button, primary, info } = colors;
const { size } = typography;

export default {
  base: {
    backgroundColor: primary.main,
    height: "40px",
    color: button.text,
    padding: "10px 24px",
    fontSize: size.button,
    "& .material-icon, .material-icons-round, svg": {
      fontSize: "22px",
    },
  },

  small: {
    height: "32px",
    padding: "6px 16px",
    fontSize: size.xs,
    "& .material-icon, .material-icons-round, svg": {
      fontSize: "12px",
    },
  },

  large: {
    height: "52px",
    padding: "12px 28px",
    fontSize: size.button,

    "& .material-icon, .material-icons-round, svg": {
      fontSize: size.button,
    },
  },

  primary: {
    backgroundColor: primary.main,
  },

  secondary: {
    backgroundColor: info.main,
    "&:hover": {
      backgroundColor: info.focus,
    },
  },

  // inherit, success, error, info, warning
  // if add type go to index.js to add corresponding attribute. Example: outlinedInherit
  // https://mui.com/material-ui/api/button/
};
