import PropTypes from "prop-types";
import { Alert, Snackbar } from "@mui/material";
import { memo } from "react";
import styles from "assets/styles/components/Snackbar/index";

function SnackBar({ open, onClose, message, type, variant, ...rest }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={onClose}
      {...rest}
    >
      <Alert variant={variant} color={type} severity={type} sx={styles.fullWidth}>
        {message}
      </Alert>
    </Snackbar>
  );
}

SnackBar.defaultProps = {
  open: false,
  message: "",
  type: "success",
  variant: "standard",
};

SnackBar.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string,
  type: PropTypes.oneOf(["error", "info", "success", "warning"]),
  variant: PropTypes.string,
};

export default memo(SnackBar);
