import * as React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiCall, groupBy, romanize, useApiResult } from "../lib/utils";
import { DOMAIN_TYPES, ICourse, IDomain } from "@educational-plan/types";
import { Alert, Box, Card, CardContent, CircularProgress, FormControl, Grid, InputLabel, ListSubheader, MenuItem, Paper, Select, Typography } from "@mui/material";
import LoadingShade from "../components/loading-shade";

type SearchParamKey = "specializationId" | "year" | "semester";

export default function AllCoursesPage() {
  let [searchParams, setSearchParams] = useSearchParams();
  const specializationId = searchParams.get("specializationId") || '';
  const year = searchParams.get("year") || '';
  const semester = searchParams.get("semester") || '';
  const [domains, domainsError, loadingDomains] = useApiResult(() => apiCall<IDomain[]>("domains", "GET"), []);
  const sortedDomains = React.useMemo(() => (
    [...domains || []].sort((a, b) => {
      if(a.type === b.type) return a.name.localeCompare(b.name);
      return a.type.localeCompare(b.type);
    }
  )), [domains]);

  const specializations = React.useMemo(() => (
    sortedDomains.flatMap((domain) => domain.specializations || [])
  ), [sortedDomains]);

  const selectedSpecialization = React.useMemo(() => (
    specializations.find((specialization) => specialization.id === specializationId)
  ), [specializations, specializationId]);

  const specializationLabels = React.useMemo(() => (
    specializations.reduce((acc, specialization) => ({
      ...acc,
      [specialization.id]: `${specialization.name} – ${DOMAIN_TYPES[specialization.domain.type]}, ${specialization.domain.studyForm}`,
    }), {} as Record<string, string>)
  ), [specializations]);

  function setSearchParam<K extends SearchParamKey>(key: K, value: string) {
    searchParams.set(key, value);
    setSearchParams(searchParams);
  }

  React.useEffect(() => {
    if(!domains) return;
    if(specializationId) {
      const specialization = domains.flatMap((domain) => domain.specializations || []).find((specialization) => specialization.id === specializationId);
      if(!specialization) {
        setSearchParams('');
        return;
      }
      if(year) {
        const yearNumber = parseInt(year);
        if(isNaN(yearNumber) || yearNumber < 1 || yearNumber > specialization.studyYears) {
          searchParams.delete('year');
          searchParams.delete('semester');
          setSearchParams(searchParams);
          return;
        }
      } else {
        searchParams.delete('semester');
        setSearchParams(searchParams);
        return;
      }
      if(semester) {
        const semesterNumber = parseInt(semester);
        if(isNaN(semesterNumber) || semesterNumber < 1 || semesterNumber > 2) {
          searchParams.delete('semester');
          setSearchParams(searchParams);
        }
      }
    } else {
      if(year || semester) {
        searchParams.delete('year');
        searchParams.delete('semester');
        setSearchParams(searchParams);
      }
    }
  }, [domains, specializationId, year, semester]);

  const [courses, error, loading] = useApiResult(() => apiCall<ICourse[]>(`courses`, 'GET'), []);

  if(loadingDomains) {
    return <LoadingShade />;
  }

  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto' }}>
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
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (error || domainsError) ? (
        <Alert severity="error">
          A apărut o eroare.
        </Alert>
      ) : courses?.length === 0 ? (
        <NoCoursesAlert />
      ) : (
        courses && (
          <Groupable
            courses={courses}
            keyExtractor={course => course.specialization.id}
            getLabelFromKey={(specializationId) => specializationLabels[specializationId]}
            titleVariant="h4"
            onlyShow={specializationId}
          >
            {(courses) => (
              <Groupable
                courses={courses}
                keyExtractor={course => course.year.toString()}
                getLabelFromKey={key => `Anul ${key}`}
                titleVariant="h4"
                onlyShow={year}
              >
                {(courses) => (
                  <Groupable
                    courses={courses}
                    keyExtractor={course => course.semester.toString()}
                    getLabelFromKey={key => `Semestrul ${romanize(+key)}`}
                    titleVariant="h5"
                    onlyShow={semester}
                  >
                    {(courses) => (
                      <Groupable
                        courses={courses}
                        keyExtractor={course => course.optional.toString()}
                        getLabelFromKey={key => key === 'false' ? 'Cursuri obligatorii' : 'Cursuri opționale'}
                        titleVariant="h6"
                      />
                    )}
                  </Groupable>
                )}
              </Groupable>
            )}
          </Groupable>
        )
      )}
    </Box>
  )
}

function CourseCard({ course }: { course: ICourse }) {
  return (
    <Link to={`/courses/${course.id}`} style={{ textDecoration: 'none' }}>
      <Card sx={{ width: '100%', mb: 2 }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {course.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Profesor: {course.user?.firstName} {course.user?.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {course.credits} credite
          </Typography>
        </CardContent>
      </Card>
    </Link>
  )
}

function Groupable({ courses, keyExtractor, getLabelFromKey, titleVariant, onlyShow, children }: {
  courses: ICourse[];
  keyExtractor: (course: ICourse) => string | number;
  getLabelFromKey: (key: string) => string;
  titleVariant: React.ComponentProps<typeof Typography>['variant'];
  onlyShow?: string;
  children?: (courses: ICourse[]) => React.ReactNode;
}) {
  const groupedCourses = React.useMemo(() => (
    groupBy(courses, keyExtractor)
  ), [courses, keyExtractor]);

  const groupLabels = React.useMemo(() => (
    Object.keys(groupedCourses).reduce((acc, key) => ({ ...acc, [key]: getLabelFromKey(key) }), {} as Record<string, string>)
  ), [groupedCourses, getLabelFromKey]);

  if(children) {
    if(onlyShow) {
      return groupedCourses[onlyShow] === undefined
        ? <NoCoursesAlert />
        : children(groupedCourses[onlyShow]);
    }
    return (
      <>
        {Object.entries(groupedCourses).map(([groupKey, courses], index) => (
          <Box key={index}>
            <Typography variant={titleVariant} sx={{ mb: 1 }}>
              {groupLabels[groupKey]}
            </Typography>
            {children(courses)}
          </Box>
        ))}
      </>
    )
  }

  return (
    <>
      {Object.entries(groupedCourses).map(([groupKey, courses], index) => (
        <CourseList key={index} courses={courses} title={groupLabels[groupKey]} titleVariant={titleVariant} />
      ))}
    </>
  );
}

function NoCoursesAlert() {
  return (
    <Alert severity="info">Nu există cursuri.</Alert>
  );
}

function CourseList({ courses, title, titleVariant = 'h6' }: {
  courses: ICourse[];
  title: string;
  titleVariant?: React.ComponentProps<typeof Typography>['variant'];
}) {
  if(courses.length === 0) return null;
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant={titleVariant} sx={{ mb: 1, }}>
        {title}
      </Typography>
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </Box>
  );
}

