import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import notificationService from '../../utils/notificationService';
import Preloader from '../common/Preloader';

const API_BASE_URL = 'http://localhost:5000/api';

export default function ModifyAsset() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const SAMPLE_CATEGORIES = ['AIO', 'CMP', 'LTP', 'MINI', 'MON', 'PRT', 'SCN', 'TV'];
  const SAMPLE_BRANDS = ['ACER', 'ASUS', 'AUI', 'AVISION', 'BROTHER', 'CANON', 'DELL', 'EPSON', 'EW195', 'EWIS', 'HP', 'KODAK', 'LENOVO', 'LEXMARK', 'PRINTRONIX', 'SAMSUNG', 'TALLY GENICOM'];
  const DIVISIONS = ['ACC', 'ACT', 'ADM', 'Adm.', 'AUD', 'AUT', 'BO', 'BRACT', 'COR', 'CSD', 'CSC', 'CSM', 'CVL', 'DCS', 'DGM', 'EK', 'ENG', 'Eng.', 'FIN', 'GL-DGM', 'GLE-CSC', 'HKD-CSC', 'HR', 'KEL', 'KL', 'MOR', 'NG', 'OPE', 'OPR', 'PRJ', 'SD', 'STR', 'WK'];
  const DESIGNATIONS = ['Engineer', 'Manager', 'Technician', 'Clerk'];
  const SECTIONS = ['ACC', 'ACT', 'ADM', 'AMB-CSC', 'AUD', 'BO', 'BRACT', 'CON', 'COR', 'CSC', 'CSD', 'DCS', 'DDD', 'DGM', 'ENG', 'EXAUD', 'FIN', 'GLE-CSC', 'HKD-CSC', 'HIK-CSC', 'IAUD', 'INT', 'IT', 'IT ROOM', 'KELBR', 'KELDL', 'LEG', 'MGT', 'MOR', 'NUBR', 'OPE', 'OPR', 'PHM', 'PLD', 'PLRD', 'PRJ', 'SDC', 'SOD', 'SOM', 'STR', 'SUP', 'TES', 'TEST', 'TRE'];
  const VENDORS = ['DEBUG'];
  const BRANCHES = ['Head Office', 'Nugegoda','Galle', 'Kotte', 'Moratuwa', 'Kelaniya', 'Kaluthara', 'Negambo'];
  const FLOORS = ['1st Floor', '2nd Floor', '3rd Floor', '4th Floor'];
  const STATUS_OPTIONS = ['Active', 'In Repair', 'Transferred', 'Retired'];

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/assets/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setAsset(null);
            setError('Asset not found');
          } else {
            throw new Error(`Failed to fetch asset: ${response.statusText}`);
          }
        } else {
          const data = await response.json();
          // Map backend field names to frontend field names
          const backendAsset = data.data;
          const mappedAsset = {
            assetNo: backendAsset.assetNo,
            name: backendAsset.pcName,
            addedDate: backendAsset.addedDate ? backendAsset.addedDate.split('T')[0] : '',
            transferDate: backendAsset.transferDate ? backendAsset.transferDate.split('T')[0] : '',
            empNo: backendAsset.empNo,
            empName: backendAsset.empName,
            designation: backendAsset.designation,
            division: backendAsset.division,
            section: backendAsset.section,
            category: backendAsset.assetCategory,
            brand: backendAsset.assetBrand,
            model: backendAsset.assetModel,
            serialNumber: backendAsset.assetSerialNo,
            ip: backendAsset.assetIp,
            processor: backendAsset.processor,
            ram: backendAsset.ram,
            harddisk: backendAsset.harddisk,
            ssd: backendAsset.ssd,
            vendor: backendAsset.vendor,
            purchasedYear: backendAsset.purchasedYear,
            branch: backendAsset.branch,
            csc: backendAsset.csc,
            floor: backendAsset.floor,
            remarks: backendAsset.remarks,
            maintenanceWarranty: backendAsset.maintenanceWarranty,
            maintenanceWarrantyStartDate: backendAsset.maintenanceWarrantyStartDate ? backendAsset.maintenanceWarrantyStartDate.split('T')[0] : '',
            maintenanceWarrantyEndDate: backendAsset.maintenanceWarrantyEndDate ? backendAsset.maintenanceWarrantyEndDate.split('T')[0] : '',
            status: backendAsset.status,
            dateOfStatus: backendAsset.dateOfStatus ? backendAsset.dateOfStatus.split('T')[0] : ''
          };
          setAsset(mappedAsset);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching asset:', err);
        setError(err.message);
        setAsset(null);
        // Show error notification
        await notificationService.notifyError(
          `Failed to load asset: ${err.message}`
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAsset();
    }
  }, [id]);

  const handleChange = (field) => (e) => {
    setAsset({ ...asset, [field]: e.target.value });
  };

  const handleModify = async () => {
    if (!asset) return;

    const requiredFields = [
      { field: 'category', label: 'Category' },
      { field: 'brand', label: 'Brand' },
      { field: 'model', label: 'Model' },
      { field: 'serialNumber', label: 'Serial Number' },
      { field: 'division', label: 'Division' },
      { field: 'branch', label: 'Branch' },
      { field: 'empName', label: 'Employee Name' },
    ];

    const missing = requiredFields.filter((f) => !asset[f.field]);
    if (missing.length) {
      const missingLabels = missing.map(f => f.label).join(', ');
      await notificationService.notifyError(
        `Please fill required fields: ${missingLabels}`
      );
      return;
    }

    try {
      // Show loading notification
      await notificationService.notifyCustom('Updating Asset', 'Please wait...', {
        severity: 'info',
        duration: 2000
      });

      // Map frontend field names to backend field names
      const backendPayload = {
        assetNo: asset.assetNo,
        pcName: asset.name,
        addedDate: asset.addedDate || null,
        transferDate: asset.transferDate || null,
        empNo: asset.empNo,
        empName: asset.empName,
        designation: asset.designation || null,
        division: asset.division,
        section: asset.section || null,
        assetCategory: asset.category,
        assetBrand: asset.brand,
        assetModel: asset.model,
        assetSerialNo: asset.serialNumber,
        assetIp: asset.ip,
        processor: asset.processor || null,
        ram: asset.ram || null,
        harddisk: asset.harddisk || null,
        ssd: asset.ssd || null,
        vendor: asset.vendor || null,
        purchasedYear: asset.purchasedYear || null,
        branch: asset.branch,
        csc: asset.csc || null,
        floor: asset.floor || null,
        remarks: asset.remarks || null,
        maintenanceWarranty: asset.maintenanceWarranty || 'No',
        maintenanceWarrantyStartDate: asset.maintenanceWarrantyStartDate || null,
        maintenanceWarrantyEndDate: asset.maintenanceWarrantyEndDate || null,
        status: asset.status || 'Active',
        dateOfStatus: asset.dateOfStatus || null
      };

      const response = await fetch(`${API_BASE_URL}/assets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update asset: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Show success notification with detailed info
      await notificationService.notifyDeviceModified({
        assetNo: asset.assetNo,
        name: asset.name || 'Asset',
        category: asset.category,
        brand: asset.brand
      });
      
      // Navigate after a brief delay to ensure notification is seen
      setTimeout(() => navigate('/assets'), 500);
    } catch (err) {
      console.error('Error updating asset:', err);
      // Show detailed error notification
      await notificationService.notifyError(
        err.message || 'Failed to update asset. Please check your input and try again.'
      );
    }
  };

  if (loading) return (
    <Preloader message="Loading asset details..." />
  );

  if (error || !asset) return (
    <Box sx={{ p: 3 }}>
      <Typography color="error">{error || 'Asset not found.'}</Typography>
      <Button sx={{ mt: 2 }} onClick={() => navigate('/assets')}>Back</Button>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, maxWidth: 900 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Modify Asset</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <TextField label="Asset Number" value={asset.assetNo || ''} onChange={handleChange('assetNo')} />
          <TextField label="PC Name" value={asset.name || ''} onChange={handleChange('name')} />
          <TextField label="Date Added" type="date" InputLabelProps={{ shrink: true }} value={asset.addedDate || ''} onChange={handleChange('addedDate')} />
          <TextField label="Transfer Date" type="date" InputLabelProps={{ shrink: true }} value={asset.transferDate || ''} onChange={handleChange('transferDate')} />
          <TextField label="Employee Number" value={asset.empNo || ''} onChange={handleChange('empNo')} />
          <TextField required label="Employee Name" value={asset.empName || ''} onChange={handleChange('empName')} />

          <TextField label="Designation" value={asset.designation || ''} onChange={handleChange('designation')} />

          <FormControl fullWidth size="small" required>
            <InputLabel id="division-label">Division</InputLabel>
            <Select labelId="division-label" label="Division" value={asset.division || ''} onChange={handleChange('division')}>
              <MenuItem value="">None</MenuItem>
              {DIVISIONS.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" required>
            <InputLabel id="section-label">Section</InputLabel>
            <Select labelId="section-label" label="Section" value={asset.section || ''} onChange={handleChange('section')}>
              <MenuItem value="">None</MenuItem>
              {SECTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" required>
            <InputLabel id="category-label">Category</InputLabel>
            <Select labelId="category-label" label="Category" value={asset.category || ''} onChange={handleChange('category')}>
              <MenuItem value="">None</MenuItem>
              {SAMPLE_CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" required>
            <InputLabel id="brand-label">Brand</InputLabel>
            <Select labelId="brand-label" label="Brand" value={asset.brand || ''} onChange={handleChange('brand')}>
              <MenuItem value="">Other</MenuItem>
              {SAMPLE_BRANDS.map((b) => <MenuItem key={b} value={b}>{b}</MenuItem>)}
            </Select>
          </FormControl>

          <TextField required label="Model" value={asset.model || ''} onChange={handleChange('model')} />
          <TextField required label="Serial Number" value={asset.serialNumber || ''} onChange={handleChange('serialNumber')} />
          <TextField label="IP Address" value={asset.ip || ''} onChange={handleChange('ip')} />

          <TextField label="Processor" value={asset.processor || ''} onChange={handleChange('processor')} />
          <TextField label="RAM (GB)" type="number" value={asset.ram || ''} onChange={handleChange('ram')} />
          <TextField label="Hard Disk (GB)" type="number" value={asset.harddisk || ''} onChange={handleChange('harddisk')} />
          <TextField label="SSD (GB)" type="number" value={asset.ssd || ''} onChange={handleChange('ssd')} />

          <TextField label="Vendor" value={asset.vendor || ''} onChange={handleChange('vendor')} />

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
