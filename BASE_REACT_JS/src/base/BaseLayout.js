import ConfirmDialog from "components/ConfirmDialog";
import SnackBar from "components/SnackBar";
import useConfirmDialog from "./hook/useConfirmDialog";
import useSnack from "./hook/useSnack";

function BaseLayout({ children }) {
  const snack = useSnack();
  const dialog = useConfirmDialog();

  return (
    <>
      <SnackBar
        type={snack.type}
        open={snack.open}
        message={snack.message}
        onClose={snack.handleClose}
      />
      <ConfirmDialog
        actionOptions={{
          submitTitle: dialog.submitTitle,
          closeTitle: dialog.closeTitle,
          onSubmit: dialog.onSubmit,
          onClose: dialog.onClose,
          submitColor: dialog.submitColor,
        }}
        isLoading={dialog.isLoading}
        title={dialog.title}
        content={dialog.content}
        open={dialog.open}
      />
      {children}
    </>
  );
}

export default BaseLayout;
