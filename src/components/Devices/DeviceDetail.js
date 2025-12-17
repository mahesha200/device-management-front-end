import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button } from '@mui/material';

function readDevices() {
  try { return JSON.parse(localStorage.getItem('dm_devices') || '[]'); } catch { return []; }
}

export default function DeviceDetail() {
  const { id } = useParams();
  const [device, setDevice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const dev = readDevices().find((d) => String(d.id) === String(id));
    setDevice(dev || null);
  }, [id]);

  if (!device) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Device not found</Typography>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/devices')}>Back to list</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5">{device.name}</Typography>
          <Button component={RouterLink} to="/devices">Back</Button>
        </Box>

        <Typography><strong>IP Address:</strong> {device.ip}</Typography>
        <Typography><strong>Department:</strong> {device.department}</Typography>
        <Typography><strong>Category:</strong> {device.category}</Typography>
        <Typography sx={{ mt: 2 }}><strong>Description:</strong> {device.description || '—'}</Typography>
      </Paper>
    </Box>
  );
}
