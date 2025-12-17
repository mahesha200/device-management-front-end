import React, { useState } from 'react';
import { Box, Paper, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function readDevices() {
  try { return JSON.parse(localStorage.getItem('dm_devices') || '[]'); } catch { return []; }
}

export default function AddDevice() {
  const [name, setName] = useState('');
  const [ip, setIp] = useState('');
  const [department, setDepartment] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const devices = readDevices();
    const id = Date.now();
    const newDevice = { id, name, ip, department, category, description };
    devices.unshift(newDevice);
    localStorage.setItem('dm_devices', JSON.stringify(devices));
    navigate('/devices');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <h2>Add Device</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
          <TextField label="Device Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <TextField label="IP Address" value={ip} onChange={(e) => setIp(e.target.value)} required />
          <TextField label="Department" value={department} onChange={(e) => setDepartment(e.target.value)} />
          <TextField label="Device Category" value={category} onChange={(e) => setCategory(e.target.value)} />
          <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} multiline rows={3} />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained">Add</Button>
            <Button variant="outlined" onClick={() => navigate('/devices')}>Cancel</Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
