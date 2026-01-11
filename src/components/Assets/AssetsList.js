import React, { useEffect, useState, useMemo, useCallback } from 'react';
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
import { Link as RouterLink, useSearchParams } from 'react-router-dom';

/* -------------------- Helper -------------------- */
const displayValue = (value) => value || 'N/A';

/* -------------------- Component -------------------- */
export default function AssetsList() {
  const [assets, setAssets] = useState([]);
  const [editingCells, setEditingCells] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  /* URL department filter (ONLY from URL) */
  const [searchParams] = useSearchParams();
  const departmentFromUrl = searchParams.get('department') || '';

  /* Local dropdown filters */
  const [filters, setFilters] = useState({
    division: '',
    category: '',
    brand: '',
    floor: '',
  });

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/assets?page=${page + 1}&limit=${rowsPerPage}`
      );
      const result = await response.json();
      
      if (result.success) {
        setAssets(result.data);
        setTotalCount(result.pagination.total);
      } else {
        console.error('Error fetching assets:', result.message);
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  /* Load data from API */
  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  /* -------------------- Derived Dropdown Values -------------------- */
  const divisions = useMemo(
    () => {
      const predefinedDivisions = ['ADM', 'CSC', 'KL', 'FIN', 'ACT', 'ENG', 'IT'];
      const assetDivisions = [...new Set(assets.map(a => a.division).filter(Boolean))];
      // Combine predefined and asset divisions, remove duplicates
      return [...new Set([...predefinedDivisions, ...assetDivisions])];
    },
    [assets]
  );

  const categories = useMemo(
    () => {
      const predefinedCategories = ['CMP', 'MON', 'SCN', 'PRT'];
      const assetCategories = [...new Set(assets.map(a => a.assetCategory).filter(Boolean))];
      // Combine predefined and asset categories, remove duplicates
      return [...new Set([...predefinedCategories, ...assetCategories])];
    },
    [assets]
  );

  const brands = useMemo(
    () => {
      const predefinedBrands = ['EWIS', 'EPSON', 'HP', 'BROTHER', 'CANON'];
      const assetBrands = [...new Set(assets.map(a => a.assetBrand).filter(Boolean))];
      // Combine predefined and asset brands, remove duplicates
      return [...new Set([...predefinedBrands, ...assetBrands])];
    },
    [assets]
  );

  const FLOORS = ['1st Floor', '2nd Floor', '3rd Floor', '4th Floor'];

  /* -------------------- Filtering -------------------- */
  const filtered = useMemo(() => {
    return assets.filter(a =>
      (!departmentFromUrl || a.department === departmentFromUrl) &&
      (!filters.division || a.division === filters.division) &&
      (!filters.category || a.assetCategory === filters.category) &&
      (!filters.brand || a.assetBrand === filters.brand) &&
      (!filters.floor || a.floor === filters.floor)
    );
  }, [assets, filters, departmentFromUrl]);

  /* -------------------- Inline Editing -------------------- */
  const startEditCell = (id, field, value) => {
    setEditingCells(prev => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: value },
    }));
  };

  const saveCell = (id, field) => {
    const value = editingCells[id]?.[field];
    if (value === undefined) return;

    const updated = assets.map(a =>
      a.assetNo === id ? { ...a, [field]: value } : a
    );

    setAssets(updated);
    // TODO: Call API to update asset in database

    setEditingCells(prev => {
      const copy = { ...prev };
      delete copy[id][field];
      if (!Object.keys(copy[id]).length) delete copy[id];
      return copy;
    });
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
          <InputLabel>Division</InputLabel>
          <Select
            value={filters.division}
            label="Division"
            onChange={e => setFilters(f => ({ ...f, division: e.target.value }))}
          >
            {divisions.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filters.category}
            label="Category"
            onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
          >
            {categories.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Brand</InputLabel>
          <Select
            value={filters.brand}
            label="Brand"
            onChange={e => setFilters(f => ({ ...f, brand: e.target.value }))}
          >
            {brands.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Floor</InputLabel>
          <Select
            value={filters.floor}
            label="Floor"
            onChange={e => setFilters(f => ({ ...f, floor: e.target.value }))}
          >
            {FLOORS.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
          </Select>
        </FormControl>

        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            setFilters({ division: '', category: '', brand: '', floor: '' });
            setPage(0);
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
              <TableCell>Asset No</TableCell>
              <TableCell sx={{ pl: 4 }}>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Serial</TableCell>
              <TableCell sx={{ pl: 4 }}>IP Address</TableCell>
              <TableCell>Status</TableCell>
              <TableCell sx={{ pl: 8 }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">Loading...</TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">No assets found</TableCell>
              </TableRow>
            ) : (
              filtered.map((a, index) => (
                <TableRow key={a.assetNo || `asset-${index}`} hover>
                  <TableCell>{displayValue(a.assetNo)}</TableCell>
                  <TableCell>{displayValue(a.pcName)}</TableCell>
                  <TableCell>{displayValue(a.assetCategory)}</TableCell>
                  <TableCell>{displayValue(a.assetBrand)}</TableCell>

                  <TableCell
                    onClick={() => startEditCell(a.assetNo, 'assetSerialNo', a.assetSerialNo)}
                  >
                    {editingCells[a.assetNo]?.assetSerialNo !== undefined ? (
                      <TextField
                        size="small"
                        autoFocus
                        value={editingCells[a.assetNo].assetSerialNo}
                        onChange={e =>
                          setEditingCells(p => ({
                            ...p,
                            [a.assetNo]: { assetSerialNo: e.target.value },
                          }))
                        }
                        onBlur={() => saveCell(a.assetNo, 'assetSerialNo')}
                      />
                    ) : displayValue(a.assetSerialNo)}
                  </TableCell>

                  <TableCell>{displayValue(a.assetIp)}</TableCell>
                  <TableCell>{displayValue(a.status)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        component={RouterLink}
                        to={`/assets/${a.assetNo}`}
                      >
                        Review
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        component={RouterLink}
                        to={`/assets/${a.assetNo}/edit`}
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
