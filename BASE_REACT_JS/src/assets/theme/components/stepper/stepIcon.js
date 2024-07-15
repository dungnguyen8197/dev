// base styles
import colors from "assets/theme/base/colors";
// helper functions
import boxShadow from "assets/theme/functions/boxShadow";

const { white } = colors;

export default {
  styleOverrides: {
    root: {
      background: "#9fc9ff",
      fill: "#9fc9ff",
      stroke: "#9fc9ff",
      strokeWidth: "10px",
      width: "13px",
      height: "13px",
      borderRadius: "50%",
      zIndex: 99,
      transition: "all 200ms linear",

      "&.Mui-active": {
        background: white.main,
        fill: white.main,
        stroke: white.main,
        borderColor: white.main,
        boxShadow: boxShadow([0, 0], [0, 2], white.main, 1),
      },

      "&.Mui-completed": {
        background: white.main,
        fill: white.main,
        stroke: white.main,
        borderColor: white.main,
        boxShadow: boxShadow([0, 0], [0, 2], white.main, 1),
      },
    },
  },
};
