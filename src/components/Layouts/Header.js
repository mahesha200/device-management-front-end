import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import DevicesIcon from '@mui/icons-material/Devices';
import { Link as RouterLink } from 'react-router-dom';

const Header = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#1e3a8a' }}>
      <Toolbar>
        <DevicesIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          IT Device Management System
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button component={RouterLink} to="/" color="inherit">Dashboard</Button>
          <Button component={RouterLink} to="/devices" color="inherit">Devices</Button>
          <Button color="inherit">Users</Button>
          <Button color="inherit">Reports</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;