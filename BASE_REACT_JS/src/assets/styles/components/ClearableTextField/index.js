export default {
  adornment: {
    width: "18px",
  },
  icon: ({ palette, functions }) => ({
    width: "18px",
    height: "18px",
    color: functions.rgba(palette.black.main, 0.3),
    "&:hover": {
      color: functions.rgba(palette.black.main, 0.7),
    },
  }),
};
