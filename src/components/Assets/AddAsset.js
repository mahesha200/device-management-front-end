import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

/* ---------------- Helpers ---------------- */
function readAssets() {
  try {
    return JSON.parse(localStorage.getItem('dm_assets') || '[]');
  } catch {
    return [];
  }
}

/* ---------------- Dropdown Data ---------------- */
const CATEGORIES = ['PC', 'Printer', 'Router', 'Switch', 'Camera', 'Server'];
const BRANDS = ['Dell', 'HP', 'Lenovo', 'Cisco', 'Canon', 'Asus'];
const DIVISIONS = ['Administration'];
const FLOORS = ['1st Floor', '2nd Floor', '3rd Floor', '4th Floor'];
const STATUS_OPTIONS = ['Active', 'In Repair', 'Transferred', 'Retired'];
const BRANCHES = ['Head Office', 'Ekala', 'Nugegoda'];

/* ---------------- Component ---------------- */
export default function AddAsset() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    assetNo: '',
    name: '',
    category: '',
    brand: '',
    model: '',
    serialNumber: '',
    ip: '',
    empName: '',
    empNumber: '',
    division: '',
    branch: '',
    floor: '',
    status: 'Active',
    dateOfStatus: '',
    remarks: '',
  });

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();

    const assets = readAssets();

    const newAsset = {
      id: Date.now().toString(),
      assetNo: form.assetNo,
      name: form.name,
      category: form.category,
      brand: form.brand,
      model: form.model,
      serialNumber: form.serialNumber,
      ip: form.ip,
      empName: form.empName,
      empNumber: form.empNumber,
      division: form.division,
      department: form.division, // used for URL filter
      branch: form.branch,
      floor: form.floor,
      status: form.status,
      dateOfStatus: form.dateOfStatus,
      remarks: form.remarks,
    };

    assets.unshift(newAsset);
    localStorage.setItem('dm_assets', JSON.stringify(assets));
    navigate('/assets');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, maxWidth: 900 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Add Asset
        </Typography>

        <form
          onSubmit={handleSubmit}
          style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}
        >
          {/* Asset Info */}
          <TextField label="Asset Number" required value={form.assetNo} onChange={handleChange('assetNo')} />
          <TextField label="PC / Asset Name" required value={form.name} onChange={handleChange('name')} />

          {/* Category */}
          <FormControl size="small" required>
            <InputLabel>Category</InputLabel>
            <Select label="Category" value={form.category} onChange={handleChange('category')}>
              {CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Brand */}
          <FormControl size="small" required>
            <InputLabel>Brand</InputLabel>
            <Select label="Brand" value={form.brand} onChange={handleChange('brand')}>
              {BRANDS.map((b) => (
                <MenuItem key={b} value={b}>{b}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField label="Model" required value={form.model} onChange={handleChange('model')} />
          <TextField label="Serial Number" required value={form.serialNumber} onChange={handleChange('serialNumber')} />

          <TextField label="IP Address" required value={form.ip} onChange={handleChange('ip')} />
          <TextField label="Employee Name" required value={form.empName} onChange={handleChange('empName')} />

          <TextField label="Employee Number" required value={form.empNumber} onChange={handleChange('empNumber')} />

          {/* Division */}
          <FormControl size="small" required>
            <InputLabel>Division</InputLabel>
            <Select label="Division" value={form.division} onChange={handleChange('division')}>
              {DIVISIONS.map((d) => (
                <MenuItem key={d} value={d}>{d}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Branch */}
          <FormControl size="small" required>
            <InputLabel>Branch</InputLabel>
            <Select label="Branch" value={form.branch} onChange={handleChange('branch')}>
              {BRANCHES.map((b) => (
                <MenuItem key={b} value={b}>{b}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Floor */}
          <FormControl size="small">
            <InputLabel>Floor</InputLabel>
            <Select label="Floor" value={form.floor} onChange={handleChange('floor')}>
              {FLOORS.map((f) => (
                <MenuItem key={f} value={f}>{f}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Status */}
          <FormControl size="small">
            <InputLabel>Status</InputLabel>
            <Select label="Status" value={form.status} onChange={handleChange('status')}>
              {STATUS_OPTIONS.map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Status Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={form.dateOfStatus}
            onChange={handleChange('dateOfStatus')}
          />

          {/* Remarks */}
          <TextField
            label="Remarks"
            multiline
            rows={3}
            sx={{ gridColumn: 'span 2' }}
            value={form.remarks}
            onChange={handleChange('remarks')}
          />

          {/* Actions */}
          <Box sx={{ gridColumn: 'span 2', display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained">
              Add Asset
            </Button>
            <Button variant="outlined" onClick={() => navigate('/assets')}>
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
