export default {
  popper: ({ dropdown }) => ({
    zIndex: 10,
    display: dropdown ? "block" : "none",
  }),
  grow: ({ palette }) => ({
    transformOrigin: "left top",
    background: palette.white.main,
    mx: 2,
  }),
  dropdownContainer: ({ borders }) => ({
    ml: 2.5,
    borderRadius: borders.borderRadius.lg,
  }),
  dropdownSection: ({ borders, shadows }) => ({
    borderRadius: borders.borderRadius.lg,
    boxShadow: shadows[11],
    p: 2,
  }),
};
