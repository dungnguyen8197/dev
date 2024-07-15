// base styles
import boxShadows from "assets/theme/base/boxShadows";
import typography from "assets/theme/base/typography";
import colors from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";

const { lg } = boxShadows;
const { size } = typography;
const { initial, white, transparent, dark, gradients } = colors;
const { borderRadius } = borders;

export default {
  styleOverrides: {
    popper: {
      boxShadow: lg,
      padding: "8px",
      fontSize: size.sm,
      color: initial.main,
      textAlign: "left",
      backgroundColor: `${white.main}`,
      borderRadius: borderRadius.sm,
    },

    paper: {
      boxShadow: "none",
      backgroundColor: transparent.main,
    },

    option: {
      padding: "4px 16px",
      borderRadius: borderRadius.sm,
      fontSize: size.sm,
      color: initial.main,
      transition: "background-color 300ms ease, color 300ms ease",

      "&:hover, &:focus, &.Mui-selected, &.Mui-selected:hover, &.Mui-selected:focus": {
        backgroundColor: white.main,
        color: dark.main,
      },

      '&[aria-selected="true"]': {
        backgroundColor: `${white.main} !important`,
        color: `${dark.main} !important`,
      },
    },

    noOptions: {
      fontSize: size.sm,
      color: initial.main,
    },

    groupLabel: {
      color: dark.main,
    },

    loading: {
      fontSize: size.sm,
      color: initial.main,
    },

    input: {
      height: "10px",
    },

    tag: {
      display: "flex",
      alignItems: "center",
      height: "auto",
      padding: "4px",
      backgroundColor: gradients.dark.state,
      color: white.main,

      "& .MuiChip-label": {
        lineHeight: 1.2,
        padding: "0 10px 0 4px",
      },

      "& .MuiSvgIcon-root, & .MuiSvgIcon-root:hover, & .MuiSvgIcon-root:focus": {
        color: white.main,
        marginRight: 0,
      },
    },
  },
};
