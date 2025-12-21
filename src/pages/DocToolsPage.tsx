import React, { useState } from 'react';
import { 
  Container, Typography, Box, Paper, Tabs, Tab, Button, 
  CircularProgress, Alert, TextField, Grid 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import SEO from '../components/SEO';
import { Helmet } from 'react-helmet-async';

const DocToolsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Tool specific states
  const [startPage, setStartPage] = useState('1');
  const [endPage, setEndPage] = useState('5');

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'; 

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setFiles(null);
    setError('');
    setStartPage('1');
    setEndPage('5');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFiles(event.target.files);
      setError('');
    }
  };

  const getEndpoint = () => {
    switch(tabValue) {
      case 0: return 'pdf-to-doc';
      case 1: return 'img-to-doc';
      case 2: return 'text-to-doc';
      case 3: return 'merge-doc';
      case 4: return 'split-doc';
      case 5: return 'extract-text-doc';
      default: return '';
    }
  };

  const getAcceptType = () => {
    switch(tabValue) {
      case 0: return '.pdf';
      case 1: return 'image/*';
      case 2: return '.txt';
      default: return '.docx'; // For merge, split, extract
    }
  };

  const getButtonLabel = () => {
    switch(tabValue) {
      case 0: return 'Select PDF File';
      case 1: return 'Select Images';
      case 2: return 'Select Text File';
      default: return 'Select Word Docs';
    }
  };

  const handleSubmit = async () => {
    if (!files || files.length === 0) {
      setError('Please select files first.');
      return;
    }

    setLoading(true);
    setError('');
    const formData = new FormData();
    
    Array.from(files).forEach((file) => {
      formData.append('files', file);
    });

    const endpoint = getEndpoint();

    if (endpoint === 'split-doc') {
      formData.append('start', startPage);
      formData.append('end', endPage);
    }

    try {
      const response = await fetch(`${BACKEND_URL}/${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Processing failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = endpoint === 'extract-text-doc' ? 'extracted_text.txt' : 'converted_document.docx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      setError('Failed to process files. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Doc Tools",
    "description": "Free online Word Document tools. Convert PDF to Word, Images to Word, Text to Word, Merge Docs, and Split Docs.",
    "url": window.location.href,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <SEO 
        title="Doc Tools - Convert, Merge & Split Word Documents" 
        description="Free online Word Document tools. Convert PDF to Word, Images to Word, Text to Word, Merge Docs, and Split Docs."
        keywords="doc tools, word converter, pdf to word, merge docx, split docx"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>
      <Typography variant="h3" gutterBottom align="center" color="primary">
        Doc Tools
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Convert, merge, and manipulate Word documents.
      </Typography>

      <Paper elevation={3}>
        <Tabs value={tabValue} onChange={handleTabChange} centered variant="scrollable" scrollButtons="auto">
          <Tab icon={<DescriptionIcon />} label="PDF to Word" />
          <Tab icon={<ImageIcon />} label="Images to Word" />
          <Tab icon={<TextSnippetIcon />} label="Text to Word" />
          <Tab icon={<MergeTypeIcon />} label="Merge Docs" />
          <Tab icon={<ContentCutIcon />} label="Split Doc" />
          <Tab icon={<TextSnippetIcon />} label="Extract Text" />
        </Tabs>

        <Box sx={{ p: 4, textAlign: 'center' }}>
          <input
            accept={getAcceptType()}
            style={{ display: 'none' }}
            id="raised-button-file"
            type="file"
            multiple={tabValue === 1 || tabValue === 3} // Allow multiple for Images and Merge
            onChange={handleFileChange}
          />
          <label htmlFor="raised-button-file">
            <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />} size="large" sx={{ mb: 2 }}>
              {getButtonLabel()}
            </Button>
          </label>
          
          {files && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">Selected {files.length} file(s):</Typography>
              {Array.from(files).map((f, i) => (
                <Typography key={i} variant="caption" display="block">{f.name}</Typography>
              ))}
            </Box>
          )}

          {/* Dynamic Inputs */}
          {tabValue === 4 && (
            <Grid container spacing={2} justifyContent="center" sx={{ mb: 2 }}>
              <Grid size={4}>
                <TextField label="Start Page" type="number" fullWidth value={startPage} onChange={(e) => setStartPage(e.target.value)} />
              </Grid>
              <Grid size={4}>
                <TextField label="End Page" type="number" fullWidth value={endPage} onChange={(e) => setEndPage(e.target.value)} />
              </Grid>
            </Grid>
          )}

          <Box sx={{ mt: 2 }}>
            <Button 
              variant="contained" 
              size="large" 
              disabled={!files || loading}
              onClick={handleSubmit}
            >
              {loading ? <CircularProgress size={24} /> : 'Process Files'}
            </Button>
          </Box>

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </Box>
      </Paper>
    </Container>
  );
};

export default DocToolsPage;
