export default {
  popper: ({ dropdown }) => ({
    zIndex: 10,
    display: dropdown ? "block" : "none",
  }),
  grow: ({ palette }) => ({
    transformOrigin: "left bottom",
    background: palette.white.main,
  }),
  dropdownContainer: ({ borders }) => ({
    borderRadius: borders.borderRadius.lg,
  }),
  dropdownSection: ({ borders, shadows }) => ({
    borderRadius: borders.borderRadius.lg,
    boxShadow: shadows[11],
    p: 2,
    mt: 2,
  }),
};
