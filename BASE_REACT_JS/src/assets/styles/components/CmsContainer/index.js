export default {
  container: ({ palette, borders }) => ({
    backgroundColor: palette.white.main,
    borderRadius: borders.borderRadius.md,
    border: `1px solid ${palette.grey[400]}`,
  }),
  header: ({ palette }) => ({
    display: "flex",
    justifyContent: "space-between",
    px: 4,
    py: 2,
    borderBottom: `1px solid ${palette.grey[400]}`,
  }),
  showSearchButton: ({ palette }) => ({
    py: 0,
    px: 2,
    mx: 2,
    borderColor: palette.grey[400],
    "&:hover": {
      borderColor: palette.grey[400],
    },
  }),
  showSearchIcon: ({ palette }) => ({
    color: palette.initial.main,
    width: "16px",
    height: "16px",
  }),
  addButton: {
    py: 0,
    px: 2,
  },
  addIcon: ({ palette }) => ({
    color: palette.white.main,
    mr: 0.5,
    width: "16px",
    height: "16px",
  }),
  searchContainer: ({ palette }) => ({
    display: "flex",
    justifyContent: "space-between",
    px: 4,
    py: 2,
    borderBottom: `1px solid ${palette.grey[400]}`,
  }),
  searchField: {
    width: "100%",
    maxWidth: "200px",
  },
  searchButton: ({ palette }) => ({
    float: "right",
    py: 0,
    px: 2,
    borderColor: palette.grey[400],
    "&:hover": {
      borderColor: palette.grey[400],
    },
  }),
  searchIcon: ({ palette }) => ({
    color: palette.initial.main,
    mr: 0.5,
    width: "16px",
    height: "16px",
  }),
};
