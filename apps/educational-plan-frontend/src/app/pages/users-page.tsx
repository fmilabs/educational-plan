import React from 'react';
import { IUser, Paginated, ROLES } from '@educational-plan/types';
import { apiCall, useApiResult } from '../lib/utils';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { TablePaginationActionsProps } from '@mui/material/TablePagination/TablePaginationActions';
import UserDialog, { UserDialogProps } from '../components/user-dialog';
import LoadingShade from '../components/loading-shade';
import { enqueueSnackbar } from 'notistack';

export default function UsersPage() {

  const rowsPerPageOptions = [10, 25, 50, 100] as const;
  const [rowsPerPage, setRowsPerPage] = React.useState<typeof rowsPerPageOptions[number]>(10);
  const [page, setPage] = React.useState(0);

  const [users, error, loading, refresh] = useApiResult(
    () => apiCall<Paginated<IUser>>(`users?limit=${rowsPerPage}&offset=${page * rowsPerPage}`, 'GET'),
    [rowsPerPage, page]
  );
  const [userDialogProps, setUserDialogProps] = React.useState<UserDialogProps>({
    open: false,
    onClose: (result) => {
      if(result === 'save') {
        refresh();
      }
      setUserDialogProps((props) => ({ ...props, open: false, user: undefined }));
    }
  });

  const deleteUser = async (user: IUser) => {
    if(!confirm(`Sunteți sigur că doriți să ștergeți utilizatorul ${user.firstName} ${user.lastName}?`)) return;
    try {
      await apiCall(`users/${user.id}`, 'DELETE');
      enqueueSnackbar('Utilizatorul a fost șters.');
      refresh();
    } catch (error) {
      enqueueSnackbar('A apărut o eroare.');
    }
  }

  return (
    <>
      <Box sx={{ display: 'flex', mb: 2 }}>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          Utilizatori
        </Typography>
        <Button variant="outlined" onClick={() => setUserDialogProps((props) => ({ ...props, open: true }))}>
          Adăugați
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ position: 'relative' }}>
        {loading && <LoadingShade />}
        <Table sx={{ width: '100%' }}>
          <TableHead>
            <TableRow>
              <TableCell>Nume</TableCell>
              <TableCell>Prenume</TableCell>
              <TableCell>E-mail</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell sx={{ width: '90px' }}>Acțiuni</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.count === 0 && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography color='text.secondary'>
                    Nu există utilizatori.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography color='text.secondary'>
                    A apărut o eroare.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {users?.data.map((user) => (
              <TableRow key={user.id}>
                <TableCell component="th" scope="row">
                  {user.lastName}
                </TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{ROLES[user.role]}</TableCell>
                <TableCell sx={{ p: 0, minWidth: '80px' }}>
                  <IconButton onClick={() => setUserDialogProps(props => ({ ...props, open: true, user }))}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => deleteUser(user)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                count={users?.count || 0}
                page={page}
                onPageChange={(_, nextPage) => setPage(nextPage)}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={rowsPerPageOptions as any}
                ActionsComponent={TablePaginationActions}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(e.target.value as any);
                  setPage(0);
                }}
                labelRowsPerPage='Rezultate pe pagină:'
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} din ${count}`}
                sx={{ color: 'text.secondary', borderBottom: 'none' }}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <UserDialog {...userDialogProps} />
    </>
  );
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}
