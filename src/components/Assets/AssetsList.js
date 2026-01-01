import React, { useEffect, useState } from 'react';
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
import { Link as RouterLink } from 'react-router-dom';

function readAssets() {
  try {
    const raw = localStorage.getItem('dm_assets');
    const data = raw ? JSON.parse(raw) : [];
    if (Array.isArray(data) && data.length > 0) {
      const sanitized = data.map(({ department, serialNumber, ...rest }) => ({ serialNumber: serialNumber || '', ...rest, location: rest.location || '' }));
      if (JSON.stringify(sanitized) !== JSON.stringify(data)) {
        try { localStorage.setItem('dm_assets', JSON.stringify(sanitized)); } catch (e) {}
      }
      return sanitized;
    }
    return data;
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

const LOCATIONS = ['Head Office', 'Ekala', 'Nugegoda', 'Galle', 'Kotte', 'Moratuwa'];

const SAMPLE_ASSETS = [
  { id: '1', assetNo: 'A-001', serialNumber: 'SN-001', name: 'Printer-01', ip: '192.168.1.10', category: 'Printer', brand: 'HP', model: 'LaserJet 400', location: 'Head Office', empName: 'John Doe', division: 'IT', status: 'Active', dateOfStatus: '2024-01-10', addedDate: '2024-01-01', remarks: 'Office printer on 1st floor' },
  { id: '2', assetNo: 'A-002', serialNumber: 'SN-002', name: 'Router-Edge', ip: '10.0.0.1', category: 'Router', brand: 'Cisco', model: 'ISR4321', location: 'Ekala', empName: 'Network Team', division: 'IT', status: 'Active', dateOfStatus: '2024-02-15', addedDate: '2024-02-01', remarks: 'Edge router' },
  { id: '3', assetNo: 'A-003', serialNumber: 'SN-003', name: 'Workstation-101', ip: '192.168.1.101', category: 'PC', brand: 'Dell', model: 'OptiPlex 7080', location: 'Nugegoda', empName: 'Alice Smith', division: 'Engineering', status: 'In Repair', dateOfStatus: '2024-03-05', addedDate: '2023-12-15', remarks: 'Engineering workstation' },
  { id: '4', assetNo: 'A-004', serialNumber: 'SN-004', name: 'Camera-Lobby', ip: '192.168.2.20', category: 'Camera', brand: 'Axis', model: 'M2026-LE', location: 'Galle', empName: 'Security', division: 'Operations', status: 'Active', dateOfStatus: '2024-01-20', addedDate: '2024-01-05', remarks: 'Lobby surveillance camera' },
];

export default function AssetsList() {
  const [assets, setAssets] = useState([]);
  const [editingCells, setEditingCells] = useState({});
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [groupFilter, setGroupFilter] = useState('All');

  useEffect(() => {
    const ds = readAssets();
    if (!ds || ds.length === 0) {
      writeAssets(SAMPLE_ASSETS);
      setAssets(SAMPLE_ASSETS);
    } else {
      setAssets(ds);
    }
  }, []);

  

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const GROUPS = {
    'IT Equipment': ['PC', 'Printer'],
    'Server Equipment': ['Server'],
    'Network Equipment': ['Router', 'Switch', 'Firewall', 'Access Point', 'Camera'],
  };

  let filtered = assets;
  if (groupFilter && groupFilter !== 'All') {
    if (groupFilter === 'Other') {
      const known = Object.values(GROUPS).flat();
      filtered = assets.filter((a) => !known.includes(a.category));
    } else {
      const allowed = GROUPS[groupFilter] || [];
      filtered = assets.filter((a) => allowed.includes(a.category));
    }
  }
  const emptyRows = Math.max(0, (1 + page) * rowsPerPage - filtered.length);

  const startEditCell = (id, field, value) => {
    setEditingCells((s) => ({ ...s, [id]: { ...(s[id] || {}), [field]: value ?? '' } }));
  };

  const changeEditingCell = (id, field, value) => {
    setEditingCells((s) => ({ ...s, [id]: { ...(s[id] || {}), [field]: value } }));
  };

  const saveCell = (id, field) => {
    const val = editingCells[id] && editingCells[id][field];
    if (val === undefined) return;
    const next = assets.map((a) => (String(a.id) === String(id) ? { ...a, [field]: val } : a));
    setAssets(next);
    writeAssets(next);
    setEditingCells((s) => {
      const copy = { ...s };
      if (copy[id]) {
        delete copy[id][field];
        if (Object.keys(copy[id]).length === 0) delete copy[id];
      }
      return copy;
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, gap: 2 }}>
        <Typography variant="h6" sx={{ m: 0 }}>Assets</Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="group-filter-label">Refine</InputLabel>
            <Select
              labelId="group-filter-label"
              label="Refine"
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="IT Equipment">IT Equipment</MenuItem>
              <MenuItem value="Server Equipment">Server Equipment</MenuItem>
              <MenuItem value="Network Equipment">Network Equipment</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            size="small"
            component={RouterLink}
            to="/assets/add"
            sx={{ py: '4px', px: '8px', minWidth: 0 }}
          >
            Add Asset
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ASSET_NO</TableCell>
              <TableCell>PC_NAME</TableCell>
              <TableCell>ASSET_CATEGORY</TableCell>
              <TableCell>ASSET_BRAND</TableCell>
              <TableCell>ASSET_MODEL</TableCell>
              <TableCell>ASSET_SERIAL_NO</TableCell>
              <TableCell>ASSET_IP</TableCell>
              <TableCell>EMP_NAME</TableCell>
              <TableCell>STATUS</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((d) => (
              <TableRow key={d.id} hover>
                <TableCell>{d.assetNo || '—'}</TableCell>
                <TableCell>{d.name || '—'}</TableCell>
                <TableCell>{d.category || '—'}</TableCell>
                <TableCell>{d.brand || '—'}</TableCell>
                <TableCell>{d.model || '—'}</TableCell>
                <TableCell>
                  {editingCells[d.id] && editingCells[d.id].serialNumber !== undefined ? (
                    <TextField
                      size="small"
                      value={editingCells[d.id].serialNumber}
                      onChange={(e) => changeEditingCell(d.id, 'serialNumber', e.target.value)}
                      onBlur={() => saveCell(d.id, 'serialNumber')}
                      onKeyDown={(e) => { if (e.key === 'Enter') { saveCell(d.id, 'serialNumber'); e.target.blur(); } }}
                    />
                  ) : (
                    <Box onClick={() => startEditCell(d.id, 'serialNumber', d.serialNumber)} sx={{ cursor: 'text' }}>{d.serialNumber || '—'}</Box>
                  )}
                </TableCell>

                <TableCell>{editingCells[d.id] && editingCells[d.id].ip !== undefined ? (
                  <TextField
                    size="small"
                    value={editingCells[d.id].ip}
                    onChange={(e) => changeEditingCell(d.id, 'ip', e.target.value)}
                    onBlur={() => saveCell(d.id, 'ip')}
                    onKeyDown={(e) => { if (e.key === 'Enter') { saveCell(d.id, 'ip'); e.target.blur(); } }}
                  />
                ) : (
                  <Box onClick={() => startEditCell(d.id, 'ip', d.ip)} sx={{ cursor: 'text' }}>{d.ip || '—'}</Box>
                )}</TableCell>

                <TableCell>{d.empName || '—'}</TableCell>
                <TableCell>{d.status || '—'}</TableCell>
                <TableCell align="right">
                  <Button size="small" component={RouterLink} to={`/assets/${d.id}`}>Review</Button>
                  <Button size="small" component={RouterLink} to={`/assets/${d.id}/edit`} sx={{ ml: 1 }}>Modify</Button>
                </TableCell>
              </TableRow>
            ))}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={10} />
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>
    </Box>
  );
}
