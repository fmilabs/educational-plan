import React, { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { apiCall, getMediaUrl, romanize, useApiResult } from '../lib/utils';
import { DOMAIN_TYPES, ICourse } from '@educational-plan/types';

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
import UploadIcon from '@mui/icons-material/Upload';
import PDFIcon from '@mui/icons-material/PictureAsPdf';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useSnackbar } from 'notistack';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { Alert } from '@mui/material';
import { useAuth } from '../contexts/auth.context';
import CourseDialog, { CourseDialogProps } from '../components/course-dialog';
import LoadingShade from '../components/loading-shade';

export default function CoursePage() {
  const { enqueueSnackbar } = useSnackbar();
  const { state: { user }} = useAuth();
  const { id } = useParams<{ id: string }>();
  const [course, error, loading, refresh] = useApiResult<ICourse>(`courses/${id}`, 'GET');
  const [courseDialogProps, setCourseDialogProps] = React.useState<CourseDialogProps>({
    open: false,
    onClose: (result) => {
      if(result === 'save') {
        refresh();
      }
      setCourseDialogProps((props) => ({ ...props, open: false, course: undefined }));
    }
  });

  const deleteCourse = async (course: ICourse) => {
    if(!confirm(`Sunteți sigur că doriți să ștergeți cursul ${course.name}?`)) return;
    try {
      await apiCall(`courses/${course.id}`, 'DELETE');
      enqueueSnackbar('Cursul a fost șters.');
      window.history.back();
    } catch (error) {
      enqueueSnackbar('A apărut o eroare.');
    }
  }

  useEffect(() => {
    if(!error) return;
    enqueueSnackbar('A apărut o eroare.');
    // window.history.back();
  }, [error]);

  const canEdit = user?.id === course?.user.id || user?.role == 'admin';

  const UploadCurriculumButton = ({ reupload }: { reupload?: boolean }) => {

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if(!file) return;
      try {
        const formData = new FormData();
        formData.append('file', file);
        await apiCall(`courses/${course!.id}/curriculum`, 'POST', formData);
        enqueueSnackbar('Fișa cursului a fost încărcată.');
        refresh();
      } catch (error) {
        enqueueSnackbar('A apărut o eroare.');
      }
    }

    return (
      <>
        <label htmlFor="upload-file">
          <Button variant="outlined" component="span">
            <UploadIcon />
            <Typography sx={{ ml: 1, textTransform: 'capitalize', fontWeight: '500' }}>
              {reupload ? 'Reîncărcați' : 'Încărcați'}
            </Typography>
          </Button>
        </label>
        <input
          type="file"
          id="upload-file"
          style={{ display: 'none' }}
          accept="application/pdf"
          onChange={handleUpload}
        />
      </>
    );
  }

  return (
    <Box>
      {(!course || loading) ? (
        <LoadingShade />
      ) : (
        <>
          <Box sx={{ display: 'flex', mb: 2 }}>
            <IconButton onClick={() => window.history.back()} sx={{ mr: 1 }}>
              <BackIcon />
            </IconButton>
            <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
              {course.name}
            </Typography>
            <PopupState variant='popover'>
              {(popupState) => (
                <>
                  {canEdit && (
                    <IconButton {...bindTrigger(popupState)}>
                      <MoreIcon />
                    </IconButton>
                  )}
                  <Menu {...bindMenu(popupState)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                    <MenuItem
                      onClick={() => {
                        popupState.close();
                        setCourseDialogProps((props) => ({ ...props, open: true, course }));
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
                        deleteCourse(course);
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
              <ListItemText primary="Nume curs" secondary={course.name} />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText primary="Profesor" secondary={`${course.user.firstName} ${course.user.lastName}`} />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText
                primary="Program de studiu"
                secondary={`${course.specialization.name}, ${course.specialization.domain.studyForm} – ${DOMAIN_TYPES[course.specialization.domain.type]}`}
              />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText primary="An" secondary={course.year} />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText primary="Semestru" secondary={romanize(course.semester)} />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText primary="Credite" secondary={course.credits} />
            </ListItem>
            {course.optional && (
              <ListItem disableGutters>
                <ListItemText primary="Opțional" secondary="Da" />
              </ListItem>
            )}
            {course.maxStudents !== null && (
              <ListItem disableGutters>
                <ListItemText primary="Număr maxim de studenți" secondary={course.maxStudents} />
              </ListItem>
            )}
          </List>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
              Fișa cursului
            </Typography>
            {course.curriculumPath ? (
              <>
                <Button variant="contained" href={getMediaUrl(course.curriculumPath)} target="_blank" sx={{ mr: 2 }}>
                  <PDFIcon />
                  <Typography sx={{ ml: 1, textTransform: 'capitalize', fontWeight: '500' }}>
                    Vizualizați
                  </Typography>
                </Button>
                {canEdit && <UploadCurriculumButton reupload />}
              </>
            ) : (
              <>
                { (!user || user.id != course.user.id) && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    Profesorul nu a încărcat fișa cursului.
                  </Alert>
                )}
                {canEdit && <UploadCurriculumButton />}
              </>
            )}
          </Box>
          <CourseDialog {...courseDialogProps} />
        </>
      )}
    </Box>
  );
}
