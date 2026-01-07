import React from 'react';
import { Box, Typography, Paper, Container, Button, Divider, Chip, Stack } from '@mui/material';
import type { BlogPost } from '../../index';
import ReactMarkdown from 'react-markdown';
import { getDirectImageUrl } from '../../utils';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SellIcon from '@mui/icons-material/Sell';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

const getDriveViewLink = (url: string) => {
  if (!url) return '';
  // Fix 503 errors by converting download links to view links
  if (url.includes('drive.google.com') && url.includes('export=download')) {
    const match = url.match(/id=([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) return `https://drive.google.com/file/d/${match[1]}/view?usp=sharing`;
  }
  return url;
};

export const JobView: React.FC<{ post: BlogPost }> = ({ post }) => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {post.title}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <CalendarTodayIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            Posted on: {new Date(post.createdAt).toLocaleDateString()}
          </Typography>
        </Stack>
        
        {post.coverImage && (
          <Box
            component="img"
            src={getDirectImageUrl(post.coverImage)}
            alt={post.title}
            sx={{ width: '100%', height: 'auto', borderRadius: 2, mb: 3 }}
            referrerPolicy="no-referrer"
          />
        )}

        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
          Job Description
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {post.excerpt}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {post.topics.map(topic => (
          <Box key={topic.id} sx={{ mb: 4 }}>
            <Typography variant="h6" component="h3" gutterBottom color="primary">
              {topic.title}
            </Typography>
            {/* This will render actual HTML tags from your markdown content */}
            <Box sx={{ '& p': { my: 1 }, '& ul': { pl: 3 }, '& li': { mb: 0.5 }, '& a': { color: 'primary.main' } }}>
              <ReactMarkdown>{topic.content}</ReactMarkdown>
            </Box>
          </Box>
        ))}

        {post.tags && post.tags.length > 0 && (
          <Box sx={{ my: 4 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <SellIcon color="action" />
              {post.tags.map(tag => (
                <Chip key={tag} label={tag} variant="outlined" size="small" />
              ))}
            </Stack>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2, flexWrap: 'wrap' }}>
          {post.resources && (
            <Button 
              variant="outlined" 
              size="large" 
              href={getDriveViewLink(post.resources)}
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<CloudDownloadIcon />}
              sx={{ px: 4, py: 1.5, borderRadius: '50px' }}
            >
              Download PDF
            </Button>
          )}
          <Button variant="contained" size="large" sx={{ px: 6, py: 1.5, borderRadius: '50px' }}>
            Apply Now
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
