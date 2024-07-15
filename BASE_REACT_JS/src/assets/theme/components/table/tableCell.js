// base styles
import borders from "assets/theme/base/borders";
import breakpoints from "assets/theme/base/breakpoints";
import colors from "assets/theme/base/colors";

const { borderWidth } = borders;
const { grey } = colors;

const {
  values: { xs, lg },
} = breakpoints;

const XS = `@media (min-width: ${xs}px)`;
const LG = `@media (min-width: ${lg}px)`;

export default {
  styleOverrides: {
    root: {
      borderBottom: `${borderWidth[1]} solid ${grey[400]}`,
      fontSize: "14px",
      padding: "12px 24px",
      [XS]: {
        padding: "12px 16px",
      },
      [LG]: {
        padding: "12px 24px",
      },
    },
  },
};
