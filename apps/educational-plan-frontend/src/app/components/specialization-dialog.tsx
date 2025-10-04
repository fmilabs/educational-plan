import React from 'react';
import { ISpecialization } from "@educational-plan/types";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';
import { apiCall } from '../lib/utils';
import { useSnackbar } from 'notistack';
import LoadingShade from './loading-shade';
import { Autocomplete } from '@mui/material';

export interface SpecializationDialogProps {
  open: boolean
  onClose: (result: 'dismiss' | 'save') => void;
  specialization?: ISpecialization;
}

type SpecializationForm = Omit<ISpecialization, 'id' | 'domain' | 'series'> & { domainId: string; series: number[] };

export default function SpecializationDialog({ open, onClose, specialization }: SpecializationDialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const { id: domainId } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = React.useState(false);
  const [specializationForm, setSpecializationForm] = React.useState<SpecializationForm>({
    name: specialization?.name || '',
    studyYears: specialization?.studyYears || '' as any,
    series: specialization?.series?.map(s => s.number) || [],
    domainId: domainId!,
  });

  React.useEffect(() => {
    if(!open) return;
    setSpecializationForm({
      name: specialization?.name || '',
      studyYears: specialization?.studyYears || '' as any,
      series: specialization?.series?.map(s => s.number) || [],
      domainId: domainId!,
    });
  }, [specialization, open]);

  function setSpecializationFormField<K extends keyof SpecializationForm>(field: K, value: SpecializationForm[K]) {
    setSpecializationForm({ ...specializationForm, [field]: value });
  }

  async function saveSpecialization(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setIsLoading(true);
      if(!specialization) {
        await apiCall('specializations', 'POST', specializationForm);
      } else {
        await apiCall(`specializations/${specialization.id}`, 'PUT', specializationForm);
      }
      enqueueSnackbar('Programul de studiu a fost salvat.');
      onClose('save');
    } catch (error) {
      enqueueSnackbar('A apărut o eroare.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onClose={() => onClose('dismiss')}>
      { isLoading && <LoadingShade mode='linear' /> }
      <form id="specializationForm" onSubmit={saveSpecialization}>
        <DialogTitle>{!specialization ? 'Adăugare program de studiu' : 'Editare program de studiu' }</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            name='specializationName'
            margin="dense"
            label="Nume"
            type="text"
            fullWidth
            required
            value={specializationForm.name}
            onChange={(e) => setSpecializationFormField('name', e.target.value)}
          />
          <TextField
            name='specializationYears'
            margin="dense"
            label="Ani de studiu"
            type="number"
            fullWidth
            required
            InputProps={{ inputProps: { min: 0, max: 10 } }}
            value={specializationForm.studyYears}
            onChange={(e) => setSpecializationFormField('studyYears', +e.target.value || '' as any)}
          />
          <Autocomplete
            multiple
            options={[]}
            freeSolo
            value={specializationForm.series}
            onChange={(_, newValue) => {
              setSpecializationFormField('series', newValue.map(v => parseInt(v as string)).filter(v => !isNaN(v) && v >= 0 && v < 10));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Serii"
                type='number'
                margin="dense"
                inputMode='numeric'
                fullWidth
                helperText='Apăsați Enter după fiecare serie adăugată. Seria trebuie să fie un număr între 0 și 9.'
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose('dismiss')}>Anulați</Button>
          <Button type='submit'>Salvați</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
