// base styles
import borders from "assets/theme/base/borders";

const { borderRadius } = borders;

export default {
  styleOverrides: {
    root: {
      display: "block",
      // padding: "16px 16px 0 16px",
      padding: 0,
      borderRadius: `${borderRadius.xl} ${borderRadius.xl} 0 0`,
    },
  },
};
