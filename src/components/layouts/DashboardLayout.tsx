import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Outlet, useLocation } from 'react-router-dom';
import ListItems from './Sidebar';
import { useEffect } from 'react';
import { MenuItem, flattenMenuItems } from './layout.d';

const drawerWidth: number = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<MuiAppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: drawerWidth,
  width: `calc(100% - ${drawerWidth}px)`,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
  },
}));

// TODO remove, this demo shouldn't need to reset the theme.

export default function DashboardLayout() {
  const [pageName, setPageName] = React.useState<string>('');
  const location = useLocation();

  useEffect(() => {
    if (!!location.pathname) {
      const target = flattenMenuItems?.find((item: MenuItem) => item.path === location.pathname);
      setPageName(target?.label || '');
    }
  }, [location.pathname]);

  return (
    <>
      <AppBar
        position="absolute"
        color="inherit"
        open={true}
        sx={{
          boxShadow: 'none',
        }}
      >
        <Toolbar
          sx={{
            pr: '24px', // keep right padding when drawer closed
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{
              marginRight: '36px',
              display: 'none',
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h5" color="primary" noWrap sx={{ flexGrow: 1 }}>
            {pageName}
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={true}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <MonetizationOnIcon color="primary"/>
          <Typography variant="h5" color="primary">Microinvoice</Typography>
        </Toolbar>
        <Divider />
        <List component="nav">
          <ListItems />
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          width: `calc(100vw - 239px)`,
          p: 2,
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </>
  );
}
