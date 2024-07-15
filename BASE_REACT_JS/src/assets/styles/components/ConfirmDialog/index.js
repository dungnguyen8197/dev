export default {
  container: ({ breakpoints }) => ({
    "& .MuiDialog-container": {
      "& .MuiPaper-root": {
        width: "100%",
        maxWidth: "40vw",
        [breakpoints.down("lg")]: {
          maxWidth: "85vw",
        },
      },
    },
  }),
  header: {
    display: "flex",
    justifyContent: "space-between",
    px: 2,
    alignItems: "center",
    my: 1,
  },
  closeIcon: ({ palette }) => ({
    color: palette.grey[600],
    "&:hover": {
      color: palette.grey[800],
    },
  }),
  divider: ({ palette }) => ({
    m: 0,
    backgroundColor: palette.grey[600],
  }),
  content: {
    p: 2,
  },
  action: {
    my: 1.5,
    px: 3,
  },
  submitButton: ({ palette, borders: { borderRadius } }, { color }) => ({
    borderRadius: borderRadius.sm,
    backgroundColor: `${palette[color].main} !important`,
    "&:hover": {
      backgroundColor: palette[color].main,
    },
    "&:focus:not(:hover)": {
      backgroundColor: palette[color].main,
    },
    "& .MuiLoadingButton-loadingIndicator": {
      color: palette.black.main,
    },
  }),
  cancelButton: ({ palette: { grey }, borders: { borderRadius } }) => ({
    borderRadius: borderRadius.sm,
    borderColor: grey[600],
    "&:hover": {
      borderColor: grey[600],
    },
  }),
  cancelText: ({ palette: { grey } }) => ({
    color: grey[600],
  }),
};
