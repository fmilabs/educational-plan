import './app.module.scss';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import SchoolIcon from '@mui/icons-material/School';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import { Route, Routes, Link, useLocation } from 'react-router-dom';
import useIsMobile from './hooks/is-mobile';
import DomainsPage from './pages/domains-page';
import AuthSnippet from './components/auth-snippet';
import { AuthProvider } from './contexts/auth.context';
import DomainPage from './pages/domain-page';
import MyCoursesPage from './pages/my-courses-page';
import CoursePage from './pages/course-page';

const routes: React.ComponentProps<typeof Route>[] = [
  { path: '/', element: <div>Home</div> },
  { path: '/domains', element: <DomainsPage /> },
  { path: '/domains/:id', element: <DomainPage /> },
  { path: '/my-courses', element: <MyCoursesPage /> },
  { path: '/courses/:id', element: <CoursePage /> },
];

interface DrawerItemProps {
  title: string;
  icon: React.ReactNode;
  to: string;
}

export function App() {
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = React.useState(!isMobile);
  const drawerWidth = drawerOpen || isMobile ? 240 : 0;

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const DrawerItem = ({ title, icon, to }: DrawerItemProps) => {
    const route = useLocation();
    const isCurrent = route.pathname === to;

    return (
      <ListItem key={title} disablePadding>
        <ListItemButton selected={isCurrent} component={Link} to={to}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText primary={title} />
        </ListItemButton>
      </ListItem>
    );
  };

  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#3f51b5',
      },
      secondary: {
        main: '#f50057',
      },
    },
  });

  return (
    <SnackbarProvider anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }} maxSnack={1}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <AppBar
              position="static"
              sx={{
                zIndex: (theme) => (isMobile ? 1 : theme.zIndex.drawer + 1),
              }}
            >
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ flexGrow: 1 }}
                >
                  Plan de învățământ
                </Typography>
                <AuthSnippet />
              </Toolbar>
            </AppBar>
            <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'auto' }}>
              <Box
                component="nav"
                sx={{
                  width: { sm: drawerWidth },
                  flexShrink: { sm: 0 },
                  transition: 'width 0.2s',
                }}
              >
                <Drawer
                  variant={isMobile ? 'temporary' : 'persistent'}
                  open={drawerOpen}
                  onClose={handleDrawerToggle}
                  ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                  }}
                  sx={{
                    '& .MuiDrawer-paper': {
                      boxSizing: 'border-box',
                      width: drawerWidth,
                    },
                    '& .MuiDrawer-root': {
                      position: 'relative',
                    },
                    '& .MuiPaper-root': {
                      position: 'relative',
                    },
                    height: '100%',
                  }}
                >
                  <List>
                    <DrawerItem
                      title="Toate materiile"
                      icon={<SchoolIcon />}
                      to="/"
                    />
                  </List>
                  <Divider />
                  <List>
                    <DrawerItem
                      title="Materiile dvs."
                      icon={<MailIcon />}
                      to="/my-courses"
                    />
                    <DrawerItem
                      title="Domenii"
                      icon={<MailIcon />}
                      to="/domains"
                    />
                  </List>
                </Drawer>
              </Box>
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  p: 2,
                  position: 'relative',
                }}
              >
                <Routes>
                  {routes.map((props) => (
                    <Route key={props.path} {...props} />
                  ))}
                </Routes>
              </Box>
            </Box>
          </Box>
        </ThemeProvider>
      </AuthProvider>
    </SnackbarProvider>
  );
}

export default App;
