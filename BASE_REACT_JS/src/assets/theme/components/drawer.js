export default {
  styleOverrides: {
    root: {},

    docked: {},
    paper: {
      "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
        backgroundColor: "transparent",
      },
      "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
        background: "#c1c1c1",
        borderRadius: "8px",
      },
      "&::-webkit-scrollbar": {
        width: "8px",
        height: "8px",
      },
    },
  },
};
