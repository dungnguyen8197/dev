import { IconButton, Tooltip } from "@mui/material";
import PropTypes from "prop-types";
import styles from "assets/styles/components/CmsAction";
import { emptyFunction } from "utils/utils";
import { memo } from "react";

function CmsAction({ children, tooltip, onAction, color, ...rest }) {
  return (
    <Tooltip title={tooltip}>
      <IconButton onClick={onAction} sx={(e) => styles.button(e, { color })} {...rest}>
        {children}
      </IconButton>
    </Tooltip>
  );
}

CmsAction.defaultProps = {
  tooltip: "",
  onAction: emptyFunction,
  color: "info",
};

CmsAction.propTypes = {
  tooltip: PropTypes.string,
  onAction: PropTypes.func,
  color: PropTypes.oneOf(["error", "info", "success", "warning"]),
};

export default memo(CmsAction);
