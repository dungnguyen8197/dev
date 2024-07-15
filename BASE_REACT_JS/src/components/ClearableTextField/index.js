import { memo } from "react";
import { TextField, IconButton, InputAdornment, Fade } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import { emptyFunction } from "utils/utils";
import styles from "assets/styles/components/ClearableTextField/index";

function ClearableTextField({ value, onChange, onEnter, ...rest }) {
  return (
    <TextField
      onKeyUp={(event) => {
        if (event.key === "Enter") onEnter();
      }}
      value={value}
      onChange={onChange}
      {...rest}
      InputProps={{
        endAdornment: (
          <InputAdornment sx={styles.adornment} position="end">
            <Fade in={Boolean(value)} timeout={200}>
              <IconButton onClick={() => onChange({ target: { value: "" } })} edge="end">
                <CloseIcon sx={styles.icon} />
              </IconButton>
            </Fade>
          </InputAdornment>
        ),
        autoComplete: "off",
      }}
    />
  );
}

ClearableTextField.defaultProps = {
  onEnter: emptyFunction,
};

ClearableTextField.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  onEnter: PropTypes.func,
};

export default memo(ClearableTextField);
