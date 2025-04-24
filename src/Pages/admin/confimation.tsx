import { Button, ButtonProps, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";


interface conformprops{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    confirmColor?: ButtonProps['color'];
    loading?: boolean;
}

const ConfirmDialog: React.FC<conformprops> = ({
    open,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmColor = 'error',
    loading = false
  }) => {
    return (
      <Dialog
        open={open}
        onClose={onCancel}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            color={confirmColor}
            variant="contained"
            disabled={loading}
            autoFocus
          >
            {confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default ConfirmDialog;