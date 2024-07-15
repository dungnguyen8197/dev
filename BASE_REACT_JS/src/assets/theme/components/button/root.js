// Base Styles
import typography from "assets/theme/base/typography";
import borders from "assets/theme/base/borders";

const { button } = typography;
const { borderRadius } = borders;

export default {
  ...button,
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: borderRadius.sm,
  padding: "10px 24px",
  textAlign: "center",
  textTransform: "none",
  backgroundSize: "150%",
  backgroundPositionX: "25%",
  transition: "all 150ms ease-in",

  "&:disabled": {
    pointerEvent: "none",
    opacity: 0.65,
  },

  "& .material-icons": {
    fontSize: "15px",
    marginTop: "-2px",
  },
};
