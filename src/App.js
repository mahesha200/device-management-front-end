import './App.css';
import StatsCard from './components/Dashboard/StatsCard';
import Header from './components/Layouts/Header';
import Sidebar from './components/Layouts/Sidebar';
import Breadcrumbs from './components/common/Breadcrumbs';
import DevicesIcon from '@mui/icons-material/Devices';
import { Grid, Container, Box, Toolbar } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import AssetsList from './components/Assets/AssetsList';
import AssetDetail from './components/Assets/AssetDetail';
import AddAsset from './components/Assets/AddAsset';
import ModifyAsset from './components/Assets/ModifyAsset';

function Dashboard() {
  return (
    <Container maxWidth={false} sx={{ px: 3, py: 3 }}>
      <Grid container spacing={3}>
       
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="IT Equipment"
            value={2}
            icon={<DevicesIcon fontSize="large" />}
            color="#dc2626"
            to="/assets?department=IT"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Server Equipment"
            value={10}
            icon={<DevicesIcon fontSize="large" />}
            color="#2563eb"
            to="/assets?department=Engineering"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Finance Equipment"
            value={5}
            icon={<DevicesIcon fontSize="large" />}
            color="#16a34a"
            to="/assets?department=Finance"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Other"
            value={7}
            icon={<DevicesIcon fontSize="large" />}
            color="#ca8a04"
            to="/assets?department=Infrastructure"
          />
        </Grid>
      </Grid>
    </Container>
  );
}

function requireAuth() {
  return true; // Bypass authentication for development
}

function DashboardLayout({ children, breadcrumbs }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <Header />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
        <Toolbar /> {/* This adds spacing below the fixed header */}
        <Breadcrumbs customBreadcrumbs={breadcrumbs} />
        {children}
      </Box>
    </Box>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/assets" element={requireAuth() ? <DashboardLayout><AssetsList/></DashboardLayout> : <Navigate to="/login" replace />} />
      <Route path="/assets/add" element={requireAuth() ? <DashboardLayout><AddAsset/></DashboardLayout> : <Navigate to="/login" replace />} />
      <Route path="/assets/:id" element={requireAuth() ? <DashboardLayout><AssetDetail/></DashboardLayout> : <Navigate to="/login" replace />} />
      <Route path="/assets/:id/edit" element={requireAuth() ? <DashboardLayout><ModifyAsset/></DashboardLayout> : <Navigate to="/login" replace />} />
      <Route
        path="/"
        element={requireAuth() ? <DashboardLayout><Dashboard /></DashboardLayout> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App;
