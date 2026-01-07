import React, { useState, useEffect } from 'react';
import { 
  Box, TextField, Button, MenuItem, Typography, Container, 
  Grid, Paper, IconButton, Divider, Snackbar, Alert, FormControlLabel, Checkbox
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { collection, addDoc, getDocs, query, limit, doc, updateDoc, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import type { Category, BlogTopic } from '../index';

const AdminPage: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [category, setCategory] = useState<Category>('tech-space');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [notification, setNotification] = useState<{open: boolean, message: string, type: 'success' | 'error'}>({
    open: false, message: '', type: 'success'
  });

  // New Post Structure State
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [resources, setResources] = useState('');
  const [published, setPublished] = useState(false);
  const [topics, setTopics] = useState<BlogTopic[]>([]);

  // SEO State
  const [seoData, setSeoData] = useState({ description: '', keywords: '' });

  // Check Database Connection on Login
  useEffect(() => {
    if (isAuthenticated) {
      const checkConnection = async () => {
        try {
          await getDocs(query(collection(db, 'posts'), limit(1)));
          setNotification({ open: true, message: 'Database Connected Successfully', type: 'success' });
          fetchRecentPosts();
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

  const fetchRecentPosts = async () => {
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(10));
      const querySnapshot = await getDocs(q);
      setRecentPosts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setExcerpt('');
    setCoverImage('');
    setTagsInput('');
    setResources('');
    setPublished(false);
    setTopics([]);
    setSeoData({ description: '', keywords: '' });
  };

  const handleEdit = (post: any) => {
    setEditingId(post.id);
    setCategory(post.category);
    setTitle(post.title);
    setSlug(post.slug || '');
    setExcerpt(post.excerpt || '');
    setCoverImage(post.coverImage || '');
    setTagsInput(post.tags ? post.tags.join(', ') : '');
    setResources(post.resources || '');
    setPublished(post.published || false);
    setSeoData({ 
      description: post.seoDescription || '', 
      keywords: post.seoKeywords ? post.seoKeywords.join(', ') : '' 
    });

    // Migration Logic for Old Data
    let loadedTopics: BlogTopic[] = [];
    if (post.topics) {
      loadedTopics = post.topics;
    } else if (post.segments) {
      // Migrate Story Segments
      loadedTopics = post.segments.map((seg: any, index: number) => ({
        id: `topic-${Date.now()}-${index}`,
        title: `Segment ${index + 1}`,
        content: `${seg.text}\n\n${seg.imageUrl ? `!Image` : ''}`,
        order: index + 1
      }));
    } else if (post.sections) {
      // Migrate Tech Sections
      loadedTopics = post.sections.map((sec: any, index: number) => ({
        id: `topic-${Date.now()}-${index}`,
        title: sec.title,
        content: sec.content,
        order: index + 1
      }));
    } else if (post.requirements) {
      // Migrate Job
      loadedTopics.push({
        id: `topic-${Date.now()}-0`,
        title: 'Job Details',
        content: `**Company:** ${post.company}\n**Department:** ${post.department}\n**Sector:** ${post.sector}\n\n**Requirements:**\n${post.requirements}`,
        order: 1
      });
    }
    setTopics(loadedTopics);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddTopic = () => {
    setTopics([...topics, { 
      id: Date.now().toString(), 
      title: '', 
      content: '', 
      order: topics.length + 1 
    }]);
  };

  const handleRemoveTopic = (index: number) => {
    const newTopics = [...topics];
    newTopics.splice(index, 1);
    setTopics(newTopics);
  };

  const handleTopicChange = (index: number, field: keyof BlogTopic, value: string) => {
    const newTopics = [...topics];
    (newTopics[index] as any)[field] = value;
    setTopics(newTopics);
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

    setLoading(true);
    try {
      // Auto-generate slug if missing
      let finalSlug = slug.trim();
      if (!finalSlug) {
        finalSlug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      }

      const finalTags = tagsInput.split(',').map(t => t.trim()).filter(t => t !== '');
      const finalSeoKeywords = seoData.keywords.split(',').map(k => k.trim()).filter(k => k !== '');

      const postData: any = {
        title,
        slug: finalSlug,
        excerpt,
        coverImage,
        category,
        updatedAt: Date.now(),
        tags: finalTags,
        topics: topics.map((t, i) => ({ ...t, order: i + 1 })),
        resources,
        seoTitle: title,
        seoDescription: seoData.description,
        seoKeywords: finalSeoKeywords,
        published
      };

      if (!editingId) {
        postData.createdAt = Date.now();
      }

      // Create a timeout promise to prevent hanging indefinitely
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Request timed out. 1. Restart server. 2. Check Firestore Rules (Test Mode).")), 20000)
      );

      if (editingId) {
        await Promise.race([updateDoc(doc(db, 'posts', editingId), postData), timeoutPromise]);
        setNotification({ open: true, message: 'Post updated successfully!', type: 'success' });
      } else {
        await Promise.race([addDoc(collection(db, 'posts'), postData), timeoutPromise]);
        setNotification({ open: true, message: 'Post created successfully!', type: 'success' });
      }
      
      resetForm();
      fetchRecentPosts();

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
      <Typography variant="h4" gutterBottom>{editingId ? 'Edit Post' : 'Create New Post'}</Typography>
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
              label="Slug (URL Friendly Name)"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Leave empty to auto-generate from title"
              helperText="e.g. my-awesome-post"
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              label="Excerpt (Short Description)"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              multiline
              rows={2}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              label="Cover Image URL"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              label="Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              label="SEO Description (Meta)"
              value={seoData.description}
              onChange={(e) => setSeoData({...seoData, description: e.target.value})}
              placeholder="Short summary for search engines (150-160 chars)"
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              label="SEO Keywords"
              value={seoData.keywords}
              onChange={(e) => setSeoData({...seoData, keywords: e.target.value})}
              placeholder="Comma separated keywords (e.g. tech, space, nasa)"
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              label="Tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Comma separated tags (e.g. tech, news, jobs)"
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              label="Resources (GDrive Link)"
              value={resources}
              onChange={(e) => setResources(e.target.value)}
              placeholder="Optional link to notes or resources"
            />
          </Grid>

          <Grid size={12}>
            <FormControlLabel
              control={<Checkbox checked={published} onChange={(e) => setPublished(e.target.checked)} />}
              label="Published (Visible to public)"
            />
          </Grid>

          {/* UNIFIED TOPICS EDITOR */}
          <Grid size={12}>
            <Typography variant="h6" gutterBottom>Content Topics</Typography>
            <Typography variant="caption" color="text.secondary" paragraph>
              Add topics to structure your post. For Stories, these are segments. For Tech, these are sections. For Jobs, add details here.
            </Typography>
            {topics.map((topic, index) => (
              <Paper key={topic.id} variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="subtitle2">Topic {index + 1}</Typography>
                  <IconButton onClick={() => handleRemoveTopic(index)} color="error" size="small">
                    <DeleteIcon />
                  </IconButton>
                </Box>
                <TextField
                  fullWidth label="Topic Title" value={topic.title}
                  onChange={(e) => handleTopicChange(index, 'title', e.target.value)} sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth multiline rows={6} label="Content (Markdown/HTML)" value={topic.content}
                  onChange={(e) => handleTopicChange(index, 'content', e.target.value)}
                />
              </Paper>
            ))}
            <Button startIcon={<AddIcon />} onClick={handleAddTopic}>Add Topic</Button>
          </Grid>

          <Grid size={12}>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" gap={2}>
              {editingId && (
                <Button variant="outlined" size="large" fullWidth onClick={resetForm} color="secondary">
                  Cancel Edit
                </Button>
              )}
              <Button variant="contained" size="large" fullWidth onClick={handleSubmit} disabled={loading}>
                {loading ? (editingId ? 'Updating...' : 'Publishing...') : (editingId ? 'Update Post' : 'Publish Post')}
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />
        <Typography variant="h5" gutterBottom>Recent Posts</Typography>
        {recentPosts.map((post) => (
          <Paper key={post.id} variant="outlined" sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">{post.title}</Typography>
              <Typography variant="caption" color="text.secondary">{post.category} • {new Date(post.createdAt).toLocaleDateString()}</Typography>
            </Box>
            <Button startIcon={<EditIcon />} variant="outlined" size="small" onClick={() => handleEdit(post)}>Edit</Button>
          </Paper>
        ))}
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
