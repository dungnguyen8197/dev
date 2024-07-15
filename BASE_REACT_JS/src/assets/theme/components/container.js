import breakpoints from "assets/theme/base/breakpoints";

const {
  values: { sm, md, lg, xl, xxl },
} = breakpoints;

const SM = `@media (min-width: ${sm}px)`;
const MD = `@media (min-width: ${md}px)`;
const LG = `@media (min-width: ${lg}px)`;
const XL = `@media (min-width: ${xl}px)`;
const XXL = `@media (min-width: ${xxl}px)`;

export default {
  [SM]: {
    ".MuiContainer-root": {
      maxWidth: "576px !important",
      paddingLeft: "8px !important",
      paddingRight: "8px !important",
    },
  },
  [MD]: {
    ".MuiContainer-root": {
      maxWidth: "768px !important",
      paddingLeft: "12px !important",
      paddingRight: "12px !important",
    },
  },
  [LG]: {
    ".MuiContainer-root": {
      paddingLeft: "12px !important",
      paddingRight: "12px !important",
      maxWidth: "992px !important",
    },
  },
  [XL]: {
    ".MuiContainer-root": {
      paddingLeft: "24px !important",
      paddingRight: "24px !important",
      maxWidth: "1200px !important",
    },
  },
  [XXL]: {
    ".MuiContainer-root": {
      paddingLeft: "24px !important",
      paddingRight: "24px !important",
      maxWidth: "1200px !important",
    },
  },
};
