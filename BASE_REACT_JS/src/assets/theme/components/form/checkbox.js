import borders from "assets/theme/base/borders";
import colors from "assets/theme/base/colors";
import linearGradient from "assets/theme/functions/linearGradient";

const { borderColor, borderRadius } = borders;
const { transparent, info } = colors;

export default {
  styleOverrides: {
    root: {
      "& .MuiSvgIcon-root": {
        backgroundPosition: "center",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        width: "16px",
        height: "16px",
        color: transparent.main,
        border: `1px solid ${borderColor.main}`,
        borderRadius: borderRadius.sm,
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
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 -1 22 22'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2.5' d='M6 10l3 3l6-6'/%3e%3c/svg%3e"), ${linearGradient(
            info.main,
            info.main
          )}`,
          borderColor: info.main,
        },
      },
    },

    colorSecondary: {
      color: borderColor.main,

      "& .MuiSvgIcon-root": {
        color: info.main,
        "&.Mui-checked": {
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 -1 22 22'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2.5' d='M6 10l3 3l6-6'/%3e%3c/svg%3e"), ${linearGradient(
            info.main,
            info.main
          )}`,
          borderColor: info.main,
        },
      },
    },
  },
};
