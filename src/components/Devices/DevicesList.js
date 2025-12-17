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
  Box,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function readDevices() {
  try {
    const raw = localStorage.getItem('dm_devices');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export default function DevicesList() {
  const [devices, setDevices] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    setDevices(readDevices());
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = Math.max(0, (1 + page) * rowsPerPage - devices.length);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" sx={{ m: 0 }}>Devices</Typography>
        <Button
          variant="contained"
          size="small"
          component={RouterLink}
          to="/devices/add"
          sx={{ py: '4px', px: '8px', minWidth: 0 }}
        >
          Add Device
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Device Name</TableCell>
              <TableCell>IP Address</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Device Category</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {devices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((d) => (
              <TableRow key={d.id} hover>
                <TableCell>{d.name}</TableCell>
                <TableCell>{d.ip}</TableCell>
                <TableCell>{d.department}</TableCell>
                <TableCell>{d.category}</TableCell>
                <TableCell align="right">
                  <Button size="small" component={RouterLink} to={`/devices/${d.id}`}>View</Button>
                </TableCell>
              </TableRow>
            ))}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={5} />
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={devices.length}
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
