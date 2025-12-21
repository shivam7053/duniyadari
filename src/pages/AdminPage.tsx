import React, { useState, useEffect } from 'react';
import { 
  Box, TextField, Button, MenuItem, Typography, Container, 
  Grid, Paper, IconButton, Divider, Snackbar, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { collection, addDoc, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../firebase';
import type { Category, StorySegment } from '../index';

const AdminPage: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [category, setCategory] = useState<Category>('tech-space');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{open: boolean, message: string, type: 'success' | 'error'}>({
    open: false, message: '', type: 'success'
  });

  // Story State
  const [segments, setSegments] = useState<StorySegment[]>([{ text: '', imageUrl: '' }]);

  // Job State
  const [jobData, setJobData] = useState({
    sector: '', department: '', company: '', requirements: '', 
    applicationStartDate: '', applicationEndDate: ''
  });

  // Tech State
  const [techData, setTechData] = useState({ heroImageUrl: '', content: '' });

  // Check Database Connection on Login
  useEffect(() => {
    if (isAuthenticated) {
      const checkConnection = async () => {
        try {
          await getDocs(query(collection(db, 'posts'), limit(1)));
          setNotification({ open: true, message: 'Database Connected Successfully', type: 'success' });
        } catch (error: any) {
          let errorMessage = error.message;
          if (error.code === 'permission-denied') {
            errorMessage = "Permission Denied. Go to Firebase Console > Firestore > Rules and set 'allow read, write: if true;'";
          }
          setNotification({ open: true, message: `Database Connection Failed: ${errorMessage}`, type: 'error' });
        }
      };
      checkConnection();
    }
  }, [isAuthenticated]);

  const handleAddSegment = () => {
    setSegments([...segments, { text: '', imageUrl: '' }]);
  };

  const handleRemoveSegment = (index: number) => {
    const newSegments = [...segments];
    newSegments.splice(index, 1);
    setSegments(newSegments);
  };

  const handleSegmentChange = (index: number, field: keyof StorySegment, value: string) => {
    const newSegments = [...segments];
    newSegments[index][field] = value;
    setSegments(newSegments);
  };

  const handleSubmit = async () => {
    // 0. Config Check
    // @ts-ignore - accessing internal options for debugging
    const config = db.app.options;
    console.log("Firebase Config Status:", {
      projectId: config.projectId,
      authDomain: config.authDomain,
      apiKey: config.apiKey ? "Present" : "Missing"
    });

    // @ts-ignore
    if (!config.apiKey || !config.projectId) {
      setNotification({ open: true, message: 'Config Missing! Check console. Restart server if you just added .env', type: 'error' });
      return;
    }

    // 1. Basic Validation
    if (!title.trim()) {
      setNotification({ open: true, message: 'Title is required', type: 'error' });
      return;
    }

    // 2. Category Specific Validation
    if (category === 'tech-space' && !techData.content.trim()) {
      setNotification({ open: true, message: 'Content is required for Tech posts', type: 'error' });
      return;
    }

    if ((category === 'government-jobs' || category === 'private-jobs') && !jobData.company.trim()) {
      setNotification({ open: true, message: 'Company name is required', type: 'error' });
      return;
    }

    if ((category === 'horror' || category === 'romantic') && segments.some(s => !s.text.trim())) {
      setNotification({ open: true, message: 'All story segments must have text', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const baseData = {
        title,
        category,
        createdAt: Date.now(),
      };

      let finalData = {};

      if (category === 'horror' || category === 'romantic') {
        finalData = { ...baseData, segments };
      } else if (category === 'government-jobs' || category === 'private-jobs') {
        finalData = { ...baseData, ...jobData };
      } else {
        finalData = { ...baseData, ...techData };
      }

      // Create a timeout promise to prevent hanging indefinitely
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Request timed out. 1. Restart server. 2. Check Firestore Rules (Test Mode).")), 20000)
      );

      // Race the addDoc against the timeout
      await Promise.race([addDoc(collection(db, 'posts'), finalData), timeoutPromise]);
      setNotification({ open: true, message: 'Post created successfully!', type: 'success' });
      
      // Reset form
      setTitle('');
      setSegments([{ text: '', imageUrl: '' }]);
      setJobData({ sector: '', department: '', company: '', requirements: '', applicationStartDate: '', applicationEndDate: '' });
      setTechData({ heroImageUrl: '', content: '' });

    } catch (error: any) {
      console.error("Submission Error:", error);
      let errorMessage = error.message;
      if (error.code === 'permission-denied') {
        errorMessage = "Permission Denied. Check Firestore Rules in Firebase Console.";
      }
      setNotification({ open: true, message: `Error creating post: ${errorMessage}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    if (
      username === import.meta.env.VITE_ADMIN_USERNAME && 
      password === import.meta.env.VITE_ADMIN_PASSWORD
    ) {
      setIsAuthenticated(true);
    } else {
      setNotification({ open: true, message: 'Invalid Credentials', type: 'error' });
    }
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom align="center">Admin Login</Typography>
          <TextField 
            fullWidth label="Username" margin="normal" 
            value={username} onChange={(e) => setUsername(e.target.value)} 
          />
          <TextField 
            fullWidth label="Password" type="password" margin="normal" 
            value={password} onChange={(e) => setPassword(e.target.value)} 
          />
          <Button fullWidth variant="contained" size="large" sx={{ mt: 3 }} onClick={handleLogin}>
            Login
          </Button>
        </Paper>
        <Snackbar open={notification.open} autoHideDuration={6000} onClose={() => setNotification({...notification, open: false})}>
          <Alert severity={notification.type} onClose={() => setNotification({...notification, open: false})}>{notification.message}</Alert>
        </Snackbar>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <TextField
              select
              fullWidth
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
            >
              <MenuItem value="horror">Horror Stories</MenuItem>
              <MenuItem value="romantic">Romantic Stories</MenuItem>
              <MenuItem value="government-jobs">Government Jobs</MenuItem>
              <MenuItem value="private-jobs">Private Jobs</MenuItem>
              <MenuItem value="tech-space">Technology & Space</MenuItem>
            </TextField>
          </Grid>
          
          <Grid size={12}>
            <TextField
              fullWidth
              label="Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>

          {/* STORY FORM */}
          {(category === 'horror' || category === 'romantic') && (
            <Grid size={12}>
              <Typography variant="h6" gutterBottom>Story Segments</Typography>
              {segments.map((segment, index) => (
                <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="subtitle2">Segment {index + 1}</Typography>
                    <IconButton onClick={() => handleRemoveSegment(index)} color="error" size="small">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Story Text"
                    value={segment.text}
                    onChange={(e) => handleSegmentChange(index, 'text', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Image URL"
                    value={segment.imageUrl}
                    onChange={(e) => handleSegmentChange(index, 'imageUrl', e.target.value)}
                  />
                </Paper>
              ))}
              <Button startIcon={<AddIcon />} onClick={handleAddSegment}>Add Segment</Button>
            </Grid>
          )}

          {/* JOB FORM */}
          {(category === 'government-jobs' || category === 'private-jobs') && (
            <>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Company/Organization" value={jobData.company} onChange={(e) => setJobData({...jobData, company: e.target.value})} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Sector" value={jobData.sector} onChange={(e) => setJobData({...jobData, sector: e.target.value})} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Department" value={jobData.department} onChange={(e) => setJobData({...jobData, department: e.target.value})} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Requirements" multiline rows={2} value={jobData.requirements} onChange={(e) => setJobData({...jobData, requirements: e.target.value})} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Start Date" type="date" InputLabelProps={{ shrink: true }} value={jobData.applicationStartDate} onChange={(e) => setJobData({...jobData, applicationStartDate: e.target.value})} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="End Date" type="date" InputLabelProps={{ shrink: true }} value={jobData.applicationEndDate} onChange={(e) => setJobData({...jobData, applicationEndDate: e.target.value})} />
              </Grid>
            </>
          )}

          {/* TECH FORM */}
          {category === 'tech-space' && (
            <>
              <Grid size={12}>
                <TextField fullWidth label="Hero Image URL" value={techData.heroImageUrl} onChange={(e) => setTechData({...techData, heroImageUrl: e.target.value})} />
              </Grid>
              <Grid size={12}>
                <TextField fullWidth multiline rows={10} label="Content" value={techData.content} onChange={(e) => setTechData({...techData, content: e.target.value})} />
              </Grid>
            </>
          )}

          <Grid size={12}>
            <Divider sx={{ my: 2 }} />
            <Button variant="contained" size="large" fullWidth onClick={handleSubmit} disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Post'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      <Snackbar open={notification.open} autoHideDuration={6000} onClose={() => setNotification({...notification, open: false})}>
        <Alert severity={notification.type} onClose={() => setNotification({...notification, open: false})}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminPage;
