import React, { useState } from 'react';
import { Box, Container, Grid, Typography, Link, useTheme, Collapse } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [openStories, setOpenStories] = useState(false);
  const [openJobs, setOpenJobs] = useState(false);

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: theme.palette.mode === 'light' ? 'grey.200' : 'grey.900',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box component="img" src="/logo.png" alt="duniyadari" sx={{ height: 60, mb: 1 }} />
            <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
              duniyadari
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Connecting you to the world of stories, opportunities, and innovation. 
              Your daily dose of everything that matters.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Explore
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Link component="button" variant="body2" onClick={() => navigate('/')} color="text.secondary" sx={{ textAlign: 'left' }}>Home</Link>
              
              {/* Stories Dropdown */}
              <Box>
                <Box 
                  display="flex" 
                  alignItems="center" 
                  onClick={() => setOpenStories(!openStories)} 
                  sx={{ cursor: 'pointer', color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                >
                  <Typography variant="body2" sx={{ mr: 0.5 }}>Stories</Typography>
                  {openStories ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                </Box>
                <Collapse in={openStories}>
                  <Box display="flex" flexDirection="column" gap={1} pl={2} mt={1}>
                    <Link component="button" variant="body2" onClick={() => navigate('/stories/horror')} color="text.secondary" sx={{ textAlign: 'left' }}>Horror Stories</Link>
                    <Link component="button" variant="body2" onClick={() => navigate('/stories/romantic')} color="text.secondary" sx={{ textAlign: 'left' }}>Romantic Stories</Link>
                  </Box>
                </Collapse>
              </Box>

              {/* Jobs Dropdown */}
              <Box>
                <Box 
                  display="flex" 
                  alignItems="center" 
                  onClick={() => setOpenJobs(!openJobs)} 
                  sx={{ cursor: 'pointer', color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                >
                  <Typography variant="body2" sx={{ mr: 0.5 }}>Jobs</Typography>
                  {openJobs ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                </Box>
                <Collapse in={openJobs}>
                  <Box display="flex" flexDirection="column" gap={1} pl={2} mt={1}>
                    <Link component="button" variant="body2" onClick={() => navigate('/category/government-jobs')} color="text.secondary" sx={{ textAlign: 'left' }}>Government Jobs</Link>
                    <Link component="button" variant="body2" onClick={() => navigate('/category/private-jobs')} color="text.secondary" sx={{ textAlign: 'left' }}>Private Jobs</Link>
                  </Box>
                </Collapse>
              </Box>

              <Link component="button" variant="body2" onClick={() => navigate('/category/tech-space')} color="text.secondary" sx={{ textAlign: 'left' }}>Tech & Space</Link>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Tools
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Link component="button" variant="body2" onClick={() => navigate('/tools/pdf')} color="text.secondary" sx={{ textAlign: 'left' }}>PDF Tools</Link>
              <Link component="button" variant="body2" onClick={() => navigate('/tools/doc')} color="text.secondary" sx={{ textAlign: 'left' }}>Doc Tools</Link>
              <Link component="button" variant="body2" onClick={() => navigate('/tools/image')} color="text.secondary" sx={{ textAlign: 'left' }}>Image Tools</Link>
            </Box>
          </Grid>
        </Grid>
        <Box mt={5} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            {'Copyright © '}
            <Link color="inherit" href="#">
              duniyadari
            </Link>{' '}
            {new Date().getFullYear()}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
