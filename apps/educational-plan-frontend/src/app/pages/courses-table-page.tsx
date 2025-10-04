import React from 'react';
import { DOMAIN_TYPES, ICourse, IDomain } from '@educational-plan/types';
import { romanize, useApiResult } from '../lib/utils';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  ListSubheader,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import OptionalIcon from '@mui/icons-material/AltRoute';
import ErrorIcon from '@mui/icons-material/ErrorOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { TablePaginationActionsProps } from '@mui/material/TablePagination/TablePaginationActions';
import LoadingShade from '../components/loading-shade';
import { Link, useSearchParams } from 'react-router-dom';
import { globalStyles } from '../lib/global-styles';
import CourseDialog, { CourseDialogProps } from '../components/course-dialog';

type SearchParamKey = "specializationId" | "year" | "semester";

export default function CoursesTablePage() {
  let [searchParams, setSearchParams] = useSearchParams();
  const specializationId = searchParams.get("specializationId") || '';
  const year = searchParams.get("year") || '';
  const semester = searchParams.get("semester") || '';
  function setSearchParam<K extends SearchParamKey>(key: K, value: string) {
    searchParams.set(key, value);
    setSearchParams(searchParams);
  }
  const [domains] = useApiResult<IDomain[]>("domains", "GET");
  const specializations = React.useMemo(() => (
    (domains || []).flatMap((domain) => domain.specializations?.map(spec => ({ ...spec, domain })) || [])
  ), [domains]);

  const selectedSpecialization = React.useMemo(() => (
    specializations.find((specialization) => specialization.id === specializationId)
  ), [specializations, specializationId]);

  const [courses, error, loading, refresh] = useApiResult<ICourse[]>('courses', 'GET');

  const [courseDialogProps, setCourseDialogProps] = React.useState<CourseDialogProps>({
    open: false,
    onClose: (result) => {
      if(result === 'save') {
        refresh();
      }
      setCourseDialogProps((props) => ({ ...props, open: false, course: undefined }));
    }
  });

  const filteredCourses = React.useMemo(() => {
    return (courses || []).filter((course) => {
      if(specializationId && course.specialization.id !== specializationId) return false;
      if(year && course.year.toString() !== year) return false;
      if(semester && course.semester.toString() !== semester) return false;
      return true;
    });
  }, [courses, specializationId, year, semester]);

  return (
    <Box>
      <Box sx={{ display: 'flex', mb: 2 }}>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          Cursuri
        </Typography>
        <Button
          variant="outlined"
          onClick={() => setCourseDialogProps((props) => ({
            ...props,
            open: true,
            course: {
              specialization: selectedSpecialization,
              year: year ? parseInt(year) : undefined,
              semester: semester ? parseInt(semester) : undefined,
            }
          }))}
        >
          Adăugați
        </Button>
      </Box>
       <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel htmlFor="specializationId">Program de studiu</InputLabel>
                <Select
                  id="specializationId"
                  value={specializationId}
                  label="Program de studiu"
                  required
                  onChange={(e) => setSearchParam('specializationId', e.target.value!)}
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
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth disabled={!selectedSpecialization}>
                <InputLabel id="year">An</InputLabel>
                <Select
                  labelId="year"
                  value={year}
                  label="An"
                  onChange={(e) => setSearchParam('year', e.target.value)}
                >
                  {Array.from({ length: selectedSpecialization?.studyYears || 0 }).map((_, i) => (
                    <MenuItem key={i} value={i + 1}>Anul {i + 1}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth disabled={!selectedSpecialization || !year}>
                <InputLabel id="semester">Semestru</InputLabel>
                <Select
                  labelId="semester"
                  value={semester}
                  label="Semestru"
                  onChange={(e) => setSearchParam('semester', e.target.value)}
                >
                  {Array.from({ length: 2 }).map((_, i) => (
                    <MenuItem key={i} value={i + 1}>Semestrul {romanize(i + 1)}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      <TableContainer component={Paper} sx={{ position: 'relative' }}>
        {loading && <LoadingShade />}
        <Table sx={{ width: '100%' }}>
          <TableHead>
            <TableRow>
              <TableCell>Nume</TableCell>
              <TableCell>Profesor</TableCell>
              <TableCell>Specializare</TableCell>
              <TableCell>An</TableCell>
              <TableCell>Semestru</TableCell>
              <TableCell>Seria</TableCell>
              <TableCell>Credite</TableCell>
              <TableCell sx={{ width: '80px' }}>Acțiuni</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCourses?.length === 0 && (
              <TableRow>
                <TableCell colSpan={8}>
                  <Typography color='text.secondary'>
                    Nu există cursuri.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={8}>
                  <Typography color='text.secondary'>
                    A apărut o eroare.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {filteredCourses?.map((course) => (
              <TableRow key={course.id}>
                <TableCell component="th" scope="row">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography>{course.name}</Typography>
                    {course.optional && (
                      <Tooltip title="Curs opțional">
                        <OptionalIcon sx={{ width: '0.5em', height: '0.5em', ml: 0.5, color: 'text.secondary' }} />
                      </Tooltip>
                    )}
                    {course.isOutdated && (
                      <Tooltip title="Informații învechite">
                        <ErrorIcon sx={{ width: '0.5em', height: '0.5em', ml: 0.5, color: 'warning.main' }} />
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
                <TableCell>{course.user.firstName} {course.user.lastName}</TableCell>
                <TableCell>
                  {course.specialization.name}{' – '}
                  {DOMAIN_TYPES[course.specialization.domain.type]}{', '}
                  {course.specialization.domain.studyForm}
                </TableCell>
                <TableCell>{course.year}</TableCell>
                <TableCell>{romanize(course.semester)}</TableCell>
                <TableCell>{course.series ? `${course.year}${course.series.number}` : ''}</TableCell>
                <TableCell>{course.credits}</TableCell>
                <TableCell sx={{ p: 0, minWidth: '80px', textAlign: 'center' }}>
                  <IconButton component={Link} to={`/courses/${course.id}`}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => setCourseDialogProps((props) => ({ ...props, open: true, course }))}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            {filteredCourses && (
              <TableRow>
                <TableCell sx={{ borderBottom: 'none' }}>
                  <Typography color="text.secondary" variant="caption" component="div">
                    {filteredCourses.length} rezultate.
                  </Typography>
                </TableCell>
                {/* <TablePagination
                  count={courses?.length || 0}
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
                /> */}
              </TableRow>
            )}
          </TableFooter>
        </Table>
      </TableContainer>
      <CourseDialog {...courseDialogProps} />
    </Box>
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
