import borders from "assets/theme/base/borders";

const { borderColor } = borders;

export default {
  styleOverrides: {
    root: {
      padding: 0,
    },

    dividers: {
      borderTop: `1px solid ${borderColor.main}`,
      borderBottom: `1px solid ${borderColor.main}`,
    },
  },
};
