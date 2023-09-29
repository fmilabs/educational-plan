import React from 'react';
import Typography from '@mui/material/Typography';
import { apiCall, useApiResult } from '../lib/utils';
import { DOMAIN_TYPES, IDomain, ISpecialization, STUDY_FORMS } from '@educational-plan/types';

import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MoreIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import BackIcon from '@mui/icons-material/ArrowBack';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import SpecializationDialog, { SpecializationDialogProps } from '../components/specialization-dialog';
import { useSnackbar } from 'notistack';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import DomainDialog, { DomainDialogProps } from '../components/domain-dialog';

export default function DomainPage() {
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams<{ id: string }>();
  const [domain, _error, _loading, refresh] = useApiResult(() => apiCall<IDomain>(`domains/${id}`, 'GET'), [id]);
  const [specializationMenu, setSpecializationMenu] = React.useState<{ specialization: ISpecialization; anchor: HTMLElement } | null>(null);
  const [domainDialogProps, setDomainDialogProps] = React.useState<DomainDialogProps>({
    open: false,
    onClose: (result) => {
      if(result === 'save') {
        refresh();
      }
      setDomainDialogProps((props) => ({ ...props, open: false, domain: undefined }));
    }
  });
  const [specializationDialogProps, setSpecializationDialogProps] = React.useState<SpecializationDialogProps>({
    open: false,
    onClose: (result) => {
      if(result === 'save') {
        refresh();
      }
      setSpecializationDialogProps((props) => ({ ...props, open: false, specialization: undefined }));
    }
  });

  const closeSpecializationMenu = (action?: () => void) => {
    setSpecializationMenu(null);
    action?.();
  }

  const editSpecialization = (specialization: ISpecialization) => {
    setSpecializationDialogProps((props) => ({ ...props, open: true, specialization }));
  }

  const deleteSpecialization = async (specialization: ISpecialization) => {
    if(!confirm(`Sunteți sigur că doriți să ștergeți specializarea ${specialization.name}?`)) return;
    try {
      await apiCall(`specializations/${specialization.id}`, 'DELETE');
      refresh();
      enqueueSnackbar('Specializarea a fost ștearsă.');
    } catch (error) {
      enqueueSnackbar('A apărut o eroare.');
    }
  }

  const deleteDomain = async (domain: IDomain) => {
    if(!confirm(`Sunteți sigur că doriți să ștergeți domeniul ${domain.name}?`)) return;
    try {
      await apiCall(`domains/${domain.id}`, 'DELETE');
      enqueueSnackbar('Domeniul a fost șters.');
      window.history.back();
    } catch (error) {
      enqueueSnackbar('A apărut o eroare.');
    }
  }

  if(!domain) {
    return null;
  }

  return (
    <>
      <Box sx={{ display: 'flex', mb: 2 }}>
        <IconButton onClick={() => window.history.back()} sx={{ mr: 1 }}>
          <BackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          {domain.name}
        </Typography>
        <PopupState variant='popover'>
          {(popupState) => (
            <>
              <IconButton {...bindTrigger(popupState)}>
                <MoreIcon />
              </IconButton>
              <Menu {...bindMenu(popupState)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <MenuItem
                  onClick={() => {
                    popupState.close();
                    setDomainDialogProps((props) => ({ ...props, open: true, domain }));
                  }}
                >
                  <ListItemIcon>
                    <EditIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Editați</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    popupState.close();
                    deleteDomain(domain);
                  }}
                >
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Ștergeți</ListItemText>
                </MenuItem>
              </Menu>
            </>
          )}
        </PopupState>

      </Box>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }} disablePadding>
        <ListItem disableGutters>
          <ListItemText primary="Nume" secondary={domain.name} />
        </ListItem>
        <ListItem disableGutters>
          <ListItemText primary="Tip" secondary={DOMAIN_TYPES[domain.type]} />
        </ListItem>
        <ListItem disableGutters>
          <ListItemText primary="Formă de învățământ" secondary={STUDY_FORMS[domain.studyForm]} />
        </ListItem>
      </List>
      <Box sx={{ display: 'flex', mt: 2 }}>
        <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
          Specializări
        </Typography>
        <Button variant="outlined" onClick={() => setSpecializationDialogProps((props) => ({ ...props, open: true }))}>
          Adăugați
        </Button>
      </Box>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }} disablePadding>
        {domain.specializations?.map((specialization) => (
          <ListItem disableGutters key={specialization.id}>
            <ListItemText primary={specialization.name} secondary={`${specialization.studyYears} ani de studiu`} />
            <IconButton onClick={(e) => setSpecializationMenu({ specialization, anchor: e.currentTarget })}>
              <MoreIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Menu
        anchorEl={specializationMenu?.anchor}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={!!specializationMenu}
        onClose={() => closeSpecializationMenu()}
      >
        <MenuItem onClick={() => closeSpecializationMenu(() => editSpecialization(specializationMenu!.specialization))}>
          Editați
        </MenuItem>
        <MenuItem onClick={() => closeSpecializationMenu(() => deleteSpecialization(specializationMenu!.specialization))}>
          Ștergeți
        </MenuItem>
      </Menu>
      <SpecializationDialog {...specializationDialogProps} />
      <DomainDialog {...domainDialogProps} />
    </>
  );
}
