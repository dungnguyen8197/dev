import colors from "assets/theme/base/colors";

const { initial, button } = colors;

const baseProperties = {
  fontFamily: "SVN-Gotham, sans-serif", // NORNAL TEXT
  fontFamily2: "SVN-Gotham, sans-serif", // HEADING
  fontWeightLighter: 100,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  // NORMAL
  fontSizeXXS: "12px", // overline
  fontSizeXS: "14px", // body 2
  fontSizeSM: "16px", // body 1
  fontSizeMD: "18px", // subtitle 2
  fontSizeLG: "20px", // subtitle 1
  // HEADING
  fontSizeXL: "20px", // h6-d6
  fontSize2XL: "24px", // h5-d5
  fontSize3XL: "28px", // h4-d4
  fontSize4XL: "32px", // h3-d3
  fontSize5XL: "48px", // h2-d2
  fontSize6XL: "72px", // h1-d1
  // NORMAL
  lineHeightXXS: "14px", // overline
  lineHeightXS: "18px", // body 2
  lineHeightSM: "20px", // body 1
  lineHeightMD: "22px", // subtitle 2
  lineHeightLG: "24px", // subtitle 1
  lineHeightXL: "24px", // d6
  lineHeight2XL: "28px", // d5
  lineHeight3XL: "32px", // d4
  lineHeight4XL: "36px", // d3
  lineHeight5XL: "52px", // d2
  lineHeight6XL: "78px", // d1
  // HEADING
  lineHeightHeadingXL: "24px", // h6
  lineHeightHeading2XL: "28px", // h5
  lineHeightHeading3XL: "36px", // h4
  lineHeightHeading4XL: "40px", // h3
  lineHeightHeading5XL: "56px", // h2
  lineHeightHeading6XL: "80px", // h1
  // Utility
  fontSizeButton: "16px",
  lineHeightButton: "20px",
};
// ****************************************************
// *                HEADING BASE                      *
// ****************************************************
const baseHeadingProperties = {
  fontFamily: baseProperties.fontFamily2,
  color: initial.main,
  fontWeight: baseProperties.fontWeightBold,
};
// ****************************************************
// *                NORMAL BASE                       *
// ****************************************************
const baseDisplayProperties = {
  fontFamily: baseProperties.fontFamily,
  color: initial.main,
  fontWeight: baseProperties.fontWeightRegular,
};

const typography = {
  fontFamily: baseProperties.fontFamily,
  fontFamily2: baseProperties.fontFamily2,
  fontWeightLighter: baseProperties.fontWeightLighter,
  fontWeightLight: baseProperties.fontWeightLight,
  fontWeightRegular: baseProperties.fontWeightRegular,
  fontWeightMedium: baseProperties.fontWeightMedium,
  fontWeightBold: baseProperties.fontWeightBold,
  // ****************************************************
  // *                    HEADING                       *
  // ****************************************************
  h1: {
    fontSize: baseProperties.fontSize6XL,
    lineHeight: baseProperties.lineHeightHeading6XL,
    ...baseHeadingProperties,
  },
  h2: {
    fontSize: baseProperties.fontSize5XL,
    lineHeight: baseProperties.lineHeightHeading5XL,
    ...baseHeadingProperties,
  },
  h3: {
    fontSize: baseProperties.fontSize4XL,
    lineHeight: baseProperties.lineHeightHeading4XL,
    ...baseHeadingProperties,
  },
  h4: {
    fontSize: baseProperties.fontSize3XL,
    lineHeight: baseProperties.lineHeightHeading3XL,
    ...baseHeadingProperties,
  },
  h5: {
    fontSize: baseProperties.fontSize2XL,
    lineHeight: baseProperties.lineHeightHeading2XL,
    ...baseHeadingProperties,
  },
  h6: {
    fontSize: baseProperties.fontSizeXL,
    lineHeight: baseProperties.lineHeightHeadingXL,
    ...baseHeadingProperties,
  },
  // ****************************************************
  // *                     NORMAL                       *
  // ****************************************************
  d1: {
    fontSize: baseProperties.fontSize6XL,
    lineHeight: baseProperties.lineHeightHeading6XL,
    ...baseDisplayProperties,
  },
  d2: {
    fontSize: baseProperties.fontSize5XL,
    lineHeight: baseProperties.lineHeightHeading5XL,
    ...baseDisplayProperties,
  },
  d3: {
    fontSize: baseProperties.fontSize4XL,
    lineHeight: baseProperties.lineHeightHeading4XL,
    ...baseDisplayProperties,
  },
  d4: {
    fontSize: baseProperties.fontSize3XL,
    lineHeight: baseProperties.lineHeightHeading3XL,
    ...baseDisplayProperties,
  },
  d5: {
    fontSize: baseProperties.fontSize2XL,
    lineHeight: baseProperties.lineHeightHeading2XL,
    ...baseDisplayProperties,
  },
  d6: {
    fontSize: baseProperties.fontSizeXL,
    lineHeight: baseProperties.lineHeightHeadingXL,
    ...baseDisplayProperties,
  },
  subtitle1: {
    ...baseDisplayProperties,
    fontSize: baseProperties.fontSizeLG,
    lineHeight: baseProperties.lineHeightLG,
  },
  subtitle2: {
    ...baseDisplayProperties,
    fontSize: baseProperties.fontSizeMD,
    lineHeight: baseProperties.lineHeightMD,
  },
  body1: {
    ...baseDisplayProperties,
    fontSize: baseProperties.fontSizeSM,
    lineHeight: baseProperties.lineHeightSM,
  },
  body2: {
    ...baseDisplayProperties,
    fontSize: baseProperties.fontSizeXS,
    lineHeight: baseProperties.lineHeightXS,
  },
  // ****************************************************
  // *                      SPAN                        *
  // ****************************************************
  caption: {
    ...baseDisplayProperties,
    fontSize: baseProperties.fontSizeXS,
    lineHeight: baseProperties.lineHeightXS,
  },
  overline: {
    ...baseDisplayProperties,
    fontSize: baseProperties.fontSizeXXS,
    lineHeight: baseProperties.lineHeightXXS,
  },
  // ****************************************************
  // *                   UTILITY                        *
  // ****************************************************
  button: {
    // type: span
    fontFamily: baseProperties.fontFamily,
    fontWeight: baseProperties.fontWeightRegular,
    color: button.text,
    fontSize: baseProperties.fontSizeButton,
    lineHeight: baseProperties.lineHeightButton,
  },

  size: {
    // NORMAL
    xxs: baseProperties.fontSizeXXS,
    xs: baseProperties.fontSizeXS,
    sm: baseProperties.fontSizeSM,
    md: baseProperties.fontSizeMD,
    lg: baseProperties.fontSizeLG,
    // HEADING
    xl: baseProperties.fontSizeXL,
    "2xl": baseProperties.fontSize2XL,
    "3xl": baseProperties.fontSize3XL,
    "4xl": baseProperties.fontSize4XL,
    "5xl": baseProperties.fontSize5XL,
    "6xl": baseProperties.fontSize6XL,
    button: baseProperties.fontSizeButton,
  },

  lineHeight: {
    xxs: baseProperties.lineHeightXXS, // overline
    xs: baseProperties.lineHeightXS, // body 2
    sm: baseProperties.lineHeightSM, // body 1
    md: baseProperties.lineHeightMD, // subtitle 2
    lg: baseProperties.lineHeightLG, // subtitle 1
    xl: baseProperties.lineHeightXL, // d6
    "2xl": baseProperties.lineHeight2XL, // d5
    "3xl": baseProperties.lineHeight3XL, // d4
    "4xl": baseProperties.lineHeight4XL, // d3
    "5xl": baseProperties.lineHeight5XL, // d2
    "6xl": baseProperties.lineHeight6XL, // d1
    button: baseProperties.lineHeightButton,
  },
};

export default typography;
