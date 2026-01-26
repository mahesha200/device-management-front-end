import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, Grid, Divider, Chip } from '@mui/material';
import notificationService from '../../utils/notificationService';
import Preloader from '../common/Preloader';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

export default function AssetDetail() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
          setAsset(data.data);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching asset:', err);
        setError(err.message);
        setAsset(null);
        // Show error notification
        await notificationService.notifyError(
          `Failed to load asset details: ${err.message}`
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAsset();
    }
  }, [id]);

  if (loading) {
    return (
      <Preloader message="Loading asset details..." />
    );
  }

  if (error || !asset) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">{error || 'Asset not found'}</Typography>
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

  // Convert status code to display text and color
  const getStatusDisplay = (statusCode) => {
    switch(statusCode) {
      case 'A':
        return { text: 'Active', color: 'success' };
      case 'I':
        return { text: 'Inactive', color: 'error' };
      case 'T':
        return { text: 'Transferred', color: 'warning' };
      case 'R':
        return { text: 'Retired', color: 'default' };
      default:
        return { text: statusCode || 'Unknown', color: 'default' };
    }
  };

  const statusDisplay = getStatusDisplay(asset.status);

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
              {asset.pcName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Serial No: {asset.assetSerialNo}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Chip 
              label={statusDisplay.text} 
              color={statusDisplay.color}
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
            <DetailRow label="Asset Number" value={asset.assetNo} />
            <DetailRow label="PC / Asset Name" value={asset.pcName} />
            <DetailRow label="Category" value={asset.assetCategory} />
            <DetailRow label="Brand" value={asset.assetBrand} />
            <DetailRow label="Model" value={asset.assetModel} />
            <DetailRow label="Serial Number" value={asset.assetSerialNo} />
            <DetailRow label="IP Address" value={asset.assetIp} />
            <DetailRow label="Added Date" value={asset.addedDate ? new Date(asset.addedDate).toLocaleDateString() : '—'} />
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
            <DetailRow label="Transfer Date" value={asset.transferDate ? new Date(asset.transferDate).toLocaleDateString() : '—'} />
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
            <DetailRow label="Warranty Start Date" value={asset.maintenanceWarrantyStartDate ? new Date(asset.maintenanceWarrantyStartDate).toLocaleDateString() : '—'} />
            <DetailRow label="Warranty End Date" value={asset.maintenanceWarrantyEndDate ? new Date(asset.maintenanceWarrantyEndDate).toLocaleDateString() : '—'} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
              Status & Remarks
            </Typography>
            <Box sx={{ py: 1.5 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 600 }}>
                Status
              </Typography>
              <Chip 
                label={statusDisplay.text} 
                color={statusDisplay.color}
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </Box>
            <DetailRow label="Date of Status" value={asset.dateOfStatus ? new Date(asset.dateOfStatus).toLocaleDateString() : '—'} />
            <DetailRow label="Remarks" value={asset.remarks} />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
