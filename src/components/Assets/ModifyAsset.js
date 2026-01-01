import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function readAssets() {
  try {
    const raw = localStorage.getItem('dm_assets');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function writeAssets(list) {
  try {
    localStorage.setItem('dm_assets', JSON.stringify(list));
  } catch (e) {
    // ignore
  }
}

export default function ModifyAsset() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);

  const SAMPLE_NAMES = ['Printer-01', 'Router-Edge', 'Workstation-101', 'Camera-Lobby', 'Switch-01'];
  const SAMPLE_CATEGORIES = ['Printer', 'Router', 'PC', 'Camera', 'Switch', 'Server', 'Firewall', 'Access Point'];
  const LOCATIONS = ['Head Office', 'Ekala', 'Nugegoda', 'Galle', 'Kotte', 'Moratuwa'];
  const SAMPLE_BRANDS = ['Dell', 'HP', 'Lenovo', 'Asus', 'Cisco'];
  const DESIGNATIONS = ['Engineer', 'Manager', 'Technician', 'Clerk'];
  const DIVISIONS = ['IT', 'HR', 'Finance', 'Operations'];
  const SECTIONS = ['Section A', 'Section B', 'Section C'];
  const VENDORS = ['Vendor A', 'Vendor B', 'Vendor C'];
  const BRANCHES = ['Head Office', 'Ekala', 'Nugegoda'];
  const FLOORS = ['Ground', '1st', '2nd', '3rd'];
  const STATUS_OPTIONS = ['Active', 'In Repair', 'Transferred', 'Retired'];

  useEffect(() => {
    const ds = readAssets();
    const found = ds.find((d) => String(d.id) === String(id));
    if (!found) {
      setAsset(null);
      setLoading(false);
      return;
    }
    setAsset(found);
    setLoading(false);
  }, [id]);

  const handleChange = (field) => (e) => {
    setAsset({ ...asset, [field]: e.target.value });
  };

  const handleModify = () => {
    if (!asset) return;
    // simple validation for required fields
    if (!asset.serialNumber || !asset.ip) {
      // basic UX: show alert and prevent save
      // consider replacing with nicer UI/validation later
      // eslint-disable-next-line no-alert
      alert('Serial Number and IP Address are required.');
      return;
    }
    const ds = readAssets();
    const idx = ds.findIndex((d) => String(d.id) === String(id));
    if (idx === -1) return;
    const next = [...ds];
    next[idx] = asset;
    writeAssets(next);
    navigate('/assets');
  };

  if (loading) return null;

  if (!asset) return (
    <Box sx={{ p: 3 }}>
      <Typography>Asset not found.</Typography>
      <Button sx={{ mt: 2 }} onClick={() => navigate('/assets')}>Back</Button>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2, maxWidth: 720 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Modify Asset</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <TextField label="Asset Number" value={asset.assetNo || ''} onChange={handleChange('assetNo')} />
          <TextField label="PC Name" value={asset.name || ''} onChange={handleChange('name')} />
          <TextField label="Date Added" type="date" InputLabelProps={{ shrink: true }} value={asset.addedDate || ''} onChange={handleChange('addedDate')} />
          <TextField label="Transfer Date" type="date" InputLabelProps={{ shrink: true }} value={asset.transferDate || ''} onChange={handleChange('transferDate')} />
          <TextField label="Employee Number" value={asset.empNo || ''} onChange={handleChange('empNo')} />
          <TextField label="Employee Name" value={asset.empName || ''} onChange={handleChange('empName')} />

          <FormControl fullWidth size="small">
            <InputLabel id="designation-label">Designation</InputLabel>
            <Select labelId="designation-label" label="Designation" value={asset.designation || ''} onChange={handleChange('designation')}>
              <MenuItem value="">None</MenuItem>
              {DESIGNATIONS.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel id="division-label">Division</InputLabel>
            <Select labelId="division-label" label="Division" value={asset.division || ''} onChange={handleChange('division')}>
              <MenuItem value="">None</MenuItem>
              {DIVISIONS.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel id="section-label">Section</InputLabel>
            <Select labelId="section-label" label="Section" value={asset.section || ''} onChange={handleChange('section')}>
              <MenuItem value="">None</MenuItem>
              {SECTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel id="category-label">Category</InputLabel>
            <Select labelId="category-label" label="Category" value={asset.category || ''} onChange={handleChange('category')}>
              <MenuItem value="">None</MenuItem>
              {SAMPLE_CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel id="brand-label">Brand</InputLabel>
            <Select labelId="brand-label" label="Brand" value={asset.brand || ''} onChange={handleChange('brand')}>
              <MenuItem value="">Other</MenuItem>
              {SAMPLE_BRANDS.map((b) => <MenuItem key={b} value={b}>{b}</MenuItem>)}
            </Select>
          </FormControl>

          <TextField label="Model" value={asset.model || ''} onChange={handleChange('model')} />
          <TextField required label="Serial Number" value={asset.serialNumber || ''} onChange={handleChange('serialNumber')} />
          <TextField label="IP Address" value={asset.ip || ''} onChange={handleChange('ip')} />

          <TextField label="Processor" value={asset.processor || ''} onChange={handleChange('processor')} />
          <TextField label="RAM (GB)" type="number" value={asset.ram || ''} onChange={handleChange('ram')} />
          <TextField label="Hard Disk (GB)" type="number" value={asset.harddisk || ''} onChange={handleChange('harddisk')} />
          <TextField label="SSD (GB)" type="number" value={asset.ssd || ''} onChange={handleChange('ssd')} />

          <FormControl fullWidth size="small">
            <InputLabel id="vendor-label">Vendor</InputLabel>
            <Select labelId="vendor-label" label="Vendor" value={asset.vendor || ''} onChange={handleChange('vendor')}>
              <MenuItem value="">None</MenuItem>
              {VENDORS.map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
            </Select>
          </FormControl>

          <TextField label="Purchased Year" type="number" value={asset.purchasedYear || ''} onChange={handleChange('purchasedYear')} />

          <FormControl fullWidth size="small">
            <InputLabel id="branch-label">Branch</InputLabel>
            <Select labelId="branch-label" label="Branch" value={asset.branch || ''} onChange={handleChange('branch')}>
              <MenuItem value="">None</MenuItem>
              {BRANCHES.map((b) => <MenuItem key={b} value={b}>{b}</MenuItem>)}
            </Select>
          </FormControl>

          <TextField label="CSC" value={asset.csc || ''} onChange={handleChange('csc')} />

          <FormControl fullWidth size="small">
            <InputLabel id="floor-label">Floor</InputLabel>
            <Select labelId="floor-label" label="Floor" value={asset.floor || ''} onChange={handleChange('floor')}>
              <MenuItem value="">None</MenuItem>
              {FLOORS.map((f) => <MenuItem key={f} value={f}>{f}</MenuItem>)}
            </Select>
          </FormControl>

          <TextField fullWidth sx={{ gridColumn: 'span 2' }} label="Remarks" value={asset.remarks || ''} onChange={handleChange('remarks')} multiline rows={3} />

          <FormControl fullWidth size="small">
            <InputLabel id="warranty-label">Maintenance Warranty</InputLabel>
            <Select labelId="warranty-label" label="Maintenance Warranty" value={asset.maintenanceWarranty || 'No'} onChange={handleChange('maintenanceWarranty')}>
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Warranty Start Date" type="date" InputLabelProps={{ shrink: true }} value={asset.maintenanceWarrantyStartDate || ''} onChange={handleChange('maintenanceWarrantyStartDate')} />
          <TextField label="Warranty End Date" type="date" InputLabelProps={{ shrink: true }} value={asset.maintenanceWarrantyEndDate || ''} onChange={handleChange('maintenanceWarrantyEndDate')} />

          <FormControl fullWidth size="small">
            <InputLabel id="status-label">Status</InputLabel>
            <Select labelId="status-label" label="Status" value={asset.status || 'Active'} onChange={handleChange('status')}>
              {STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Status Date" type="date" InputLabelProps={{ shrink: true }} value={asset.dateOfStatus || ''} onChange={handleChange('dateOfStatus')} />

          <Box sx={{ gridColumn: 'span 2', display: 'flex', gap: 2 }}>
            <Button variant="contained" onClick={handleModify}>Modify</Button>
            <Button variant="outlined" onClick={() => navigate('/assets')}>Cancel</Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
