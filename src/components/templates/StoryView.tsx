import React from 'react';
import { Box, Typography, Grid, Container } from '@mui/material';
import type { StoryPost } from '../../index';

export const StoryView: React.FC<{ post: StoryPost }> = ({ post }) => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" gutterBottom align="center" color="secondary.main" sx={{ mb: 6 }}>
        {post.title}
      </Typography>
      
      {post.segments.map((segment, index) => (
        <Box key={index} sx={{ mb: 8 }}>
          <Grid container spacing={4} alignItems="center" direction={index % 2 === 0 ? 'row' : 'row-reverse'}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body1" sx={{ fontSize: '1.2rem', lineHeight: 1.8 }}>
                {segment.text}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                component="img"
                src={segment.imageUrl}
                alt={`Story part ${index + 1}`}
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 4,
                  boxShadow: 3,
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'scale(1.02)' }
                }}
              />
            </Grid>
          </Grid>
        </Box>
      ))}
    </Container>
  );
};
