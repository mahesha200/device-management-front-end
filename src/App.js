import './App.css';
import StatsCard from './components/Dashboard/StatsCard';
import Header from './components/Layouts/Header'
import DevicesIcon from '@mui/icons-material/Devices';
import { Grid, Container } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import AssetsList from './components/Assets/AssetsList';
import AssetDetail from './components/Assets/AssetDetail';
import AddAsset from './components/Assets/AddAsset';
import ModifyAsset from './components/Assets/ModifyAsset';

function Dashboard() {
  return (
    <>
      <Header />
      <Container maxWidth={false} sx={{ px: 3, py: 3 }}>
        <Grid container spacing={3}>
         
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="IT Equipment"
              value={2}
              icon={<DevicesIcon fontSize="large" />}
              color="#dc2626"
                to="/assets"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Network Equipment"
              value={10}
              icon={<DevicesIcon fontSize="large" />}
              color="#2563eb"
                to="/assets"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Server Equipment"
              value={5}
              icon={<DevicesIcon fontSize="large" />}
              color="#16a34a"
                to="/assets"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Other"
              value={7}
              icon={<DevicesIcon fontSize="large" />}
              color="#ca8a04"
                to="/assets"
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
      <Route path="/assets" element={requireAuth() ? <><Header /><AssetsList/></> : <Navigate to="/login" replace />} />
      <Route path="/assets/add" element={requireAuth() ? <><Header /><AddAsset/></> : <Navigate to="/login" replace />} />
      <Route path="/assets/:id" element={requireAuth() ? <><Header /><AssetDetail/></> : <Navigate to="/login" replace />} />
      <Route path="/assets/:id/edit" element={requireAuth() ? <><Header /><ModifyAsset/></> : <Navigate to="/login" replace />} />
      <Route
        path="/"
        element={requireAuth() ? <Dashboard /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App;
