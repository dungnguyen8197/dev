import { useState } from "react";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SvgIcon from "@mui/material/SvgIcon";
import Fade from "@mui/material/Fade";
// custom styles
import styles from "assets/styles/pages/Login/loginForm";
// custom hook
import { ReactComponent as VgsIcon } from "assets/images/logo/vgs_color.svg";
import ClearableTextField from "components/ClearableTextField";
import PasswordTextField from "components/PasswordTextField";
import useSubmit from "../hook/useSubmit";

function LoginForm() {
  const [isLoading] = useState(true);
  const { formik } = useSubmit();

  return (
    <Fade in={isLoading} timeout={1500}>
      <Box sx={styles.backgroundImage}>
        <Box component={Paper} m={4} py={6} px={4} sx={styles.loginContainer}>
          <Box sx={styles.formContainer}>
            <Box sx={styles.brand}>
              <SvgIcon component={VgsIcon} inheritViewBox />
            </Box>
            <Typography mt={2} color="text" component="h1" variant="h5">
              Đăng nhập
            </Typography>
            <Box component="form" style={styles.form} onSubmit={formik.handleSubmit}>
              <ClearableTextField
                fullWidth
                label="Tên đăng nhập"
                name="user_name"
                value={formik.values.user_name}
                onChange={(e) => formik.setFieldValue("user_name", e.target.value)}
                sx={styles.textField}
                autoFocus
              />
              {formik.errors.user_name && formik.touched.user_name && (
                <Typography color="error" variant="caption">
                  {formik.errors.user_name}
                </Typography>
              )}
              <PasswordTextField
                fullWidth
                name="password"
                label="Mật khẩu"
                id="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                sx={styles.textField}
              />
              {formik.errors.password && formik.touched.password && (
                <Typography color="error" variant="caption">
                  {formik.errors.password}
                </Typography>
              )}
              <Box my={2}>
                <Button type="submit" fullWidth variant="contained" sx={styles.buttonSubmit}>
                  <Typography color="white.main">Đăng nhập</Typography>
                </Button>
              </Box>
            </Box>
            <Link color="inherit" href="https://vgsgroup.net/">
              <Typography mt={4} variant="body2" color="text.secondary" align="center">
                Copyright © VGS Group {new Date().getFullYear()}.
              </Typography>
            </Link>
          </Box>
        </Box>
      </Box>
    </Fade>
  );
}

export default LoginForm;
