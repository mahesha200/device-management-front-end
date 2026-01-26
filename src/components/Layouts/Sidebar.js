import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Box,
  Divider,
  Collapse
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DevicesIcon from '@mui/icons-material/Devices';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

const drawerWidth = 260;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});

  const handleLogout = () => {
    localStorage.removeItem('dm_auth');
    navigate('/login');
  };

  const toggleMenu = (menuKey) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <DashboardIcon />, 
      path: '/' 
    },
    { 
      text: 'Assets', 
      icon: <DevicesIcon />, 
      key: 'assets',
      children: [
        { text: 'All Assets', icon: <ListAltIcon />, path: '/assets' },
        { text: 'Add Asset', icon: <AddCircleIcon />, path: '/assets/add' },
      ]
    },
    { 
      text: 'Users', 
      icon: <PeopleIcon />, 
      path: '/users' 
    },
    { 
      text: 'Reports', 
      icon: <AssessmentIcon />, 
      path: '/reports' 
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#4d1d4f',
          color: '#fff',
        },
      }}
    >
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <img 
          src="/lecologo.png" 
          alt="LECO Logo" 
          style={{ width: '80px', maxWidth: '100%', marginTop: '55px' }}
        />
      </Box>
      
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />
      
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <div key={item.text}>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => item.children ? toggleMenu(item.key) : navigate(item.path)}
                selected={!item.children && location.pathname === item.path}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  '&.Mui-selected': {
                    backgroundColor: '#fff100',
                    color: '#000',
                    '& .MuiListItemIcon-root': {
                      color: '#000',
                    },
                    '&:hover': {
                      backgroundColor: '#ffed00',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 241, 0, 0.2)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
                {item.children && (
                  openMenus[item.key] ? <ExpandLess sx={{ color: '#fff' }} /> : <ExpandMore sx={{ color: '#fff' }} />
                )}
              </ListItemButton>
            </ListItem>
            
            {item.children && (
              <Collapse in={openMenus[item.key]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child) => (
                    <ListItem key={child.text} disablePadding sx={{ mb: 0.5 }}>
                      <ListItemButton
                        onClick={() => navigate(child.path, { replace: true })}
                        selected={location.pathname === child.path}
                        sx={{
                          mx: 1,
                          ml: 3,
                          borderRadius: 1,
                          '&.Mui-selected': {
                            backgroundColor: '#fff100',
                            color: '#000',
                            '& .MuiListItemIcon-root': {
                              color: '#000',
                            },
                            '&:hover': {
                              backgroundColor: '#ffed00',
                            },
                          },
                          '&:hover': {
                            backgroundColor: 'rgba(255, 241, 0, 0.2)',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>
                          {child.icon}
                        </ListItemIcon>
                        <ListItemText primary={child.text} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </div>
        ))}
      </List>
      
      <Box sx={{ flexGrow: 1 }} />
      
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />
      
      <List sx={{ pb: 2 }}>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              mx: 1,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: 'rgba(239, 68, 68, 0.3)',
              },
            }}
          >
            <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
