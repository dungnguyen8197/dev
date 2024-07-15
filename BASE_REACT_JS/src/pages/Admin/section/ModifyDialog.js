import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Collapse, Divider } from "@mui/material";
import ClearableTextField from "components/ClearableTextField";
import PasswordTextField from "components/PasswordTextField";

export default function ModifyDialog({ modify, isLoading }) {
  return (
    <Dialog
      sx={({ breakpoints }) => ({
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "40vw",
            [breakpoints.down("lg")]: {
              maxWidth: "85vw",
            },
          },
        },
      })}
      fullWidth
      open={modify.isShowDialog}
      onClose={modify.handleClose}
    >
      <Box component="form" onSubmit={modify.formik.handleSubmit} py={2}>
        <Box sx={{ display: "flex", justifyContent: "space-between", px: 4, alignItems: "center" }}>
          <Typography variant="h5" color="initial.main">
            {modify.title}
          </Typography>
          <IconButton onClick={modify.handleClose} color="primary">
            <CloseIcon sx={({ palette }) => ({ color: palette.grey[700] })} />
          </IconButton>
        </Box>
        <Divider sx={({ palette }) => ({ backgroundColor: palette.grey[600] })} />
        <DialogContent sx={{ px: 4, pb: 1 }}>
          <Typography
            variant="body2"
            color="initial"
            sx={({ typography }) => ({ fontWeight: typography.fontWeightBold, mb: 1 })}
          >
            User Name
          </Typography>
          <ClearableTextField
            sx={{ width: "100%" }}
            name="user_name"
            value={modify.formik.values.user_name}
            onChange={modify.formik.handleChange}
          />
          <Collapse
            timeout={200}
            in={modify.formik.errors.user_name && modify.formik.touched.user_name}
          >
            <Typography
              mt={1}
              color="error"
              variant="body2"
              sx={({ typography }) => ({ fontSize: typography.fontSize.xxs })}
            >
              {modify.formik.errors.user_name}
            </Typography>
          </Collapse>

          <Typography
            variant="body2"
            color="initial"
            sx={({ typography }) => ({ fontWeight: typography.fontWeightBold, mb: 1, mt: 2 })}
          >
            Phone
          </Typography>
          <ClearableTextField
            name="phone"
            value={modify.formik.values.phone}
            onChange={modify.formik.handleChange}
            sx={{ width: "100%" }}
          />
          <Collapse timeout={200} in={modify.formik.errors.phone && modify.formik.touched.phone}>
            <Typography
              mt={1}
              color="error"
              variant="body2"
              sx={({ typography }) => ({ fontSize: typography.fontSize.xxs })}
            >
              {modify.formik.errors.phone}
            </Typography>
          </Collapse>

          <Typography
            variant="body2"
            color="initial"
            sx={({ typography }) => ({ fontWeight: typography.fontWeightBold, mb: 1, mt: 2 })}
          >
            Email
          </Typography>
          <ClearableTextField
            name="email"
            value={modify.formik.values.email}
            onChange={modify.formik.handleChange}
            sx={{ width: "100%" }}
          />
          <Collapse timeout={200} in={modify.formik.errors.email && modify.formik.touched.email}>
            <Typography
              mt={1}
              color="error"
              variant="body2"
              sx={({ typography }) => ({ fontSize: typography.fontSize.xxs })}
            >
              {modify.formik.errors.email}
            </Typography>
          </Collapse>

          <Typography
            variant="body2"
            color="initial"
            sx={({ typography }) => ({ fontWeight: typography.fontWeightBold, mb: 1, mt: 2 })}
          >
            Name
          </Typography>
          <ClearableTextField
            name="name"
            value={modify.formik.values.name}
            onChange={modify.formik.handleChange}
            sx={{ width: "100%" }}
          />
          <Collapse timeout={200} in={modify.formik.errors.name && modify.formik.touched.name}>
            <Typography
              mt={1}
              color="error"
              variant="body2"
              sx={({ typography }) => ({ fontSize: typography.fontSize.xxs })}
            >
              {modify.formik.errors.name}
            </Typography>
          </Collapse>

          {modify.isAdd && (
            <>
              <Typography
                variant="body2"
                color="initial"
                sx={({ typography }) => ({ fontWeight: typography.fontWeightBold, mb: 1, mt: 2 })}
              >
                Password
              </Typography>
              <PasswordTextField
                name="password"
                value={modify.formik.values.password}
                onChange={modify.formik.handleChange}
                sx={{ width: "100%" }}
              />
              <Collapse
                timeout={200}
                in={modify.formik.errors.password && modify.formik.touched.password}
              >
                <Typography
                  mt={1}
                  color="error"
                  variant="body2"
                  sx={({ typography }) => ({ fontSize: typography.fontSize.xxs })}
                >
                  {modify.formik.errors.password}
                </Typography>
              </Collapse>

              <Typography
                variant="body2"
                color="initial"
                sx={({ typography }) => ({ fontWeight: typography.fontWeightBold, mb: 1, mt: 2 })}
              >
                Confirm Password
              </Typography>
              <PasswordTextField
                name="confirm_password"
                value={modify.formik.values.confirm_password}
                onChange={modify.formik.handleChange}
                sx={{ width: "100%" }}
              />
              <Collapse
                timeout={200}
                in={modify.formik.errors.confirm_password && modify.formik.touched.confirm_password}
              >
                <Typography
                  mt={1}
                  color="error"
                  variant="body2"
                  sx={({ typography }) => ({ fontSize: typography.fontSize.xxs })}
                >
                  {modify.formik.errors.confirm_password}
                </Typography>
              </Collapse>
            </>
          )}
        </DialogContent>
        <Divider sx={({ palette }) => ({ backgroundColor: palette.grey[600] })} />
        <DialogActions sx={{ px: 4 }}>
          <LoadingButton
            type="submit"
            color="secondary"
            loading={isLoading}
            variant="contained"
            onClick={modify.formik.handleSubmit}
          >
            <Typography variant="body2" color="white.main">
              {modify.submitTitle}
            </Typography>
          </LoadingButton>
          <Button
            sx={({ palette: { grey } }) => ({
              borderColor: grey[600],
              "&:hover": {
                borderColor: grey[600],
              },
            })}
            variant="outlined"
            onClick={modify.handleClose}
            autoFocus
          >
            <Typography
              variant="body2"
              sx={({ palette: { grey } }) => ({
                color: grey[600],
              })}
            >
              {modify.closeTitle}
            </Typography>
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
