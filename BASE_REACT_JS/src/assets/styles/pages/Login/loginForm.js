import backgroundImage from "assets/images/login/background.jpg";

export default {
  container: {
    height: "100vh",
  },
  loginContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "10px",
    maxWidth: "425px",
    width: "100%",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  avatar: ({ palette: { text } }) => ({
    bgcolor: text.main,
  }),
  textField: ({ borders: { borderRadius } }) => ({
    mt: 2,
    fieldset: {
      borderRadius: `${borderRadius.xs} !important`,
    },
  }),
  buttonSubmit: ({ palette: { grey }, borders: { borderRadius } }) => ({
    backgroundColor: `${grey[800]} !important`,
    borderRadius: `${borderRadius.xs} !important`,
  }),
  form: {
    width: "100%",
    height: "200px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  gridContainer: ({ palette: { grey } }) => ({
    backgroundColor: grey[100],
  }),
  brand: {
    fontSize: "70px",
  },
  backgroundImage: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100vw",
    height: "100vh",
    backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05)),url(${backgroundImage})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
};
