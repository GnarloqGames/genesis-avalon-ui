import { useState, SyntheticEvent, Fragment } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import { useAuth } from "react-oidc-context";

function Auth() {
  const auth = useAuth();

  if (auth.isLoading) {
      return <Button color="inherit" disabled>Loading...</Button>;
  }

  if (auth.error) {
    return (
      <>
      <Button color="inherit" onClick={() => void auth.signinRedirect()}>Log in</Button>
      <AuthAlertSnackbar message={auth.error.message} />
      </>
    )
  }

  if (auth.isAuthenticated) {
    return (
      <>
        <Button href="/buildings" color="inherit">Buildings</Button>
        <Button href="/profile" color="inherit">Profile</Button>
        <Button color="inherit" onClick={() => void auth.removeUser()}>
          Log out
        </Button>
      </>
    );
  }

  return (
    <>
      <Button color="inherit" onClick={() => void auth.signinRedirect()}>Log in</Button>
    </>
  )
}

class snackbarProps {
  message: string
  constructor(message: string) {
    this.message = message
  }
}

function AuthAlertSnackbar(props: snackbarProps) {
  const [open, setOpen] = useState(true);

  const handleClose = (_event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const action = (
    <Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Fragment>
  );

  return (
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={props.message}
        action={action}
      />
  );
}

export default Auth;