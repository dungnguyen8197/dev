export default {
  button: ({ palette }, { color }) => ({
    p: 0,
    my: 0,
    mx: 1,
    svg: {
      color: palette.grey[700],
    },
    "&:hover": {
      svg: {
        color: palette[color].main,
      },
    },
  }),
};
