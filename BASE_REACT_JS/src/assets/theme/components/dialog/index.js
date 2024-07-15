import borders from "assets/theme/base/borders";
import boxShadows from "assets/theme/base/boxShadows";

const { borderRadius } = borders;
const { xxl } = boxShadows;

export default {
  styleOverrides: {
    paper: {
      margin: 0,
      borderRadius: borderRadius.xs,
      boxShadow: xxl,
    },

    paperFullScreen: {
      borderRadius: 0,
    },
  },
};
