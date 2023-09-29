import React from 'react';
import { DOMAIN_TYPES, DomainType, IDomain, STUDY_FORMS, StudyForm } from "@educational-plan/types";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { apiCall } from '../lib/utils';
import { useSnackbar } from 'notistack';
import LoadingShade from './loading-shade';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export interface DomainDialogProps {
  open: boolean
  onClose: (result: 'dismiss' | 'save') => void;
  domain?: IDomain;
}

type DomainForm = Omit<IDomain, 'id'>;
function getInitialValues(domain?: IDomain): DomainForm {
  return {
    name: domain?.name || '',
    studyForm: domain?.studyForm || StudyForm.IF,
    type: domain?.type || DomainType.Bachelor,
  }
}

export default function DomainDialog({ open, onClose, domain }: DomainDialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = React.useState(false);
  const [domainForm, setDomainForm] = React.useState<DomainForm>(getInitialValues(domain));

  React.useEffect(() => {
    if(!open) return;
    setDomainForm(getInitialValues(domain));
  }, [domain, open]);

  function setDomainFormField<K extends keyof DomainForm>(field: K, value: DomainForm[K]) {
    setDomainForm({ ...domainForm, [field]: value });
  }

  async function saveDomain(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setIsLoading(true);
      if(!domain) {
        await apiCall('domains', 'POST', domainForm);
      } else {
        await apiCall(`domains/${domain.id}`, 'PUT', domainForm);
      }
      enqueueSnackbar('Domeniul a fost salvat.');
      onClose('save');
    } catch (error) {
      enqueueSnackbar('A apărut o eroare.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onClose={() => onClose('dismiss')} fullWidth maxWidth={'xs'}>
      { isLoading && <LoadingShade mode='linear' /> }
      <form id="domainForm" onSubmit={saveDomain}>
        <DialogTitle>{!domain ? 'Adăugare domeniu' : 'Editare domeniu' }</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            name='domainName'
            margin="dense"
            label="Nume"
            type="text"
            fullWidth
            required
            value={domainForm.name}
            onChange={(e) => setDomainFormField('name', e.target.value)}
          />
          <FormControl fullWidth margin='dense'>
            <InputLabel id="type">Tip</InputLabel>
            <Select
              labelId="type"
              value={domainForm.type}
              label="Tip"
              onChange={(e) => setDomainFormField('type', e.target.value as DomainType)}
            >
              {Object.values(DomainType).map((domainType) => (
                <MenuItem key={domainType} value={domainType}>{DOMAIN_TYPES[domainType]}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin='dense'>
            <InputLabel id="studyForm">Formă de studiu</InputLabel>
            <Select
              labelId="studyForm"
              value={domainForm.studyForm}
              label="Formă de studiu"
              onChange={(e) => setDomainFormField('studyForm', e.target.value as StudyForm)}
            >
              {Object.values(StudyForm).map((studyForm) => (
                <MenuItem key={studyForm} value={studyForm}>{STUDY_FORMS[studyForm]}</MenuItem>
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
