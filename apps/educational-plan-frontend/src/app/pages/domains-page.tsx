import React from 'react';
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
import DomainDialog, { DomainDialogProps } from '../components/domain-dialog';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import LoadingShade from '../components/loading-shade';

export default function DomainsPage() {
  const navigate = useNavigate();
  const [domains, error, loading] = useApiResult(
    () => apiCall<IDomain[]>('domains', 'GET'),
    []
  );

  const [domainDialogProps, setDomainDialogProps] = React.useState<DomainDialogProps>({
    open: false,
    onClose: (result, domain) => {
      if(result === 'save') {
        navigate(`/domains/${domain!.id}`);
      }
      setDomainDialogProps((props) => ({ ...props, open: false }));
    }
  });

  return (
    <>
      <Box sx={{ display: 'flex', mb: 2 }}>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          Domenii
        </Typography>
        <Button variant="outlined" onClick={() => setDomainDialogProps((props) => ({ ...props, open: true }))}>
          Adăugați
        </Button>
      </Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
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
      {loading && <LoadingShade />}
      {error && (
        <Alert severity="error">
          A apărut o eroare.
        </Alert>
      )}
      {domains?.length == 0 && (
        <Alert severity="info">
          Nu există domenii.
        </Alert>
      )}
      <DomainDialog {...domainDialogProps} />
    </>
  );
}
