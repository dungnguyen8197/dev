// Base Styles
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";

const { primary, transparent, button } = colors;
const { size } = typography;

export default {
  base: {
    backgroundColor: transparent.main,
    height: "40px",
    color: primary.main,
    padding: "10px 24px",
    fontSize: size.button,
    "& .material-icon, .material-icons-round, svg": {
      fontSize: size.button,
    },
  },

  small: {
    minHeight: "32px",
    padding: "6px 16px",
    fontSize: "12px",
    "& .material-icon, .material-icons-round, svg": {
      fontSize: "12px",
    },
  },

  large: {
    minHeight: "47px",
    padding: "12px 28px",
    fontSize: size.button,
    "& .material-icon, .material-icons-round, svg": {
      fontSize: size.button,
    },
  },

  primary: {
    color: primary.main,
  },

  secondary: {
    color: button.active,
  },
  // inherit, success, error, info, warning
  // if add type go to index.js to add corresponding attribute. Example: outlinedInherit
  // https://mui.com/material-ui/api/button/
};
