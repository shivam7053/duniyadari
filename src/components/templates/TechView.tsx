import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import type { TechPost } from '../../index';

export const TechView: React.FC<{ post: TechPost }> = ({ post }) => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box 
        sx={{ 
          width: '100%', 
          height: '400px', 
          backgroundImage: `url(${post.heroImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 4,
          mb: 4,
          boxShadow: 4
        }} 
      />
      <Container maxWidth="md">
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          {post.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {new Date(post.createdAt).toLocaleDateString()}
        </Typography>
        <Paper elevation={0} sx={{ p: 0, mt: 4, bgcolor: 'transparent' }}>
          <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
            {post.content}
          </Typography>
        </Paper>
      </Container>
    </Container>
  );
};
