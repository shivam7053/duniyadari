import React, { useState } from 'react';
import { Box, Typography, Container, Paper, Grid, List, ListItemButton, ListItemText, Divider, Chip, Stack, Button } from '@mui/material';
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

export const TechView: React.FC<{ post: BlogPost }> = ({ post }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const hasTopics = post.topics && post.topics.length > 0;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box 
        sx={{ 
          width: '100%', 
          height: '400px', 
          backgroundImage: `url("${getDirectImageUrl(post.coverImage || '')}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 4,
          mb: 4,
          boxShadow: 4
        }} 
      />

      <Grid container spacing={4}>
        {/* SIDE MENU (Only if sections exist) */}
        {hasTopics && (
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper elevation={2} sx={{ position: 'sticky', top: 100, overflow: 'hidden' }}>
              <Box p={2} bgcolor="primary.main" color="white">
                <Typography variant="h6">Topics</Typography>
              </Box>
              <List component="nav" disablePadding>
                {post.topics.map((topic, index) => (
                  <React.Fragment key={index}>
                    <ListItemButton
                      selected={selectedIndex === index}
                      onClick={() => setSelectedIndex(index)}
                      sx={{ 
                        '&.Mui-selected': { 
                          backgroundColor: 'primary.dark', 
                          color: 'white',
                          '&:hover': { backgroundColor: 'primary.dark' }
                        } 
                      }}
                    >
                      <ListItemText primary={topic.title} />
                    </ListItemButton>
                    {index < post.topics.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        )}

        {/* MAIN CONTENT AREA */}
        <Grid size={{ xs: 12, md: hasTopics ? 9 : 12 }}>
          <Container maxWidth="md">
            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
              {post.title}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <CalendarTodayIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {new Date(post.createdAt).toLocaleDateString()}
                </Typography>
              </Stack>
              {post.tags && post.tags.length > 0 && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <SellIcon fontSize="small" color="action" />
                  {post.tags.map(tag => (
                    <Chip key={tag} label={tag} variant="outlined" size="small" />
                  ))}
                </Stack>
              )}
            </Stack>
            <Divider sx={{ mb: 4 }} />

            <Paper elevation={0} sx={{ p: 0, bgcolor: 'transparent' }}>
              {/* Render Content based on selection */}
              {hasTopics && (
                <>
                  <Typography variant="h4" component="h2" gutterBottom color="primary" sx={{ mt: 2 }}>
                    {post.topics[selectedIndex]?.title}
                  </Typography>
                  
                  <Box sx={{ 
                    '& p': { mb: 2, fontSize: '1.1rem', lineHeight: 1.8 },
                    '& h1, & h2, & h3': { color: 'primary.main', mt: 3, mb: 2 },
                    '& ul, & ol': { pl: 3, mb: 2 },
                    '& li': { mb: 1 },
                    '& a': { color: 'primary.main', textDecoration: 'underline' },
                    '& code': { backgroundColor: 'rgba(0,0,0,0.05)', p: '2px 4px', borderRadius: '4px', fontFamily: 'monospace' }
                  }}>
                    <ReactMarkdown>{post.topics[selectedIndex]?.content}</ReactMarkdown>
                  </Box>
                </>
              )}

              {!hasTopics && (
                <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                  This post does not have detailed topics yet.
                </Typography>
              )}

              {post.resources && (
                <Box sx={{ mt: 6, p: 3, bgcolor: 'background.default', borderRadius: 2, border: '1px dashed', borderColor: 'divider', textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom>
                    Download Resources
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    href={getDriveViewLink(post.resources)} 
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<CloudDownloadIcon />}
                  >
                    Access Notes & Files
                  </Button>
                </Box>
              )}
            </Paper>
          </Container>
        </Grid>
      </Grid>
    </Container>
  );
};
