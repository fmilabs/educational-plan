import React from 'react';
import { IDomain, IUser, ROLES, Role } from "@educational-plan/types";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { apiCall, getApiError } from '../lib/utils';
import { useSnackbar } from 'notistack';
import LoadingShade from './loading-shade';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export interface UserDialogProps {
  open: boolean
  onClose: (result: 'dismiss' | 'save', domain?: IDomain) => void;
  user?: IUser;
}

type UserForm = Omit<IUser, 'id'>;
function getInitialValues(user?: IUser): UserForm {
  return {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    role: user?.role || Role.Teacher,
  }
}

export default function UserDialog({ open, onClose, user }: UserDialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = React.useState(false);
  const [userForm, setUserForm] = React.useState<UserForm>(getInitialValues(user));

  React.useEffect(() => {
    if(!open) return;
    setUserForm(getInitialValues(user));
  }, [user, open]);

  function setUserFormField<K extends keyof UserForm>(field: K, value: UserForm[K]) {
    setUserForm({ ...userForm, [field]: value });
  }

  async function saveUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setIsLoading(true);
      let result: IDomain;
      if(!user) {
        result = await apiCall('users', 'POST', userForm);
      } else {
        result = await apiCall(`users/${user.id}`, 'PUT', userForm);
      }
      enqueueSnackbar('Utilizatorul a fost salvat.');
      onClose('save', result);
    } catch (error) {
      enqueueSnackbar(getApiError(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onClose={() => onClose('dismiss')} fullWidth maxWidth={'xs'}>
      { isLoading && <LoadingShade mode='linear' /> }
      <form id="userForm" onSubmit={saveUser}>
        <DialogTitle>{!user ? 'Adăugare utilizator' : 'Editare utilizator' }</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            name='userFirstName'
            margin="dense"
            label="Prenume"
            type="text"
            fullWidth
            required
            value={userForm.firstName}
            onChange={(e) => setUserFormField('firstName', e.target.value)}
          />
          <TextField
            autoFocus
            name='userLastName'
            margin="dense"
            label="Nume"
            type="text"
            fullWidth
            required
            value={userForm.lastName}
            onChange={(e) => setUserFormField('lastName', e.target.value)}
          />
          <TextField
            disabled={!!user}
            autoFocus
            name='userEmail'
            margin="dense"
            label="E-mail"
            type="email"
            required={!user}
            fullWidth
            value={userForm.email}
            onChange={(e) => setUserFormField('email', e.target.value)}
          />
          <FormControl fullWidth margin='dense'>
            <InputLabel id="role">Rol</InputLabel>
            <Select
              labelId="role"
              value={userForm.role}
              label="Rol"
              onChange={(e) => setUserFormField('role', e.target.value as Role)}
            >
              {Object.values(Role).map((role) => (
                <MenuItem key={role} value={role}>{ROLES[role]}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose('dismiss')}>Anulați</Button>
          <Button type='submit'>Salvați</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
