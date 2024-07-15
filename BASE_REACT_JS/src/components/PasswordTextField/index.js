import { useState } from "react";
import PropTypes from "prop-types";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { emptyFunction } from "utils/utils";
import styles from "assets/styles/components/PasswordTextField/index";

function PasswordTextField({ value, onChange, onEnter, ...rest }) {
  const [isShowPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  return (
    <TextField
      onKeyUp={(event) => {
        if (event.key === "Enter") onEnter();
      }}
      type={isShowPassword ? "text" : "password"}
      onChange={onChange}
      value={value}
      {...rest}
      InputProps={{
        endAdornment: (
          <InputAdornment sx={styles.adornment} position="end">
            {!isShowPassword ? (
              <IconButton onClick={handleTogglePassword}>
                <VisibilityOff sx={styles.icon} />
              </IconButton>
            ) : (
              <IconButton onClick={handleTogglePassword}>
                <Visibility sx={styles.icon} />
              </IconButton>
            )}
          </InputAdornment>
        ),
        autoComplete: "off",
      }}
    />
  );
}

PasswordTextField.defaultProps = {
  onEnter: emptyFunction,
};

PasswordTextField.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  onEnter: PropTypes.func,
};

export default PasswordTextField;
