// base styles
import borders from "assets/theme/base/borders";
import colors from "assets/theme/base/colors";

import linearGradient from "assets/theme/functions/linearGradient";

const { borderColor } = borders;
const { transparent, info } = colors;

export default {
  styleOverrides: {
    root: {
      "& .MuiSvgIcon-root": {
        width: "14px",
        height: "14px",
        color: transparent.main,
        border: `1px solid ${info.main}`,
        borderRadius: "50%",
      },

      "&:after": {
        transition: "opacity 250ms ease-in-out",
        content: `""`,
        position: "absolute",
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        backgroundImage: linearGradient(info.main, info.main),
        opacity: 0,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        margin: "auto",
      },

      "&:hover": {
        backgroundColor: transparent.main,
      },

      "&.Mui-focusVisible": {
        border: `2px solid ${info.main}`,
      },
    },

    colorPrimary: {
      color: borderColor.main,

      "&.Mui-checked": {
        color: info.main,

        "& .MuiSvgIcon-root": {
          border: `1px solid ${info.main}`,
        },

        "&:after": {
          opacity: 1,
        },
      },
    },

    colorSecondary: {
      color: borderColor.main,

      "&.Mui-checked": {
        color: info.main,

        "& .MuiSvgIcon-root": {
          borderColor: info.main,
        },

        "&:after": {
          opacity: 1,
        },
      },
    },
  },
};
