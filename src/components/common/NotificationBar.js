import React, { useState, useEffect } from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  Slide,
  Typography,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';

function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

/**
 * Enhanced Notification Component
 * Displays styled in-app notifications that complement system notifications
 */
export default function NotificationBar({ 
  open, 
  onClose, 
  severity = 'success', 
  title, 
  message, 
  duration = 5000,
  action 
}) {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const getIcon = () => {
    switch (severity) {
      case 'success':
        return <CheckCircleIcon sx={{ fontSize: 28 }} />;
      case 'error':
        return <ErrorIcon sx={{ fontSize: 28 }} />;
      case 'info':
        return <InfoIcon sx={{ fontSize: 28 }} />;
      default:
        return <InfoIcon sx={{ fontSize: 28 }} />;
    }
  };

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={duration}
      onClose={handleClose}
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ mt: 7 }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        icon={getIcon()}
        sx={{
          minWidth: 350,
          maxWidth: 500,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          borderRadius: 2,
          '& .MuiAlert-icon': {
            fontSize: 28,
          },
          '& .MuiAlert-message': {
            width: '100%',
          }
        }}
        action={
          <>
            {action}
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
      >
        {title && (
          <AlertTitle sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
            {title}
          </AlertTitle>
        )}
        <Typography variant="body2" sx={{ fontSize: '0.95rem' }}>
          {message}
        </Typography>
      </Alert>
    </Snackbar>
  );
}
