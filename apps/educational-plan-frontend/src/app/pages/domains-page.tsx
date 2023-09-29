import Typography from '@mui/material/Typography';
import { apiCall, useApiResult } from '../lib/utils';
import { DOMAIN_TYPES, IDomain } from '@educational-plan/types';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';

export default function DomainsPage() {
  const [domains] = useApiResult(
    () => apiCall<IDomain[]>('domains', 'GET'),
    []
  );

  return (
    <>
      <Box sx={{ display: 'flex', mb: 2 }}>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          Domenii
        </Typography>
        <Button variant="outlined">
          Adăugați
        </Button>
      </Box>
      <Grid container spacing={2}>
        {domains?.map((domain) => (
          <Grid item sm={4} md={4} key={domain.id}>
            <Card sx={{ width: '100%' }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {domain.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {DOMAIN_TYPES[domain.type]}, {domain.studyForm} | {domain.specializations!.length} specializări
                </Typography>
              </CardContent>
              <CardActions>
                <Link to={`/domains/${domain.id}`}>
                  <Button size="small">Vizualizați</Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
