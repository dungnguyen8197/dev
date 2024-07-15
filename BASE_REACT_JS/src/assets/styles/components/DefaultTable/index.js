export default {
  titleText: ({ typography, palette }) => ({
    fontWeight: typography.fontWeightBold,
    color: palette.grey[700],
    my: 0.5,
  }),
  pagination: ({ typography }) => ({
    fontSize: typography.size.xs,
    "& .MuiTablePagination-selectLabel": {
      fontSize: typography.size.xs,
    },
    "& 	.MuiTablePagination-displayedRows": {
      fontSize: typography.size.xs,
    },
  }),
  loadingContainer: {
    width: "100%",
    display: "flex",
    py: 2,
    justifyContent: "center",
  },
};
