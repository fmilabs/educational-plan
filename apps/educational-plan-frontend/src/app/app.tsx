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
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import { Route, Routes, Link, useLocation, Navigate } from 'react-router-dom';
import useIsMobile from './hooks/is-mobile';
import DomainsPage from './pages/domains-page';
import AuthSnippet from './components/auth-snippet';
import { useAuth } from './contexts/auth.context';
import DomainPage from './pages/domain-page';
import MyCoursesPage from './pages/my-courses-page';
import CoursePage from './pages/course-page';
import AllCoursesPage from './pages/all-courses-page';
import LoadingShade from './components/loading-shade';
import UsersPage from './pages/users-page';

interface DrawerItemProps {
  title: string;
  icon: React.ReactNode;
  to: string;
}

export function App() {
  const { state: authState } = useAuth();
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

  const [darkMode, setDarkMode] = React.useState(getDarkModePref());

  const theme = createTheme({
    palette: {
      mode: darkMode? 'dark' : 'light',
      primary: {
        main: '#3f51b5',
      },
      secondary: {
        main: '#f50057',
      },
    },
  });

  const routes = React.useMemo<React.ComponentProps<typeof Route>[]>(() => {
    const routes: React.ComponentProps<typeof Route>[] = [
      { path: '/', element: <AllCoursesPage /> },
      { path: '/courses/:id', element: <CoursePage /> },
    ];
    if(authState.isLoading) {
      routes.push({ path: '*', element: <LoadingShade /> });
      return routes;
    }
    if(authState.user) {
      routes.push({ path: '/my-courses', element: <MyCoursesPage /> });
    }
    if(authState.user?.role === 'admin') {
      routes.push({ path: '/domains', element: <DomainsPage /> });
      routes.push({ path: '/domains/:id', element: <DomainPage /> });
      routes.push({ path: '/users', element: <UsersPage /> })
    }
    routes.push({ path: '*', element: <Navigate to="/" /> });
    return routes;
  }, [authState]);

  return (
    <SnackbarProvider anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }} maxSnack={1}>
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
              {authState.user && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ flexGrow: 1 }}
              >
                Plan de învățământ
              </Typography>
              <IconButton onClick={() => {
                localStorage.setItem('darkMode', (!darkMode).toString());
                setDarkMode(!darkMode);
              }}>
                <DarkModeIcon />
              </IconButton>
              <AuthSnippet />
            </Toolbar>
          </AppBar>
          <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
            {authState.user && (
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
                      title="Toate cursurile"
                      icon={<SchoolIcon />}
                      to="/"
                    />
                  </List>
                  <Divider />
                  <List>
                    <DrawerItem
                      title="Cursurile dvs."
                      icon={<SchoolIcon />}
                      to="/my-courses"
                    />
                  </List>
                  <Divider />
                  {authState.user.role == 'admin' && (
                    <List>
                      <DrawerItem
                        title="Domenii"
                        icon={<CategoryIcon />}
                        to="/domains"
                      />
                      <DrawerItem
                        title="Utilizatori"
                        icon={<PeopleIcon />}
                        to="/users"
                      />
                    </List>
                  )}
                </Drawer>
              </Box>
            )}
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 2,
                position: 'relative',
                overflow: 'auto',
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
    </SnackbarProvider>
  );
}

function getDarkModePref() {
  const darkModePref = localStorage.getItem('darkMode');
  if(darkModePref === 'true') return true;
  if(darkModePref === 'false') return false;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export default App;
