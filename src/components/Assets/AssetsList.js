import React, { useEffect, useState, useCallback } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import { Link as RouterLink, useSearchParams, useNavigate } from 'react-router-dom';
import notificationService from '../../utils/notificationService';
import Preloader from '../common/Preloader';

/* -------------------- Helper -------------------- */
const displayValue = (value) => value || 'N/A';

/* -------------------- Component -------------------- */
export default function AssetsList() {
  const [assets, setAssets] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  /* Local dropdown filters */
  const [filters, setFilters] = useState({
    section: '',
    category: '',
    brand: '',
    floor: '',
  });

  /* Filter options from backend */
  const [filterOptions, setFilterOptions] = useState({
    sections: [],
    categories: [],
    brands: [],
    floors: []
  });

  /* Initialize filters from URL on mount */
  useEffect(() => {
    const section = searchParams.get('section') || '';
    const category = searchParams.get('category') || '';
    const brand = searchParams.get('brand') || '';
    const floor = searchParams.get('floor') || '';

    setFilters({
      section,
      category,
      brand,
      floor
    });
  }, []);

  /* Fetch filter options from backend */
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/assets/filters/options');
        const result = await response.json();
        
        if (result.success) {
          setFilterOptions({
            sections: result.data.sections || [],
            categories: result.data.categories || [],
            brands: result.data.brands || [],
            floors: result.data.floors || []
          });
        } else {
          await notificationService.notifyWarning('Failed to load filter options');
        }
      } catch (error) {
        console.error('Error fetching filter options:', error);
        await notificationService.notifyError('Failed to load filter options. Please refresh the page.');
      }
    };

    fetchFilterOptions();
  }, []);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage
      });

      // Add filters to query params
      if (filters.section) params.append('section', filters.section);
      if (filters.category) params.append('category', filters.category);
      if (filters.brand) params.append('brand', filters.brand);
      if (filters.floor) params.append('floor', filters.floor);

      const response = await fetch(
        `http://localhost:5000/api/assets?${params.toString()}`
      );
      const result = await response.json();
      
      if (result.success) {
        setAssets(result.data);
        setTotalCount(result.pagination.total);
      } else {
        console.error('Error fetching assets:', result.message);
        await notificationService.notifyError('Failed to load assets. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
      await notificationService.notifyError('Failed to load assets. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, filters]);

  /* Load data from API */
  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  /* Helper function to update URL params */
  const updateURLParams = (newFilters) => {
    const params = new URLSearchParams();
    if (newFilters.section) params.set('section', newFilters.section);
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.brand) params.set('brand', newFilters.brand);
    if (newFilters.floor) params.set('floor', newFilters.floor);
    
    setSearchParams(params);
  };

  /* -------------------- UI -------------------- */
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Assets
      </Typography>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Section</InputLabel>
          <Select
            value={filters.section}
            label="Section"
            onChange={e => {
              const newFilters = { ...filters, section: e.target.value };
              setFilters(newFilters);
              setPage(0);
              updateURLParams(newFilters);
            }}
          >
            {filterOptions.sections.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filters.category}
            label="Category"
            onChange={e => {
              const newFilters = { ...filters, category: e.target.value };
              setFilters(newFilters);
              setPage(0);
              updateURLParams(newFilters);
            }}
          >
            {filterOptions.categories.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Brand</InputLabel>
          <Select
            value={filters.brand}
            label="Brand"
            onChange={e => {
              const newFilters = { ...filters, brand: e.target.value };
              setFilters(newFilters);
              setPage(0);
              updateURLParams(newFilters);
            }}
          >
            {filterOptions.brands.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Floor</InputLabel>
          <Select
            value={filters.floor}
            label="Floor"
            onChange={e => {
              const newFilters = { ...filters, floor: e.target.value };
              setFilters(newFilters);
              setPage(0);
              updateURLParams(newFilters);
            }}
          >
            {filterOptions.floors.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
          </Select>
        </FormControl>

        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            const emptyFilters = { section: '', category: '', brand: '', floor: '' };
            setFilters(emptyFilters);
            setPage(0);
            updateURLParams(emptyFilters);
          }}
          sx={{ minWidth: 120 }}
        >
          Reset Filters
        </Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee Number</TableCell>
              <TableCell>Asset Brand</TableCell>
              <TableCell>Asset Category</TableCell>
              <TableCell>Division</TableCell>
              <TableCell>Section</TableCell>
              <TableCell>Asset Serial Number</TableCell>
              <TableCell sx={{ pl: 8 }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ border: 0 }}>
                  <Preloader message="Loading assets..." />
                </TableCell>
              </TableRow>
            ) : assets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No assets found</TableCell>
              </TableRow>
            ) : (
              assets.map((a, index) => (
                <TableRow key={a.assetSerialNo || `asset-${index}`} hover>
                  <TableCell>{displayValue(a.empNo)}</TableCell>
                  <TableCell>{displayValue(a.assetBrand)}</TableCell>
                  <TableCell>{displayValue(a.assetCategory)}</TableCell>
                  <TableCell>{displayValue(a.division)}</TableCell>
                  <TableCell>{displayValue(a.section)}</TableCell>
                  <TableCell>{displayValue(a.assetSerialNo)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        component={RouterLink}
                        to={`/assets/${encodeURIComponent(a.assetSerialNo)}`}
                      >
                        Review
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        component={RouterLink}
                        to={`/assets/${encodeURIComponent(a.assetSerialNo)}/edit`}
                      >
                        Modify
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={(e, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={e => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
            fetchAssets();
          }}
        />
      </TableContainer>
    </Box>
  );
}
