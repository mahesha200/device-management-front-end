import React from 'react';
import { Breadcrumbs as MuiBreadcrumbs, Typography, Box, Link } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const Breadcrumbs = ({ customBreadcrumbs }) => {
  const location = useLocation();

  // Generate breadcrumbs from URL path
  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const pathnames = location.pathname.split('/').filter((x) => x);
    
    // If on home page
    if (pathnames.length === 0) {
      return [{ label: 'Dashboard', path: '/', icon: <HomeIcon sx={{ fontSize: 18 }} /> }];
    }

    const breadcrumbs = [
      { label: 'Dashboard', path: '/', icon: <HomeIcon sx={{ fontSize: 18 }} /> }
    ];

    let currentPath = '';
    pathnames.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Convert segment to readable label
      let label = segment.charAt(0).toUpperCase() + segment.slice(1);
      
      // Handle specific cases
      if (segment === 'add') {
        label = 'Add New';
      } else if (segment === 'edit') {
        label = 'Modify';
      } else if (!isNaN(segment)) {
        label = `Details`;
      }

      breadcrumbs.push({
        label,
        path: currentPath,
        isLast: index === pathnames.length - 1
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <Box 
      sx={{ 
        mb: 4,
        mt: 3,
        p: 2,
        backgroundColor: '#fff',
        borderRadius: 2,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        border: '1px solid #e5e7eb',
        mx: 3
      }}
    >
      <MuiBreadcrumbs 
        separator={<NavigateNextIcon fontSize="small" sx={{ color: '#94a3b8' }} />}
        aria-label="breadcrumb"
      >
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return isLast ? (
            <Box 
              key={crumb.path} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 0.5
              }}
            >
              {crumb.icon}
              <Typography 
                color="text.primary" 
                sx={{ 
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  color: '#4d1d4f'
                }}
              >
                {crumb.label}
              </Typography>
            </Box>
          ) : (
            <Link
              key={crumb.path}
              component={RouterLink}
              to={crumb.path}
              underline="hover"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: '#64748b',
                fontWeight: 500,
                fontSize: '0.95rem',
                transition: 'color 0.2s',
                '&:hover': {
                  color: '#4d1d4f'
                }
              }}
            >
              {crumb.icon}
              {crumb.label}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;
