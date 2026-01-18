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
import notificationService from '../../utils/notificationService';

const API_BASE_URL = 'http://localhost:5000/api';

/* ---------------- Dropdown Data ---------------- */
const CATEGORIES = ['AIO', 'CMP', 'LTP', 'MINI', 'MON', 'PRT', 'SCN', 'TV'];
const BRANDS = ['ACER', 'ASUS', 'AUI', 'AVISION', 'BROTHER', 'CANON', 'DELL', 'EPSON', 'EW195', 'EWIS', 'HP', 'KODAK', 'LENOVO', 'LEXMARK', 'PRINTRONIX', 'SAMSUNG', 'TALLY GENICOM'];
const DIVISIONS = ['ACC', 'ACT', 'ADM', 'Adm.', 'AUD', 'AUT', 'BO', 'BRACT', 'COR', 'CSD', 'CSC', 'CSM', 'CVL', 'DCS', 'DGM', 'EK', 'ENG', 'Eng.', 'FIN', 'GL-DGM', 'GLE-CSC', 'HKD-CSC', 'HR', 'KEL', 'KL', 'MOR', 'NG', 'OPE', 'OPR', 'PRJ', 'SD', 'STR', 'WK'];
const DESIGNATIONS = ['Engineer', 'Manager', 'Technician', 'Clerk'];
const SECTIONS = ['ACC', 'ACT', 'ADM', 'AMB-CSC', 'AUD', 'BO', 'BRACT', 'CON', 'COR', 'CSC', 'CSD', 'DCS', 'DDD', 'DGM', 'ENG', 'EXAUD', 'FIN', 'GLE-CSC', 'HKD-CSC', 'HIK-CSC', 'IAUD', 'INT', 'IT', 'IT ROOM', 'KELBR', 'KELDL', 'LEG', 'MGT', 'MOR', 'NUBR', 'OPE', 'OPR', 'PHM', 'PLD', 'PLRD', 'PRJ', 'SDC', 'SOD', 'SOM', 'STR', 'SUP', 'TES', 'TEST', 'TRE'];
const VENDORS = ['EWIS', 'METRO', 'DEBUG','VSIS',''];
const BRANCHES = ['Head Office', 'Nugegoda', 'Galle', 'Kotte', 'Moratuwa', 'Kelaniya', 'Kaluthara', 'Negambo'];
const FLOORS = ['1st Floor', '2nd Floor', '3rd Floor', '4th Floor'];
const STATUS_OPTIONS = ['Active', 'In Repair', 'Transferred', 'Retired'];
const YEARS = Array.from({ length: 27 }, (_, i) => 2026 - i); // 2026 down to 2000

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!form.serialNumber) {
      await notificationService.notifyError('Serial Number is required');
      return;
    }

    if (!form.empName) {
      await notificationService.notifyError('Employee Name is required');
      return;
    }

    if (!form.category || !form.brand || !form.model) {
      await notificationService.notifyError('Category, Brand, and Model are required fields');
      return;
    }

    if (!form.division || !form.section) {
      await notificationService.notifyError('Division and Section are required fields');
      return;
    }

    const newAsset = {
      assetNo: form.assetNo,
      pcName: form.name,
      addedDate: form.addedDate || null,
      transferDate: form.transferDate || null,
      empNo: form.empNumber,
      empName: form.empName,
      designation: form.designation,
      division: form.division,
      section: form.section,
      assetCategory: form.category,
      assetBrand: form.brand,
      assetModel: form.model,
      assetSerialNo: form.serialNumber,
      assetIp: form.ip,
      processor: form.processor,
      ram: form.ram ? parseInt(form.ram) : null,
      harddisk: form.harddisk ? parseInt(form.harddisk) : null,
      ssd: form.ssd ? parseInt(form.ssd) : null,
      vendor: form.vendor,
      purchasedYear: form.purchasedYear ? parseInt(form.purchasedYear) : null,
      branch: form.branch,
      csc: form.csc,
      floor: form.floor,
      remarks: form.remarks,
      maintenanceWarranty: form.maintenanceWarranty === 'Yes' ? 'Y' : 'N',
      maintenanceWarrantyStartDate: form.maintenanceWarrantyStartDate || null,
      maintenanceWarrantyEndDate: form.maintenanceWarrantyEndDate || null,
      // Convert status to single character: A=Active, I=In Repair, T=Transferred, R=Retired
      status: form.status === 'Active' ? 'A' : form.status === 'In Repair' ? 'I' : form.status === 'Transferred' ? 'T' : form.status === 'Retired' ? 'R' : 'A',
      dateOfStatus: form.dateOfStatus || null,
    };

    try {
      // Show loading notification
      await notificationService.notifyCustom('Creating Asset', 'Please wait...', {
        severity: 'info',
        duration: 2000
      });

      const response = await fetch(`${API_BASE_URL}/assets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAsset),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to create asset: ${response.statusText}`);
      }

      if (data.success) {
        // Show success notification with detailed info
        await notificationService.notifyDeviceAdded({
          assetNo: newAsset.assetNo,
          name: newAsset.pcName || 'New Asset',
          category: newAsset.assetCategory,
          brand: newAsset.assetBrand
        });
        
        // Navigate after a brief delay to ensure notification is seen
        setTimeout(() => navigate('/assets'), 500);
      } else {
        throw new Error(data.message || 'Failed to create asset');
      }
    } catch (err) {
      console.error('Error creating asset:', err);
      // Show detailed error notification
      await notificationService.notifyError(
        err.message || 'Failed to create asset. Please check your input and try again.'
      );
    }
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
          <TextField label="Asset Number" value={form.assetNo} onChange={handleChange('assetNo')} />
          <TextField label="PC Name" value={form.name} onChange={handleChange('name')} />
          
          <TextField label="Date Added" type="date" InputLabelProps={{ shrink: true }} value={form.addedDate} onChange={handleChange('addedDate')} />
          <TextField label="Transfer Date" type="date" InputLabelProps={{ shrink: true }} value={form.transferDate} onChange={handleChange('transferDate')} />
          
          <TextField label="Employee Number" value={form.empNumber} onChange={handleChange('empNumber')} />
          <TextField label="Employee Name" required value={form.empName} onChange={handleChange('empName')} />

          <TextField label="Designation" value={form.designation} onChange={handleChange('designation')} />

          <FormControl fullWidth size="small" required>
            <InputLabel>Division</InputLabel>
            <Select label="Division" value={form.division} onChange={handleChange('division')}>
              <MenuItem value="">None</MenuItem>
              {DIVISIONS.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" required>
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
          <TextField label="IP Address" value={form.ip} onChange={handleChange('ip')} />

          <TextField label="Processor" value={form.processor} onChange={handleChange('processor')} />
          <TextField label="RAM (GB)" type="number" inputProps={{ min: 0 }} value={form.ram} onChange={handleChange('ram')} />
          <TextField label="Hard Disk (GB)" type="number" inputProps={{ min: 0 }} value={form.harddisk} onChange={handleChange('harddisk')} />
          <TextField label="SSD (GB)" type="number" inputProps={{ min: 0 }} value={form.ssd} onChange={handleChange('ssd')} />

          <TextField label="Vendor" value={form.vendor} onChange={handleChange('vendor')} />

          <FormControl fullWidth size="small">
            <InputLabel>Purchased Year</InputLabel>
            <Select label="Purchased Year" value={form.purchasedYear} onChange={handleChange('purchasedYear')}>
              <MenuItem value="">None</MenuItem>
              {YEARS.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
            </Select>
          </FormControl>

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
