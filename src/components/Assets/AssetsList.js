import React, { useEffect, useState, useMemo } from 'react';
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

/* -------------------- Local Storage Helpers -------------------- */
function readAssets() {
  try {
    return JSON.parse(localStorage.getItem('dm_assets') || '[]');
  } catch {
    return [];
  }
}

function writeAssets(list) {
  localStorage.setItem('dm_assets', JSON.stringify(list));
}

/* -------------------- Sample Data -------------------- */
const SAMPLE_ASSETS = [
  {
    id: '1',
    assetNo: 'A-001',
    serialNumber: 'SN-001',
    name: 'Printer-01',
    ip: '192.168.1.10',
    category: 'Printer',
    brand: 'HP',
    model: 'LaserJet 400',
    location: 'Head Office',
    floor: '1st Floor',
    empName: 'John Doe',
    division: 'IT',
    department: 'IT',
    status: 'Active',
  },
  {
    id: '2',
    assetNo: 'A-002',
    serialNumber: 'SN-002',
    name: 'Router-Edge',
    ip: '10.0.0.1',
    category: 'Router',
    brand: 'Cisco',
    model: 'ISR4321',
    location: 'Head Office',
    floor: '2nd Floor',
    empName: 'Network Team',
    division: 'Infrastructure',
    department: 'IT',
    status: 'Active',
  },
  {
    id: '3',
    assetNo: 'A-003',
    serialNumber: 'SN-003',
    name: 'Workstation-101',
    ip: '192.168.1.101',
    category: 'PC',
    brand: 'Dell',
    model: 'OptiPlex 7080',
    location: 'Head Office',
    floor: '3rd Floor',
    empName: 'Alice Smith',
    division: 'Engineering',
    department: 'Engineering',
    status: 'In Repair',
  },
  {
    id: '4',
    assetNo: 'A-004',
    serialNumber: 'SN-004',
    name: 'Workstation-102',
    ip: '192.168.1.102',
    category: 'PC',
    brand: 'Lenovo',
    model: 'ThinkCentre M80',
    location: 'Head Office',
    floor: '4th Floor',
    empName: 'Bob Brown',
    division: 'Finance',
    department: 'Finance',
    status: 'Active',
  },
  {
    id: '5',
    assetNo: 'A-005',
    serialNumber: 'SN-005',
    name: 'Monitor-01',
    ip: '192.168.1.110',
    category: 'Monitor',
    brand: 'LG',
    model: '27UP550',
    location: 'Head Office',
    floor: '1st Floor',
    empName: 'Carol White',
    division: 'IT',
    department: 'IT',
    status: 'Active',
  },
  {
    id: '6',
    assetNo: 'A-006',
    serialNumber: 'SN-006',
    name: 'Server-01',
    ip: '10.0.0.50',
    category: 'Server',
    brand: 'HP',
    model: 'ProLiant DL380',
    location: 'Data Center',
    floor: '2nd Floor',
    empName: 'Tech Team',
    division: 'Infrastructure',
    department: 'IT',
    status: 'Active',
  },
  {
    id: '7',
    assetNo: 'A-007',
    serialNumber: 'SN-007',
    name: 'Switch-01',
    ip: '10.0.0.10',
    category: 'Switch',
    brand: 'Cisco',
    model: 'Catalyst 2960',
    location: 'Data Center',
    floor: '2nd Floor',
    empName: 'Network Team',
    division: 'Infrastructure',
    department: 'IT',
    status: 'Active',
  },
  {
    id: '8',
    assetNo: 'A-008',
    serialNumber: 'SN-008',
    name: 'Workstation-103',
    ip: '192.168.1.103',
    category: 'PC',
    brand: 'ASUS',
    model: 'ExpertBook',
    location: 'Head Office',
    floor: '3rd Floor',
    empName: 'David Green',
    division: 'Engineering',
    department: 'Engineering',
    status: 'Active',
  },
  {
    id: '9',
    assetNo: 'A-009',
    serialNumber: 'SN-009',
    name: 'Laptop-01',
    ip: '192.168.1.150',
    category: 'Laptop',
    brand: 'Apple',
    model: 'MacBook Pro',
    location: 'Head Office',
    floor: '4th Floor',
    empName: 'Eve Brown',
    division: 'Finance',
    department: 'Finance',
    status: 'Active',
  },
  {
    id: '10',
    assetNo: 'A-010',
    serialNumber: 'SN-010',
    name: 'Printer-02',
    ip: '192.168.1.20',
    category: 'Printer',
    brand: 'Canon',
    model: 'imagePRESS',
    location: 'Head Office',
    floor: '2nd Floor',
    empName: 'John Doe',
    division: 'HR',
    department: 'Finance',
    status: 'Active',
  },
  {
    id: '11',
    assetNo: 'A-011',
    serialNumber: 'SN-011',
    name: 'Storage-01',
    ip: '10.0.0.100',
    category: 'Storage',
    brand: 'Netapp',
    model: 'FAS2720',
    location: 'Data Center',
    floor: '2nd Floor',
    empName: 'Tech Team',
    division: 'Infrastructure',
    department: 'IT',
    status: 'Active',
  },
  {
    id: '12',
    assetNo: 'A-012',
    serialNumber: 'SN-012',
    name: 'Laptop-02',
    ip: '192.168.1.151',
    category: 'Laptop',
    brand: 'Dell',
    model: 'Latitude 5440',
    location: 'Head Office',
    floor: '3rd Floor',
    empName: 'Frank Miller',
    division: 'Engineering',
    department: 'Engineering',
    status: 'Active',
  },
  {
    id: '13',
    assetNo: 'A-013',
    serialNumber: 'SN-013',
    name: 'PC-ACC-01',
    ip: '192.168.1.200',
    category: 'PC',
    brand: 'HP',
    model: 'EliteDesk 800',
    location: 'Head Office',
    floor: '1st Floor',
    empName: 'Accountant-1',
    division: 'ACC',
    department: 'Finance',
    status: 'Active',
  },
  {
    id: '14',
    assetNo: 'A-014',
    serialNumber: 'SN-014',
    name: 'PC-ACT-01',
    ip: '192.168.1.201',
    category: 'PC',
    brand: 'Dell',
    model: 'OptiPlex 3080',
    location: 'Head Office',
    floor: '1st Floor',
    empName: 'Accounts-1',
    division: 'ACT',
    department: 'Finance',
    status: 'Active',
  },
  {
    id: '15',
    assetNo: 'A-015',
    serialNumber: 'SN-015',
    name: 'PC-ADM-01',
    ip: '192.168.1.202',
    category: 'PC',
    brand: 'Lenovo',
    model: 'ThinkCentre M90',
    location: 'Head Office',
    floor: '2nd Floor',
    empName: 'Admin-1',
    division: 'ADM',
    department: 'Finance',
    status: 'Active',
  },
  {
    id: '16',
    assetNo: 'A-016',
    serialNumber: 'SN-016',
    name: 'PC-AUD-01',
    ip: '192.168.1.203',
    category: 'PC',
    brand: 'ASUS',
    model: 'VivoPC',
    location: 'Head Office',
    floor: '1st Floor',
    empName: 'Auditor-1',
    division: 'AUD',
    department: 'Finance',
    status: 'Active',
  },
  {
    id: '17',
    assetNo: 'A-017',
    serialNumber: 'SN-017',
    name: 'PC-AUT-01',
    ip: '192.168.1.204',
    category: 'PC',
    brand: 'HP',
    model: 'ProDesk 400',
    location: 'Head Office',
    floor: '3rd Floor',
    empName: 'Auto-1',
    division: 'AUT',
    department: 'Finance',
    status: 'Active',
  },
  {
    id: '18',
    assetNo: 'A-018',
    serialNumber: 'SN-018',
    name: 'PC-BO-01',
    ip: '192.168.1.205',
    category: 'PC',
    brand: 'Dell',
    model: 'Precision 3430',
    location: 'Head Office',
    floor: '2nd Floor',
    empName: 'BO-1',
    division: 'BO',
    department: 'Finance',
    status: 'Active',
  },
  {
    id: '19',
    assetNo: 'A-019',
    serialNumber: 'SN-019',
    name: 'PC-COR-01',
    ip: '192.168.1.206',
    category: 'PC',
    brand: 'Lenovo',
    model: 'ThinkCentre M70e',
    location: 'Head Office',
    floor: '4th Floor',
    empName: 'Corporate-1',
    division: 'COR',
    department: 'Finance',
    status: 'Active',
  },
  {
    id: '20',
    assetNo: 'A-020',
    serialNumber: 'SN-020',
    name: 'PC-CS-01',
    ip: '192.168.1.207',
    category: 'PC',
    brand: 'ASUS',
    model: 'ProArt',
    location: 'Head Office',
    floor: '3rd Floor',
    empName: 'CS-1',
    division: 'CS',
    department: 'Engineering',
    status: 'Active',
  },
  {
    id: '21',
    assetNo: 'A-021',
    serialNumber: 'SN-021',
    name: 'PC-CSC-01',
    ip: '192.168.1.208',
    category: 'PC',
    brand: 'HP',
    model: 'ZBook 15',
    location: 'Head Office',
    floor: '3rd Floor',
    empName: 'CSC-1',
    division: 'CSC',
    department: 'Engineering',
    status: 'Active',
  },
  {
    id: '22',
    assetNo: 'A-022',
    serialNumber: 'SN-022',
    name: 'PC-CSD-01',
    ip: '192.168.1.209',
    category: 'PC',
    brand: 'Dell',
    model: 'Latitude 5540',
    location: 'Head Office',
    floor: '3rd Floor',
    empName: 'CSD-1',
    division: 'CSD',
    department: 'Engineering',
    status: 'Active',
  },
  {
    id: '23',
    assetNo: 'A-023',
    serialNumber: 'SN-023',
    name: 'PC-CSM-01',
    ip: '192.168.1.210',
    category: 'PC',
    brand: 'Lenovo',
    model: 'ThinkBook 15',
    location: 'Head Office',
    floor: '3rd Floor',
    empName: 'CSM-1',
    division: 'CSM',
    department: 'Engineering',
    status: 'Active',
  },
  {
    id: '24',
    assetNo: 'A-024',
    serialNumber: 'SN-024',
    name: 'PC-CVL-01',
    ip: '192.168.1.211',
    category: 'PC',
    brand: 'ASUS',
    model: 'Vivobook 15',
    location: 'Head Office',
    floor: '3rd Floor',
    empName: 'Civil-1',
    division: 'CVL',
    department: 'Engineering',
    status: 'Active',
  },
  {
    id: '25',
    assetNo: 'A-025',
    serialNumber: 'SN-025',
    name: 'PC-DCS-01',
    ip: '192.168.1.212',
    category: 'PC',
    brand: 'HP',
    model: 'ProBook 450',
    location: 'Head Office',
    floor: '4th Floor',
    empName: 'DCS-1',
    division: 'DCS',
    department: 'Engineering',
    status: 'Active',
  },
  {
    id: '26',
    assetNo: 'A-026',
    serialNumber: 'SN-026',
    name: 'PC-ENG-01',
    ip: '192.168.1.213',
    category: 'PC',
    brand: 'Dell',
    model: 'XPS 13',
    location: 'Head Office',
    floor: '3rd Floor',
    empName: 'Engineer-1',
    division: 'ENG',
    department: 'Engineering',
    status: 'Active',
  },
  {
    id: '27',
    assetNo: 'A-027',
    serialNumber: 'SN-027',
    name: 'PC-FIN-01',
    ip: '192.168.1.214',
    category: 'PC',
    brand: 'Lenovo',
    model: 'IdeaPad 5',
    location: 'Head Office',
    floor: '1st Floor',
    empName: 'Finance-1',
    division: 'FIN',
    department: 'Finance',
    status: 'Active',
  },
  {
    id: '28',
    assetNo: 'A-028',
    serialNumber: 'SN-028',
    name: 'PC-IT-01',
    ip: '192.168.1.215',
    category: 'PC',
    brand: 'ASUS',
    model: 'ROG Strix',
    location: 'Head Office',
    floor: '2nd Floor',
    empName: 'IT-1',
    division: 'IT',
    department: 'IT',
    status: 'Active',
  },
  {
    id: '29',
    assetNo: 'A-029',
    serialNumber: 'SN-029',
    name: 'PC-OPE-01',
    ip: '192.168.1.216',
    category: 'PC',
    brand: 'HP',
    model: 'Stream 11',
    location: 'Head Office',
    floor: '2nd Floor',
    empName: 'Operations-1',
    division: 'OPE',
    department: 'Finance',
    status: 'Active',
  },
  {
    id: '30',
    assetNo: 'A-030',
    serialNumber: 'SN-030',
    name: 'PC-PRJ-01',
    ip: '192.168.1.217',
    category: 'PC',
    brand: 'Dell',
    model: 'Inspiron 15',
    location: 'Head Office',
    floor: '4th Floor',
    empName: 'Project-1',
    division: 'PRJ',
    department: 'Engineering',
    status: 'Active',
  },
  {
    id: '31',
    assetNo: 'A-031',
    serialNumber: 'SN-031',
    name: 'PC-STR-01',
    ip: '192.168.1.218',
    category: 'PC',
    brand: 'Lenovo',
    model: 'Yoga 7i',
    location: 'Head Office',
    floor: '1st Floor',
    empName: 'Stores-1',
    division: 'STR',
    department: 'Finance',
    status: 'Active',
  },
];

/* -------------------- Component -------------------- */
export default function AssetsList() {
  const [assets, setAssets] = useState([]);
  const [editingCells, setEditingCells] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  /* Load data */
  useEffect(() => {
    // Clear old data and load fresh sample data
    writeAssets(SAMPLE_ASSETS);
    setAssets(SAMPLE_ASSETS);
  }, []);

  /* -------------------- Derived Dropdown Values -------------------- */
  const divisions = useMemo(
    () => {
      const excludedDivisions = ['IT', 'Infrastructure', 'Engineering', 'Finance', 'HR'];
      return [...new Set(assets.map(a => a.division).filter(d => d && !excludedDivisions.includes(d)))];
    },
    [assets]
  );

  const categories = useMemo(
    () => [...new Set(assets.map(a => a.category).filter(Boolean))],
    [assets]
  );

  const brands = useMemo(
    () => [...new Set(assets.map(a => a.brand).filter(Boolean))],
    [assets]
  );

  const FLOORS = ['1st Floor', '2nd Floor', '3rd Floor', '4th Floor'];

  const departments = useMemo(
    () => [...new Set(assets.map(a => a.department).filter(Boolean))],
    [assets]
  );

  /* -------------------- Filtering -------------------- */
  const filtered = useMemo(() => {
    return assets.filter(a =>
      (!departmentFromUrl || a.department === departmentFromUrl) &&
      (!filters.division || a.division === filters.division) &&
      (!filters.category || a.category === filters.category) &&
      (!filters.brand || a.brand === filters.brand) &&
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
      a.id === id ? { ...a, [field]: value } : a
    );

    setAssets(updated);
    writeAssets(updated);

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
      <Box sx={{ display: 'flex', gap: 6, flexWrap: 'wrap', mb: 2, justifyContent: 'flex-start', ml: 12 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Division</InputLabel>
          <Select
            value={filters.division}
            label="Division"
            onChange={e => setFilters(f => ({ ...f, division: e.target.value }))}
          >
            {divisions.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filters.category}
            label="Category"
            onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
          >
            {categories.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Brand</InputLabel>
          <Select
            value={filters.brand}
            label="Brand"
            onChange={e => setFilters(f => ({ ...f, brand: e.target.value }))}
          >
            {brands.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
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
        >
          Reset Filters
        </Button>

        <Button
          size="small"
          variant="contained"
          component={RouterLink}
          to="/assets/add"
        >
          Add Asset
        </Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
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
            {filtered
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(a => (
                <TableRow key={a.id} hover>
                  <TableCell>{a.assetNo}</TableCell>
                  <TableCell>{a.name}</TableCell>
                  <TableCell>{a.category}</TableCell>
                  <TableCell>{a.brand}</TableCell>

                  <TableCell
                    onClick={() => startEditCell(a.id, 'serialNumber', a.serialNumber)}
                  >
                    {editingCells[a.id]?.serialNumber !== undefined ? (
                      <TextField
                        size="small"
                        autoFocus
                        value={editingCells[a.id].serialNumber}
                        onChange={e =>
                          setEditingCells(p => ({
                            ...p,
                            [a.id]: { serialNumber: e.target.value },
                          }))
                        }
                        onBlur={() => saveCell(a.id, 'serialNumber')}
                      />
                    ) : a.serialNumber}
                  </TableCell>

                  <TableCell>{a.ip}</TableCell>
                  <TableCell>{a.status}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        component={RouterLink}
                        to={`/assets/${a.id}`}
                      >
                        Review
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        component={RouterLink}
                        to={`/assets/${a.id}/edit`}
                      >
                        Modify
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(e, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={e => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>
    </Box>
  );
}
