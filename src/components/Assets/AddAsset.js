import React, { useState } from 'react';
import { Box, Paper, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function readAssets() {
  try { return JSON.parse(localStorage.getItem('dm_assets') || '[]'); } catch { return []; }
}

export default function AddAsset() {
  const [assetNo, setAssetNo] = useState('');
  const [pcName, setPcName] = useState('');
  const [addedDate, setAddedDate] = useState('');
  const [transferDate, setTransferDate] = useState('');
  const [empNo, setEmpNo] = useState('');
  const [empName, setEmpName] = useState('');
  const [designation, setDesignation] = useState('');
  const [division, setDivision] = useState('');
  const [section, setSection] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [ip, setIp] = useState('');
  const [processor, setProcessor] = useState('');
  const [ram, setRam] = useState('');
  const [harddisk, setHarddisk] = useState('');
  const [ssd, setSsd] = useState('');
  const [vendor, setVendor] = useState('');
  const [purchasedYear, setPurchasedYear] = useState('');
  const [branch, setBranch] = useState('');
  const [csc, setCsc] = useState('');
  const [floor, setFloor] = useState('');
  const [remarks, setRemarks] = useState('');
  const [maintenanceWarranty, setMaintenanceWarranty] = useState('No');
  const [maintenanceWarrantyStartDate, setMaintenanceWarrantyStartDate] = useState('');
  const [maintenanceWarrantyEndDate, setMaintenanceWarrantyEndDate] = useState('');
  const [status, setStatus] = useState('Active');
  const [dateOfStatus, setDateOfStatus] = useState('');

  const navigate = useNavigate();

  const SAMPLE_NAMES = ['Workstation-101', 'Laptop-22', 'Printer-01'];
  const SAMPLE_CATEGORIES = ['PC', 'Printer', 'Router', 'Camera', 'Switch', 'Server'];
  const SAMPLE_BRANDS = ['Dell', 'HP', 'Lenovo', 'Asus', 'Cisco'];
  const DESIGNATIONS = ['Engineer', 'Manager', 'Technician', 'Clerk'];
  const DIVISIONS = ['IT', 'HR', 'Finance', 'Operations'];
  const SECTIONS = ['Section A', 'Section B', 'Section C'];
  const VENDORS = ['Vendor A', 'Vendor B', 'Vendor C'];
  const BRANCHES = ['Head Office', 'Ekala', 'Nugegoda'];
  const FLOORS = ['Ground', '1st', '2nd', '3rd'];
  const STATUS_OPTIONS = ['Active', 'In Repair', 'Transferred', 'Retired'];

  const handleSubmit = (e) => {
    e.preventDefault();
    const assets = readAssets();
    const id = Date.now();
    const newAsset = {
      id,
      assetNo,
      name: pcName,
      addedDate,
      transferDate,
      empNo,
      empName,
      designation,
      division,
      section,
      category,
      brand,
      model,
      serialNumber,
      ip,
      processor,
      ram,
      harddisk,
      ssd,
      vendor,
      purchasedYear,
      branch,
      csc,
      floor,
      remarks,
      maintenanceWarranty,
      maintenanceWarrantyStartDate,
      maintenanceWarrantyEndDate,
      status,
      dateOfStatus,
    };
    assets.unshift(newAsset);
    localStorage.setItem('dm_assets', JSON.stringify(assets));
    navigate('/assets');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, maxWidth: 800 }}>
        <h2>Add Asset</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
          <TextField label="Asset Number" value={assetNo} onChange={(e) => setAssetNo(e.target.value)} />
          <TextField label="PC Name" value={pcName} onChange={(e) => setPcName(e.target.value)} />
          <TextField label="Date Added" type="date" InputLabelProps={{ shrink: true }} value={addedDate} onChange={(e) => setAddedDate(e.target.value)} />
          <TextField label="Transfer Date" type="date" InputLabelProps={{ shrink: true }} value={transferDate} onChange={(e) => setTransferDate(e.target.value)} />
          <TextField label="Employee Number" value={empNo} onChange={(e) => setEmpNo(e.target.value)} />
          <TextField label="Employee Name" value={empName} onChange={(e) => setEmpName(e.target.value)} />

          <FormControl fullWidth size="small">
            <InputLabel id="designation-label">Designation</InputLabel>
            <Select labelId="designation-label" label="Designation" value={designation} onChange={(e) => setDesignation(e.target.value)}>
              <MenuItem value="">None</MenuItem>
              {DESIGNATIONS.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel id="division-label">Division</InputLabel>
            <Select labelId="division-label" label="Division" value={division} onChange={(e) => setDivision(e.target.value)}>
              <MenuItem value="">None</MenuItem>
              {DIVISIONS.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel id="section-label">Section</InputLabel>
            <Select labelId="section-label" label="Section" value={section} onChange={(e) => setSection(e.target.value)}>
              <MenuItem value="">None</MenuItem>
              {SECTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              {SAMPLE_CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel id="brand-label">Brand</InputLabel>
            <Select labelId="brand-label" label="Brand" value={brand} onChange={(e) => setBrand(e.target.value)}>
              <MenuItem value="">Other</MenuItem>
              {SAMPLE_BRANDS.map((b) => <MenuItem key={b} value={b}>{b}</MenuItem>)}
            </Select>
          </FormControl>

          <TextField label="Model" value={model} onChange={(e) => setModel(e.target.value)} />
          <TextField required label="Serial Number" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} />
          <TextField label="IP Address" value={ip} onChange={(e) => setIp(e.target.value)} />

          <TextField label="Processor" value={processor} onChange={(e) => setProcessor(e.target.value)} />
          <TextField label="RAM (GB)" type="number" value={ram} onChange={(e) => setRam(e.target.value)} />
          <TextField label="Hard Disk (GB)" type="number" value={harddisk} onChange={(e) => setHarddisk(e.target.value)} />
          <TextField label="SSD (GB)" type="number" value={ssd} onChange={(e) => setSsd(e.target.value)} />

          <FormControl fullWidth size="small">
            <InputLabel id="vendor-label">Vendor</InputLabel>
            <Select labelId="vendor-label" label="Vendor" value={vendor} onChange={(e) => setVendor(e.target.value)}>
              <MenuItem value="">None</MenuItem>
              {VENDORS.map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
            </Select>
          </FormControl>

          <TextField label="Purchased Year" type="number" value={purchasedYear} onChange={(e) => setPurchasedYear(e.target.value)} />

          <FormControl fullWidth size="small">
            <InputLabel id="branch-label">Branch</InputLabel>
            <Select labelId="branch-label" label="Branch" value={branch} onChange={(e) => setBranch(e.target.value)}>
              <MenuItem value="">None</MenuItem>
              {BRANCHES.map((b) => <MenuItem key={b} value={b}>{b}</MenuItem>)}
            </Select>
          </FormControl>

          <TextField label="CSC" value={csc} onChange={(e) => setCsc(e.target.value)} />

          <FormControl fullWidth size="small">
            <InputLabel id="floor-label">Floor</InputLabel>
            <Select labelId="floor-label" label="Floor" value={floor} onChange={(e) => setFloor(e.target.value)}>
              <MenuItem value="">None</MenuItem>
              {FLOORS.map((f) => <MenuItem key={f} value={f}>{f}</MenuItem>)}
            </Select>
          </FormControl>

          <TextField fullWidth sx={{ gridColumn: 'span 2' }} label="Remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} multiline rows={3} />

          <FormControl fullWidth size="small">
            <InputLabel id="warranty-label">Maintenance Warranty</InputLabel>
            <Select labelId="warranty-label" label="Maintenance Warranty" value={maintenanceWarranty} onChange={(e) => setMaintenanceWarranty(e.target.value)}>
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Warranty Start Date" type="date" InputLabelProps={{ shrink: true }} value={maintenanceWarrantyStartDate} onChange={(e) => setMaintenanceWarrantyStartDate(e.target.value)} />
          <TextField label="Warranty End Date" type="date" InputLabelProps={{ shrink: true }} value={maintenanceWarrantyEndDate} onChange={(e) => setMaintenanceWarrantyEndDate(e.target.value)} />

          <FormControl fullWidth size="small">
            <InputLabel id="status-label">Status</InputLabel>
            <Select labelId="status-label" label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Status Date" type="date" InputLabelProps={{ shrink: true }} value={dateOfStatus} onChange={(e) => setDateOfStatus(e.target.value)} />

          <Box sx={{ gridColumn: 'span 2', display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained">Add</Button>
            <Button variant="outlined" onClick={() => navigate('/assets')}>Cancel</Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
