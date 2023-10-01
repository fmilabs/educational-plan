import React from 'react';
import Button from '@mui/material/Button';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Typography from '@mui/material/Typography';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useAuth } from '../contexts/auth.context';
import { BrowserAuthError } from '@azure/msal-browser';
import { useMsal } from "@azure/msal-react";
import { apiCall, getApiError } from '../lib/utils';
import { AuthResponse } from '@educational-plan/types';
import { loginRequest } from '../../config/azure-config';
import { useSnackbar } from 'notistack';
import LoadingShade from './loading-shade';

export default function AuthSnippet() {
  const { state, signIn, signOut } = useAuth();
  const { instance } = useMsal();
  const { enqueueSnackbar } = useSnackbar();

  const [loadingOauth, setLoadingOauth] = React.useState(false);
  const [signInDialogOpen, setSignInDialogOpen] = React.useState(false);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = React.useState<null | HTMLElement>(null);

  const msalLogin = async () => {
    try {
      setLoadingOauth(true);
      const msalResponse = await instance.loginPopup(loginRequest);
      const response = await apiCall<AuthResponse>("auth/login/azure", "POST", undefined, {
        headers: {
          Authorization: `Bearer ${msalResponse.accessToken}`
        }
      });
      signIn(response);
      enqueueSnackbar("V-ați autentificat cu succes.");
    } catch (error) {
      if(error instanceof BrowserAuthError) {
        if(error.errorCode === "user_cancelled") {
          return;
        }
        enqueueSnackbar("A apărut o eroare. Reîncercați.");
        return;
      }
      if(getApiError(error) === "Unauthorized") {
        enqueueSnackbar("Nu sunteți înregistrat în aplicație. Dacă credeți că este o eroare, contactați administratorul.", {
          autoHideDuration: 10000,
        });
        return;
      }
      enqueueSnackbar(getApiError(error));
    } finally {
      setLoadingOauth(false);
    }
  }

  if (!state.user) {
    return (
      <>
        <Button color="inherit" onClick={msalLogin}>
          Autentificare
        </Button>
        <SignInDialog open={signInDialogOpen} setOpen={setSignInDialogOpen} />
        {loadingOauth && <LoadingShade position='fixed' title='Autentificare în progres...' /> }
      </>
    );
  }

  const onUserMenuClose = (action?: () => void) => {
    setUserMenuAnchorEl(null);
    action?.();
  };

  return (
    <>
      <Button color="inherit" onClick={(e) => setUserMenuAnchorEl(e.currentTarget)}>
        <AccountCircle />
        <Typography variant="body1" sx={{ ml: 0.5, textTransform: 'none', display: { xs: 'none', sm: 'block' } }} >
          {state.user.firstName} {state.user.lastName}
        </Typography>
      </Button>
      <Menu
        anchorEl={userMenuAnchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(userMenuAnchorEl)}
        onClose={() => onUserMenuClose()}
      >
        <MenuItem onClick={() => onUserMenuClose(signOut)}>
          Deconectare
        </MenuItem>
      </Menu>
    </>
  );
}

function SignInDialog({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {

  const auth = useAuth();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const signIn = async () => {
    try {
      const response = await apiCall<AuthResponse>("auth/login", "POST", { email, password });
      auth.signIn(response);
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Autentificare</DialogTitle>
      <DialogContent>
        <DialogContentText>

        </DialogContentText>
        <TextField
          autoFocus
          name='email'
          margin="dense"
          id="name"
          label="E-mail"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          autoFocus
          name='password'
          margin="dense"
          label="Parolă"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Anulați</Button>
        <Button onClick={signIn}>Autentificare</Button>
      </DialogActions>
    </Dialog>
  );
}
