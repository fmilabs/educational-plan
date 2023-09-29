import React from 'react';
import Typography from '@mui/material/Typography';
import { apiCall, useApiResult } from '../lib/utils';
import { ICourse } from '@educational-plan/types';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import LoadingShade from '../components/loading-shade';
import CourseDialog, { CourseDialogProps } from '../components/course-dialog';

export default function MyCoursesPage() {
  const navigate = useNavigate();
  const [courses, error, loading] = useApiResult(
    () => apiCall<ICourse[]>('courses/my', 'GET'),
    []
  );

  const [courseDialogProps, setCourseDialogProps] = React.useState<CourseDialogProps>({
    open: false,
    onClose: (result, course) => {
      if(result === 'save') {
        navigate(`/courses/${course!.id}`);
      }
      setCourseDialogProps((props) => ({ ...props, open: false }));
    }
  });

  return (
    <>
      <Box sx={{ display: 'flex', mb: 2 }}>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          Materiile dvs.
        </Typography>
        <Button variant="outlined" onClick={() => setCourseDialogProps((props) => ({ ...props, open: true }))}>
          Adăugați
        </Button>
      </Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {courses?.map((course) => (
          <Grid item sm={4} md={4} key={course.id}>
            <Card sx={{ width: '100%' }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {course.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {course.specialization.name}, {course.specialization.domain.studyForm}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Anul {course.year}, semestrul {course.semester}
                </Typography>
              </CardContent>
              <CardActions>
                <Link to={`/courses/${course.id}`}>
                  <Button size="small">Vizualizați</Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {loading && <LoadingShade />}
      {error && (
        <Alert severity="error">
          A apărut o eroare.
        </Alert>
      )}
      {courses?.length == 0 && (
        <Alert severity="info">
          Nu ați adăugat materii.
        </Alert>
      )}
      <CourseDialog {...courseDialogProps} />
    </>
  );
}
