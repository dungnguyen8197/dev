import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
// icon
import CloseIcon from "@mui/icons-material/Close";
import { memo } from "react";
import styles from "assets/styles/components/ConfirmDialog/index";
import { emptyFunction } from "utils/utils";

function ConfirmDialog({ open, actionOptions, title, content, isLoading, ...rest }) {
  return (
    <Dialog sx={styles.container} open={open} onClose={actionOptions.onClose} {...rest}>
      <Box sx={styles.header}>
        <Typography variant="h5" color="initial.main">
          {title}
        </Typography>
        <IconButton onClick={actionOptions.onClose}>
          <CloseIcon sx={styles.closeIcon} />
        </IconButton>
      </Box>
      <Divider sx={styles.divider} />
      <DialogContent sx={styles.content}>
        <Box dangerouslySetInnerHTML={{ __html: content }} />
      </DialogContent>
      <Divider sx={styles.divider} />
      <DialogActions sx={styles.action}>
        <LoadingButton
          loading={isLoading}
          variant="contained"
          onClick={actionOptions.onSubmit}
          sx={(e) => styles.submitButton(e, { color: actionOptions.submitColor })}
        >
          <Typography color="white.main">{actionOptions.submitTitle}</Typography>
        </LoadingButton>
        <Button sx={styles.cancelButton} variant="outlined" onClick={actionOptions.onClose}>
          <Typography sx={styles.cancelText}>{actionOptions.closeTitle}</Typography>
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmDialog.defaultProps = {
  isLoading: false,
  open: false,
  title: "",
  content: "",
  actionOptions: {
    submitTitle: "Xác nhận",
    closeTitle: "Hủy",
    onClose: emptyFunction,
    onSubmit: emptyFunction,
    submitColor: "info",
  },
};

ConfirmDialog.propTypes = {
  isLoading: PropTypes.bool,
  open: PropTypes.bool,
  actionOptions: PropTypes.shape({
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    submitTitle: PropTypes.string,
    closeTitle: PropTypes.string,
    submitColor: PropTypes.oneOf(["error", "info", "success", "warning"]).isRequired,
  }),
  title: PropTypes.string,
  content: PropTypes.string,
};

export default memo(ConfirmDialog);
