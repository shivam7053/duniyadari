import React from 'react';
import { Box, Typography, Paper, Grid, Container, Button, Chip } from '@mui/material';
import type { JobPost } from '../../index';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';

export const JobView: React.FC<{ post: JobPost }> = ({ post }) => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {post.title}
            </Typography>
            <Chip 
              icon={<BusinessIcon />} 
              label={post.company} 
              color="primary" 
              variant="outlined" 
              sx={{ mr: 1 }} 
            />
            <Chip 
              icon={<WorkIcon />} 
              label={post.sector} 
              color="secondary" 
              variant="outlined" 
            />
          </Box>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">Department</Typography>
            <Typography variant="body1" fontWeight="bold">{post.department}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">Application Period</Typography>
            <Typography variant="body1" fontWeight="bold">
              {post.applicationStartDate} to {post.applicationEndDate}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>Requirements</Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            {post.requirements}
          </Typography>
        </Box>

        <Button variant="contained" size="large" fullWidth>
          Apply Now
        </Button>
      </Paper>
    </Container>
  );
};
