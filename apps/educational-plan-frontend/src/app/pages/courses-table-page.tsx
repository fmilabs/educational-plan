import React from 'react';
import { DOMAIN_TYPES, ICourse, ISpecialization } from '@educational-plan/types';
import { apiCall, romanize, useApiResult } from '../lib/utils';
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
import VisibilityIcon from '@mui/icons-material/Visibility';
import { TablePaginationActionsProps } from '@mui/material/TablePagination/TablePaginationActions';
import LoadingShade from '../components/loading-shade';
import { Link } from 'react-router-dom';

export default function CoursesTablePage() {

  const [courses, error, loading, refresh] = useApiResult<ICourse[]>('courses', 'GET');

  const sortedCourses = React.useMemo(() => {
    if(!courses) return [];
    const specializationSortKey = (s: ISpecialization) => `${s.domain.type}-${s.domain.studyForm}-${s.name}-${s.id}`;
    return [...courses].sort((a, b) => {
      if(a.specialization.id !== b.specialization.id) return specializationSortKey(a.specialization).localeCompare(specializationSortKey(b.specialization));
      if(a.year !== b.year) return a.year - b.year;
      if(a.semester !== b.semester) return a.semester - b.semester;
      if(a.credits !== b.credits) return a.credits - b.credits;
      return a.name.localeCompare(b.name);
    });
  }, [courses]);

  return (
    <>
      <Box sx={{ display: 'flex', mb: 2 }}>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          Cursuri
        </Typography>
      </Box>
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
              <TableCell>Credite</TableCell>
              <TableCell sx={{ width: '90px' }}>Acțiuni</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses?.length === 0 && (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography color='text.secondary'>
                    Nu există cursuri.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography color='text.secondary'>
                    A apărut o eroare.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {sortedCourses?.map((course) => (
              <TableRow key={course.id}>
                <TableCell component="th" scope="row">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography>{course.name}</Typography>
                    {course.optional && (
                      <Tooltip title="Curs opțional">
                        <OptionalIcon sx={{ width: '0.5em', height: '0.5em', ml: 0.5, color: 'text.secondary' }} />
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
                <TableCell>{course.credits}</TableCell>
                <TableCell sx={{ p: 0, minWidth: '40px', textAlign: 'center' }}>
                  <IconButton component={Link} to={`/courses/${course.id}`}>
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {/* <TableFooter>
            <TableRow>
              <TablePagination
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
              />
            </TableRow>
          </TableFooter> */}
        </Table>
      </TableContainer>
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
