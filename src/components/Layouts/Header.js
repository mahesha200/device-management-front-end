import { AppBar, Toolbar, Typography } from '@mui/material';

const Header = () => {
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
        <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: '#fff100' }}>
          Device Management System
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;