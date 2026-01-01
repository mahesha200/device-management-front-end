import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button } from '@mui/material';

function readAssets() {
  try { return JSON.parse(localStorage.getItem('dm_assets') || '[]'); } catch { return []; }
}

export default function AssetDetail() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const a = readAssets().find((d) => String(d.id) === String(id));
    setAsset(a || null);
  }, [id]);

  if (!asset) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Asset not found</Typography>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/assets')}>Back to list</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5">{asset.name}</Typography>
          <Button component={RouterLink} to="/assets">Back</Button>
        </Box>
        <Typography><strong>ASSET_NO:</strong> {asset.assetNo || '—'}</Typography>
        <Typography><strong>PC_NAME:</strong> {asset.name || '—'}</Typography>
        <Typography><strong>ADDED_DATE:</strong> {asset.addedDate || '—'}</Typography>
        <Typography><strong>TRANSFER_DATE:</strong> {asset.transferDate || '—'}</Typography>
        <Typography><strong>EMP_NO:</strong> {asset.empNo || '—'}</Typography>
        <Typography><strong>EMP_NAME:</strong> {asset.empName || '—'}</Typography>
        <Typography><strong>DESIGNATION:</strong> {asset.designation || '—'}</Typography>
        <Typography><strong>DIVISION:</strong> {asset.division || '—'}</Typography>
        <Typography><strong>SECTION:</strong> {asset.section || '—'}</Typography>
        <Typography><strong>ASSET_CATEGORY:</strong> {asset.category || '—'}</Typography>
        <Typography><strong>ASSET_BRAND:</strong> {asset.brand || '—'}</Typography>
        <Typography><strong>ASSET_MODEL:</strong> {asset.model || '—'}</Typography>
        <Typography><strong>ASSET_SERIAL_NO:</strong> {asset.serialNumber || '—'}</Typography>
        <Typography><strong>ASSET_IP:</strong> {asset.ip || '—'}</Typography>
        <Typography><strong>PROCESSOR:</strong> {asset.processor || '—'}</Typography>
        <Typography><strong>RAM:</strong> {asset.ram || '—'}</Typography>
        <Typography><strong>HARDDISK:</strong> {asset.harddisk || '—'}</Typography>
        <Typography><strong>SSD:</strong> {asset.ssd || '—'}</Typography>
        <Typography><strong>VENDOR:</strong> {asset.vendor || '—'}</Typography>
        <Typography><strong>PURCHASED_YEAR:</strong> {asset.purchasedYear || '—'}</Typography>
        <Typography><strong>BRANCH:</strong> {asset.branch || '—'}</Typography>
        <Typography><strong>CSC:</strong> {asset.csc || '—'}</Typography>
        <Typography><strong>FLOOR:</strong> {asset.floor || '—'}</Typography>
        <Typography><strong>REMARKS:</strong> {asset.remarks || '—'}</Typography>
        <Typography><strong>MAINTENANCE_WARRANTY:</strong> {asset.maintenanceWarranty || '—'}</Typography>
        <Typography><strong>MAINTENANCE_WARRANTY_STARTDATE:</strong> {asset.maintenanceWarrantyStartDate || '—'}</Typography>
        <Typography><strong>MAINTENANCE_WARRANTY_ENDDATE:</strong> {asset.maintenanceWarrantyEndDate || '—'}</Typography>
        <Typography><strong>STATUS:</strong> {asset.status || '—'}</Typography>
        <Typography><strong>DATE_OF_STATUS:</strong> {asset.dateOfStatus || '—'}</Typography>
      </Paper>
    </Box>
  );
}
