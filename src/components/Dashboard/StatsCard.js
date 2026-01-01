import React from 'react';
import { Card, CardContent, Typography, Box, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';

const StatsCard = ({ title, value, icon, color, to }) => {
  const content = (
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {icon}
        <Box>
          <Typography variant="h4">{value}</Typography>
          <Typography variant="body2">{title}</Typography>
        </Box>
      </Box>
    </CardContent>
  );

  return (
    <Card sx={{ minWidth: 200, backgroundColor: color, color: 'white' }}>
      {to ? (
        <CardActionArea component={Link} to={to} sx={{ color: 'inherit' }}>
          {content}
        </CardActionArea>
      ) : (
        content
      )}
    </Card>
  );
};

export default StatsCard;