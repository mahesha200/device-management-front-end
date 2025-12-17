import './App.css';
import StatsCard from './components/Dashboard/StatsCard';
import Header from './components/Layouts/Header'
import DevicesIcon from '@mui/icons-material/Devices';
import { Grid, Container } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import DevicesList from './components/Devices/DevicesList';
import DeviceDetail from './components/Devices/DeviceDetail';
import AddDevice from './components/Devices/AddDevice';

function Dashboard() {
  return (
    <>
      <Header />
      <Container maxWidth={false} sx={{ px: 3, py: 3 }}>
        <Grid container spacing={3}>
         
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Server Room"
              value={2}
              icon={<DevicesIcon fontSize="large" />}
              color="#dc2626"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Users"
              value={10}
              icon={<DevicesIcon fontSize="large" />}
              color="#2563eb"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Assigned"
              value={5}
              icon={<DevicesIcon fontSize="large" />}
              color="#16a34a"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Available"
              value={7}
              icon={<DevicesIcon fontSize="large" />}
              color="#ca8a04"
            />
          </Grid>
        </Grid>
      </Container>

    </>
  );
}

function requireAuth() {
  return !!localStorage.getItem('dm_auth');
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/devices" element={requireAuth() ? <><Header /><DevicesList/></> : <Navigate to="/login" replace />} />
      <Route path="/devices/add" element={requireAuth() ? <><Header /><AddDevice/></> : <Navigate to="/login" replace />} />
      <Route path="/devices/:id" element={requireAuth() ? <><Header /><DeviceDetail/></> : <Navigate to="/login" replace />} />
      <Route
        path="/"
        element={requireAuth() ? <Dashboard /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App;
