import React from 'react';
import { DOMAIN_TYPES, ICourse, IDomain, IUser, Paginated, Role } from "@educational-plan/types";
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
import { Autocomplete, autocompleteClasses, Box, CircularProgress, FormControlLabel, Switch } from '@mui/material';
import { globalStyles } from '../lib/global-styles';
import { useAuth } from '../contexts/auth.context';

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
  const { state: { user }} = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [courseForm, setCourseForm] = React.useState<CourseForm>(getInitialValues(course));
  const [domains] = useApiResult<IDomain[]>('domains', 'GET');
  const selectedSpecialization = React.useMemo(() => (
    (domains || []).flatMap((domain) => domain.specializations || []).find((specialization) => specialization.id === courseForm.specializationId)
  ), [domains, courseForm.specializationId]);

  const [userAutocompleteOpen, setUserAutocompleteOpen] = React.useState(false);
  const [users, setUsers] = React.useState<readonly IUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = React.useState(false);
  const [selectedTeacher, setSelectedTeacher] = React.useState<IUser | null>(course?.user || null);
  const [userQuery, setUserQuery] = React.useState('');

  React.useEffect(() => {
    if(!open) return;
    setCourseForm(getInitialValues(course));
    setSelectedTeacher(course?.user || null);
  }, [course, open]);

  React.useEffect(() => {
    fetchUsers();
  }, [userQuery]);

  function setCourseFormField<K extends keyof CourseForm>(field: K, value: CourseForm[K]) {
    setCourseForm((courseForm) => ({ ...courseForm, [field]: value }));
  }

  const handleAutocompleteOpen = async () => {
    setUserAutocompleteOpen(true);
    fetchUsers();
  };

  const fetchUsers = async () => {
    if(user?.role !== Role.Admin) return;
    try {
      setIsLoadingUsers(true);
      const users = await apiCall<Paginated<IUser>>(`users?limit=10&email=${userQuery}`, 'GET');
      setUsers(users.data);
    } catch (error) {
      enqueueSnackbar('A apărut o eroare.');
    } finally {
      setIsLoadingUsers(false);
    }
  }

  async function saveCourse(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setIsLoading(true);
      let result: IDomain;
      const courseFormData: Record<string, any> = { ...courseForm, maxStudents: courseForm.maxStudents || null };
      if(selectedTeacher) {
        courseFormData.userId = selectedTeacher.id;
      }
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
      <form id="courseForm" onSubmit={saveCourse}>
        <DialogTitle>{!course ? 'Adăugare curs' : 'Editare curs' }</DialogTitle>
        <DialogContent>
          {user?.role === Role.Admin && (
            <Autocomplete
              value={selectedTeacher}
              open={userAutocompleteOpen}
              onOpen={handleAutocompleteOpen}
              onClose={() => setUserAutocompleteOpen(false)}
              filterOptions={(x) => x}
              isOptionEqualToValue={(option, value) => option.email === value.email}
              getOptionLabel={(option) => option.email}
              renderOption={(props, option) => {
                return (
                  <Box
                    sx={{
                      [`&.${autocompleteClasses.option}`]: {
                        padding: '8px',
                      },
                    }}
                    component="li"
                    {...props}
                  >
                    {option.email} – {option.firstName} {option.lastName}
                  </Box>
                );
              }}
              options={users}
              loading={isLoadingUsers}
              onInputChange={(_, value) => setUserQuery(value)}
              onChange={(_, value) => setSelectedTeacher(value)}
              noOptionsText='Niciun rezultat'
              loadingText='Se încarcă...'
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Profesor"
                  margin="dense"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {isLoadingUsers ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
          )}
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
              {domains?.map((domain) => ([
                domain.specializations!.length > 0 && (
                  <ListSubheader key={domain.id} sx={globalStyles.elipsis}>
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
