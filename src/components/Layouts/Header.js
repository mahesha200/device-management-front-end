import { AppBar, Toolbar, Typography, IconButton, Box, Menu, MenuItem } from '@mui/material';
import { AccountCircle, Logout } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
    handleClose();
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        backgroundColor: '#4d1d4f',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        borderBottom: '3px solid #fff100'
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: '#fff100', flexGrow: 1 }}>
          Device Management System
        </Typography>
        
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ color: '#fff' }}>
              {user.userName} {user.branch && `(${user.branch})`}
            </Typography>
            <IconButton
              size="large"
              aria-label="account menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem disabled>
                <Typography variant="body2">
                  <strong>{user.email || 'No email'}</strong>
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout fontSize="small" sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;