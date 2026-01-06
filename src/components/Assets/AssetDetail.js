import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, Grid, Divider, Chip } from '@mui/material';

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
        <Button 
          sx={{ 
            mt: 2,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            px: 2.5
          }} 
          variant="contained"
          onClick={() => navigate('/assets')}
        >
          Back to list
        </Button>
      </Box>
    );
  }

  const DetailRow = ({ label, value }) => (
    <Box sx={{ py: 1.5 }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        {value || '—'}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
              {asset.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Asset No: {asset.assetNo}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Chip 
              label={asset.status || 'Unknown'} 
              color={asset.status === 'Active' ? 'success' : asset.status === 'In Repair' ? 'warning' : 'default'}
              sx={{ fontWeight: 600 }}
            />
            <Button 
              component={RouterLink} 
              to="/assets"
              variant="outlined"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                px: 3
              }}
            >
              Back to List
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
              Basic Information
            </Typography>
            <DetailRow label="PC / Asset Name" value={asset.name} />
            <DetailRow label="Category" value={asset.category} />
            <DetailRow label="Brand" value={asset.brand} />
            <DetailRow label="Model" value={asset.model} />
            <DetailRow label="Serial Number" value={asset.serialNumber} />
            <DetailRow label="IP Address" value={asset.ip} />
            <DetailRow label="Added Date" value={asset.addedDate} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
              Employee Information
            </Typography>
            <DetailRow label="Employee No" value={asset.empNo} />
            <DetailRow label="Employee Name" value={asset.empName} />
            <DetailRow label="Designation" value={asset.designation} />
            <DetailRow label="Division" value={asset.division} />
            <DetailRow label="Section" value={asset.section} />
            <DetailRow label="Transfer Date" value={asset.transferDate} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
              Technical Specifications
            </Typography>
            <DetailRow label="Processor" value={asset.processor} />
            <DetailRow label="RAM" value={asset.ram} />
            <DetailRow label="Hard Disk" value={asset.harddisk} />
            <DetailRow label="SSD" value={asset.ssd} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
              Location Details
            </Typography>
            <DetailRow label="Branch" value={asset.branch} />
            <DetailRow label="CSC" value={asset.csc} />
            <DetailRow label="Floor" value={asset.floor} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
              Purchase & Warranty
            </Typography>
            <DetailRow label="Vendor" value={asset.vendor} />
            <DetailRow label="Purchased Year" value={asset.purchasedYear} />
            <DetailRow label="Maintenance Warranty" value={asset.maintenanceWarranty} />
            <DetailRow label="Warranty Start Date" value={asset.maintenanceWarrantyStartDate} />
            <DetailRow label="Warranty End Date" value={asset.maintenanceWarrantyEndDate} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
              Status & Remarks
            </Typography>
            <DetailRow label="Status" value={asset.status} />
            <DetailRow label="Date of Status" value={asset.dateOfStatus} />
            <DetailRow label="Remarks" value={asset.remarks} />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
