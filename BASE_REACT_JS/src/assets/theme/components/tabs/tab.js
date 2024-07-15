// base styles
import typography from "assets/theme/base/typography";
import borders from "assets/theme/base/borders";
import colors from "assets/theme/base/colors";

const { size, fontWeightRegular } = typography;
const { borderRadius } = borders;
const { dark } = colors;

export default {
  styleOverrides: {
    root: {
      display: "flex",
      alignItems: "center",
      flexDirection: "row",
      flex: "1 1 auto",
      textAlign: "center",
      maxWidth: "unset !important",
      minWidth: "unset !important",
      minHeight: "unset !important",
      fontSize: size.md,
      fontWeight: fontWeightRegular,
      textTransform: "none",
      lineHeight: "inherit",
      padding: "4px",
      borderRadius: borderRadius.lg,
      color: `${dark.main} !important`,
      opacity: "1 !important",

      "& .material-icons, .material-icons-round": {
        marginBottom: "0 !important",
        marginRight: "6px",
      },

      "& svg": {
        marginBottom: "0 !important",
        marginRight: "6px",
      },

      "& i.MuiTab-iconWrapper": {
        marginBottom: 0,
      },
    },

    labelIcon: {
      paddingTop: "4px",
    },
  },
};
