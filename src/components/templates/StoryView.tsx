import React from 'react';
import { Box, Typography, Grid, Container, Chip, Stack, Divider } from '@mui/material';
import type { BlogPost } from '../../index';
import ReactMarkdown from 'react-markdown';
import { getDirectImageUrl } from '../../utils';
import SellIcon from '@mui/icons-material/Sell';

const parseContent = (content: string) => {
  const imageRegex = /!\[.*?\]\((.*?)\)/;
  const imageMatch = content.match(imageRegex);
  const imageUrl = imageMatch ? imageMatch[1] : '';
  const text = content.replace(imageRegex, '').trim();
  return { text, imageUrl };
};

export const StoryView: React.FC<{ post: BlogPost }> = ({ post }) => {
  return (
    <Box sx={{ bgcolor: 'background.paper', py: 4 }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          gutterBottom 
          align="center" 
          sx={{ mb: 6, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}
        >
        {post.title}
      </Typography>
      
      {post.topics.map((topic, index) => {
        const { text, imageUrl } = parseContent(topic.content);
        return (
          <Box key={topic.id} sx={{ mb: 8 }}>
            <Grid container spacing={4} alignItems="center" direction={index % 2 === 0 ? 'row' : 'row-reverse'}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ 
                  '& p': { fontSize: '1.2rem', lineHeight: 1.8, mb: 2 },
                  '& strong': { fontWeight: 'bold' },
                  '& em': { fontStyle: 'italic' }
                }}>
                  <ReactMarkdown>{text}</ReactMarkdown>
                </Box>
              </Grid>
              {imageUrl && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box
                    component="img"
                    src={getDirectImageUrl(imageUrl)}
                    alt={topic.title || `Story part ${index + 1}`}
                    referrerPolicy="no-referrer"
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
              )}
            </Grid>
          </Box>
        );
      })}

      <Divider sx={{ my: 6, fontStyle: 'italic' }}>
        <Typography>The End</Typography>
      </Divider>

      {post.tags && post.tags.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" justifyContent="center">
            <SellIcon color="action" />
            {post.tags.map(tag => (
              <Chip 
                key={tag} 
                label={tag} 
                variant="filled" 
                size="small" 
                sx={{ m: 0.5 }}
              />
            ))}
          </Stack>
        </Box>
      )}
      </Container>
    </Box>
  );
};
