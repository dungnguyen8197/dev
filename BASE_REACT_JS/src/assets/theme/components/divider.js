// base styles
import colors from "assets/theme/base/colors";
// helper functions
import rgba from "assets/theme/functions/rgba";

const { dark, white } = colors;

export default {
  styleOverrides: {
    root: {
      background: rgba(dark.main, 0.2),
      height: "1px",
      margin: "16px 0",
      borderBottom: "none",
      opacity: 0.25,
    },

    vertical: {
      background: rgba(dark.main, 0.2),
      width: "1px",
      height: "100%",
      margin: "0 16px",
      borderRight: "none",
    },

    light: {
      background: rgba(white.main, 0.2),

      "&.MuiDivider-vertical": {
        background: rgba(white.main, 0.2),
      },
    },
  },
};
