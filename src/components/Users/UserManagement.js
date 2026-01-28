import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Typography,
  Box,
  Alert,
  Chip
} from '@mui/material';
import { Add, Edit, Refresh, Delete } from '@mui/icons-material';
import apiService from '../../utils/apiService';
import { useAuth } from '../../contexts/AuthContext';
import notificationService from '../../utils/notificationService';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    branch: ''
  });
  const [errors, setErrors] = useState({});
  const { user: loggedInUser } = useAuth();

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAllUsers();
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      notificationService.notifyError('Failed to fetch users');
      // Fallback to showing just the logged-in user
      if (loggedInUser) {
        setUsers([loggedInUser]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setEditMode(true);
      setCurrentUser(user);
      setFormData({
        username: user.userName,
        password: '',
        email: user.email || '',
        branch: user.branch || ''
      });
    } else {
      setEditMode(false);
      setCurrentUser(null);
      setFormData({
        username: '',
        password: '',
        email: '',
        branch: ''
      });
    }
    setErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      username: '',
      password: '',
      email: '',
      branch: ''
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    // Username validation (max 5 characters)
    if (!editMode && !formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length > 5) {
      newErrors.username = 'Username must not exceed 5 characters';
    } else if (!editMode && !/^[a-zA-Z0-9]+$/.test(formData.username)) {
      newErrors.username = 'Username must contain only letters and numbers';
    }

    // Password validation (max 20 characters)
    if (!editMode && !formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password && formData.password.length > 20) {
      newErrors.password = 'Password must not exceed 20 characters';
    } else if (!editMode && formData.password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
    }

    // Email validation (max 30 characters)
    if (formData.email && formData.email.length > 30) {
      newErrors.email = 'Email must not exceed 30 characters';
    } else if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Branch validation (max 2 characters, uppercase recommended)
    if (formData.branch && formData.branch.length > 2) {
      newErrors.branch = 'Branch must not exceed 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let response;
      if (editMode) {
        // Update user
        const updateData = {
          email: formData.email,
          branch: formData.branch
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        response = await apiService.updateUser(currentUser.userName, updateData);
        
        notificationService.notifySuccess('User updated successfully');
        
        // Update local state
        if (currentUser.userName === loggedInUser.userName) {
          // Update logged-in user data in localStorage
          const updatedUserData = await apiService.getUserData(currentUser.userName);
          localStorage.setItem('user', JSON.stringify(updatedUserData.data));
        }
        
        // Refresh the users list
        await fetchAllUsers();
      } else {
        // Create new user
        response = await apiService.createUser({
          username: formData.username,
          password: formData.password,
          email: formData.email,
          branch: formData.branch
        });
        
        notificationService.notifySuccess('User created successfully');
        
        // Refresh the users list
        await fetchAllUsers();
      }

      handleCloseDialog();
    } catch (error) {
      notificationService.notifyError(error.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await fetchAllUsers();
    notificationService.notifySuccess('Users list refreshed');
  };

  const handleOpenDeleteDialog = (user) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setUserToDelete(null);
    setOpenDeleteDialog(false);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setLoading(true);
    try {
      await apiService.deleteUser(userToDelete.userName);
      
      // Remove user from local state
      setUsers(users.filter(u => u.userName !== userToDelete.userName));
      
      notificationService.notifySuccess('User deleted successfully');
      handleCloseDeleteDialog();
    } catch (error) {
      notificationService.notifyError(error.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          User Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{ backgroundColor: '#4d1d4f' }}
          >
            Add User
          </Button>
        </Box>
      </Box>

      {loading && users.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          Loading users...
        </Alert>
      ) : null}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 600 }}>Username</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Branch</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Created Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography color="textSecondary">No users found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.userName} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {user.userName}
                      {user.userName === loggedInUser?.userName && (
                        <Chip label="You" size="small" color="primary" />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{user.email || '-'}</TableCell>
                  <TableCell>{user.branch || '-'}</TableCell>
                  <TableCell>
                    {user.createdDate ? new Date(user.createdDate).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(user)}
                      size="small"
                      title="Edit user"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleOpenDeleteDialog(user)}
                      size="small"
                      disabled={user.userName === loggedInUser?.userName}
                      title={user.userName === loggedInUser?.userName ? 'Cannot delete yourself' : 'Delete user'}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editMode ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              error={!!errors.username}
              helperText={errors.username || `${formData.username.length}/5 characters - Letters and numbers only`}
              fullWidth
              disabled={editMode}
              inputProps={{ maxLength: 5 }}
              required={!editMode}
            />
            
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={
                errors.password || 
                (editMode 
                  ? `${formData.password.length}/20 characters - Leave blank to keep current password` 
                  : `${formData.password.length}/20 characters - Minimum 4 characters`)
              }
              fullWidth
              inputProps={{ maxLength: 20 }}
              required={!editMode}
            />
            
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email || `${formData.email.length}/30 characters - Optional`}
              fullWidth
              inputProps={{ maxLength: 30 }}
            />
            
            <TextField
              label="Branch"
              name="branch"
              value={formData.branch}
              onChange={handleInputChange}
              error={!!errors.branch}
              helperText={errors.branch || `${formData.branch.length}/2 characters - e.g., HQ, IT`}
              fullWidth
              inputProps={{ maxLength: 2, style: { textTransform: 'uppercase' } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            sx={{ backgroundColor: '#4d1d4f' }}
          >
            {loading ? 'Saving...' : editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user <strong>{userToDelete?.userName}</strong>?
          </Typography>
          <Typography color="error" sx={{ mt: 2 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDeleteDialog} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteUser}
            variant="contained"
            color="error"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
