import React from 'react';
import { DOMAIN_TYPES, ICourse, IDomain } from "@educational-plan/types";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { apiCall, romanize, useApiResult } from '../lib/utils';
import { useSnackbar } from 'notistack';
import LoadingShade from './loading-shade';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FormControlLabel, Switch } from '@mui/material';

export interface CourseDialogProps {
  open: boolean
  onClose: (result: 'dismiss' | 'save', domain?: IDomain) => void;
  course?: ICourse;
}

type CourseForm = Omit<ICourse, 'id' | 'curriculumPath' | 'user' | 'specialization'> & { specializationId: string };
function getInitialValues(course?: ICourse): CourseForm {
  return {
    name: course?.name || '',
    credits: course?.credits || '' as any,
    year: course?.year || '' as any,
    semester: course?.semester || '' as any,
    optional: course?.optional || false,
    maxStudents: course?.maxStudents || '' as any,
    specializationId: course?.specialization?.id || '' as any,
  }
}

export default function CourseDialog({ open, onClose, course }: CourseDialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = React.useState(false);
  const [courseForm, setCourseForm] = React.useState<CourseForm>(getInitialValues(course));
  const [domains] = useApiResult<IDomain[]>('domains', 'GET');
  const sortedDomains = React.useMemo(() => (
    [...domains || []].sort((a, b) => {
      if(a.type === b.type) return a.name.localeCompare(b.name);
      return a.type.localeCompare(b.type);
    }
  )), [domains]);
  const selectedSpecialization = React.useMemo(() => (
    sortedDomains.flatMap((domain) => domain.specializations || []).find((specialization) => specialization.id === courseForm.specializationId)
  ), [sortedDomains, courseForm.specializationId]);

  React.useEffect(() => {
    if(!open) return;
    setCourseForm(getInitialValues(course));
  }, [course, open]);

  function setCourseFormField<K extends keyof CourseForm>(field: K, value: CourseForm[K]) {
    setCourseForm((courseForm) => ({ ...courseForm, [field]: value }));
  }

  async function saveCourse(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setIsLoading(true);
      let result: IDomain;
      const courseFormData = { ...courseForm, maxStudents: courseForm.maxStudents || null };
      if(!course) {
        result = await apiCall('courses', 'POST', courseFormData);
      } else {
        result = await apiCall(`courses/${course.id}`, 'PUT', courseFormData);
      }
      enqueueSnackbar('Cursul a fost salvat.');
      onClose('save', result);
    } catch (error) {
      enqueueSnackbar('A apărut o eroare.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onClose={() => onClose('dismiss')} fullWidth maxWidth={'xs'}>
      { isLoading && <LoadingShade mode='linear' /> }
      <form id="domainForm" onSubmit={saveCourse}>
        <DialogTitle>{!course ? 'Adăugare curs' : 'Editare curs' }</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            name='courseName'
            margin="dense"
            label="Nume curs"
            type="text"
            fullWidth
            required
            value={courseForm.name}
            onChange={(e) => setCourseFormField('name', e.target.value)}
          />
          <TextField
            name='courseCredits'
            margin="dense"
            label="Credite"
            type="number"
            fullWidth
            required
            InputProps={{ inputProps: { min: 0, max: 10 } }}
            value={courseForm.credits}
            onChange={(e) => setCourseFormField('credits', +e.target.value || '' as any)}
          />
          <FormControl fullWidth margin='dense' required>
            <InputLabel htmlFor="specializationId">Program de studiu</InputLabel>
            <Select
              id="specializationId"
              value={courseForm.specializationId}
              label="Program de studiu"
              required
              onChange={(e) => setCourseFormField('specializationId', e.target.value)}
            >
              {sortedDomains?.map((domain) => ([
                domain.specializations!.length > 0 && (
                  <ListSubheader key={domain.id}>
                    <em>{domain.name} {domain.studyForm} – {DOMAIN_TYPES[domain.type]}</em>
                  </ListSubheader>
                ),
                ...(domain.specializations || []).map((specialization) => (
                  <MenuItem key={specialization.id} value={specialization.id} sx={{ pl: 4 }}>
                    {specialization.name}
                  </MenuItem>
                ))
              ]))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin='dense' disabled={!selectedSpecialization}>
            <InputLabel id="year">An</InputLabel>
            <Select
              labelId="year"
              value={courseForm.year}
              label="An"
              onChange={(e) => setCourseFormField('year', e.target.value as number)}
            >
              {Array.from({ length: selectedSpecialization?.studyYears || 0 }).map((_, i) => (
                <MenuItem key={i} value={i + 1}>Anul {i + 1}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin='dense' disabled={!selectedSpecialization}>
            <InputLabel id="semester">Semestru</InputLabel>
            <Select
              labelId="semester"
              value={courseForm.semester}
              label="Semestru"
              onChange={(e) => setCourseFormField('semester', e.target.value as number)}
            >
              {Array.from({ length: 2 }).map((_, i) => (
                <MenuItem key={i} value={i + 1}>Semestrul {romanize(i + 1)}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={courseForm.optional}
                onChange={(e) => {
                  setCourseFormField('optional', e.target.checked);
                  if(!e.target.checked) setCourseFormField('maxStudents', '' as any);
                }}
              />
            }
            label="Curs opțional"
          />
          {courseForm.optional && (
            <TextField
              name='courseMaxStudents'
              margin="dense"
              label="Număr maxim de studenți"
              type="number"
              fullWidth
              InputProps={{ inputProps: { min: 0, max: 500 } }}
              value={courseForm.maxStudents}
              onChange={(e) => setCourseFormField('maxStudents', +e.target.value || '' as any)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose('dismiss')}>Anulați</Button>
          <Button type='submit'>Salvați</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
