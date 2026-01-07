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
const CATEGORIES = ['Printer', 'Router', 'PC', 'Camera', 'Switch', 'Server', 'Firewall', 'Access Point'];
const BRANDS = ['Dell', 'HP', 'Lenovo', 'Asus', 'Cisco'];
const DESIGNATIONS = ['Engineer', 'Manager', 'Technician', 'Clerk'];
const DIVISIONS = ['IT', 'HR', 'Finance', 'Operations'];
const SECTIONS = ['Section A', 'Section B', 'Section C'];
const VENDORS = ['Vendor A', 'Vendor B', 'Vendor C'];
const BRANCHES = ['Head Office', 'Nugegoda', 'Galle', 'Kotte', 'Moratuwa', 'Kelaniya'];
const FLOORS = ['Ground', '1st', '2nd', '3rd'];
const STATUS_OPTIONS = ['Active', 'In Repair', 'Transferred', 'Retired'];

/* ---------------- Component ---------------- */
export default function AddAsset() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    assetNo: '',
    name: '',
    addedDate: '',
    transferDate: '',
    empNumber: '',
    empName: '',
    designation: '',
    division: '',
    section: '',
    category: '',
    brand: '',
    model: '',
    serialNumber: '',
    ip: '',
    processor: '',
    ram: '',
    harddisk: '',
    ssd: '',
    vendor: '',
    purchasedYear: '',
    branch: '',
    csc: '',
    floor: '',
    remarks: '',
    maintenanceWarranty: 'No',
    maintenanceWarrantyStartDate: '',
    maintenanceWarrantyEndDate: '',
    status: 'Active',
    dateOfStatus: '',
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
      addedDate: form.addedDate,
      transferDate: form.transferDate,
      empNo: form.empNumber,
      empName: form.empName,
      designation: form.designation,
      division: form.division,
      department: form.division, // used for URL filter
      section: form.section,
      category: form.category,
      brand: form.brand,
      model: form.model,
      serialNumber: form.serialNumber,
      ip: form.ip,
      processor: form.processor,
      ram: form.ram,
      harddisk: form.harddisk,
      ssd: form.ssd,
      vendor: form.vendor,
      purchasedYear: form.purchasedYear,
      branch: form.branch,
      csc: form.csc,
      floor: form.floor,
      remarks: form.remarks,
      maintenanceWarranty: form.maintenanceWarranty,
      maintenanceWarrantyStartDate: form.maintenanceWarrantyStartDate,
      maintenanceWarrantyEndDate: form.maintenanceWarrantyEndDate,
      status: form.status,
      dateOfStatus: form.dateOfStatus,
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
          <TextField label="Asset Number" required value={form.assetNo} onChange={handleChange('assetNo')} />
          <TextField label="PC Name" required value={form.name} onChange={handleChange('name')} />
          
          <TextField label="Date Added" type="date" InputLabelProps={{ shrink: true }} value={form.addedDate} onChange={handleChange('addedDate')} />
          <TextField label="Transfer Date" type="date" InputLabelProps={{ shrink: true }} value={form.transferDate} onChange={handleChange('transferDate')} />
          
          <TextField label="Employee Number" required value={form.empNumber} onChange={handleChange('empNumber')} />
          <TextField label="Employee Name" required value={form.empName} onChange={handleChange('empName')} />

          <FormControl fullWidth size="small">
            <InputLabel>Designation</InputLabel>
            <Select label="Designation" value={form.designation} onChange={handleChange('designation')}>
              <MenuItem value="">None</MenuItem>
              {DESIGNATIONS.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" required>
            <InputLabel>Division</InputLabel>
            <Select label="Division" value={form.division} onChange={handleChange('division')}>
              <MenuItem value="">None</MenuItem>
              {DIVISIONS.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Section</InputLabel>
            <Select label="Section" value={form.section} onChange={handleChange('section')}>
              <MenuItem value="">None</MenuItem>
              {SECTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" required>
            <InputLabel>Category</InputLabel>
            <Select label="Category" value={form.category} onChange={handleChange('category')}>
              <MenuItem value="">None</MenuItem>
              {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" required>
            <InputLabel>Brand</InputLabel>
            <Select label="Brand" value={form.brand} onChange={handleChange('brand')}>
              <MenuItem value="">Other</MenuItem>
              {BRANDS.map((b) => <MenuItem key={b} value={b}>{b}</MenuItem>)}
            </Select>
          </FormControl>

          <TextField label="Model" required value={form.model} onChange={handleChange('model')} />
          <TextField label="Serial Number" required value={form.serialNumber} onChange={handleChange('serialNumber')} />
          <TextField label="IP Address" required value={form.ip} onChange={handleChange('ip')} />

          <TextField label="Processor" value={form.processor} onChange={handleChange('processor')} />
          <TextField label="RAM (GB)" type="number" value={form.ram} onChange={handleChange('ram')} />
          <TextField label="Hard Disk (GB)" type="number" value={form.harddisk} onChange={handleChange('harddisk')} />
          <TextField label="SSD (GB)" type="number" value={form.ssd} onChange={handleChange('ssd')} />

          <FormControl fullWidth size="small">
            <InputLabel>Vendor</InputLabel>
            <Select label="Vendor" value={form.vendor} onChange={handleChange('vendor')}>
              <MenuItem value="">None</MenuItem>
              {VENDORS.map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
            </Select>
          </FormControl>

          <TextField label="Purchased Year" type="number" value={form.purchasedYear} onChange={handleChange('purchasedYear')} />

          <FormControl fullWidth size="small">
            <InputLabel>Branch</InputLabel>
            <Select label="Branch" value={form.branch} onChange={handleChange('branch')}>
              <MenuItem value="">None</MenuItem>
              {BRANCHES.map((b) => <MenuItem key={b} value={b}>{b}</MenuItem>)}
            </Select>
          </FormControl>

          <TextField label="CSC" value={form.csc} onChange={handleChange('csc')} />

          <FormControl fullWidth size="small">
            <InputLabel>Floor</InputLabel>
            <Select label="Floor" value={form.floor} onChange={handleChange('floor')}>
              <MenuItem value="">None</MenuItem>
              {FLOORS.map((f) => <MenuItem key={f} value={f}>{f}</MenuItem>)}
            </Select>
          </FormControl>

          <TextField fullWidth sx={{ gridColumn: 'span 2' }} label="Remarks" value={form.remarks} onChange={handleChange('remarks')} multiline rows={3} />

          <FormControl fullWidth size="small">
            <InputLabel>Maintenance Warranty</InputLabel>
            <Select label="Maintenance Warranty" value={form.maintenanceWarranty} onChange={handleChange('maintenanceWarranty')}>
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </FormControl>
          
          <TextField label="Warranty Start Date" type="date" InputLabelProps={{ shrink: true }} value={form.maintenanceWarrantyStartDate} onChange={handleChange('maintenanceWarrantyStartDate')} />
          <TextField label="Warranty End Date" type="date" InputLabelProps={{ shrink: true }} value={form.maintenanceWarrantyEndDate} onChange={handleChange('maintenanceWarrantyEndDate')} />

          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select label="Status" value={form.status} onChange={handleChange('status')}>
              {STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
          
          <TextField label="Status Date" type="date" InputLabelProps={{ shrink: true }} value={form.dateOfStatus} onChange={handleChange('dateOfStatus')} />

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
