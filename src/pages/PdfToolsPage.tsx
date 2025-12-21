import React, { useState } from 'react';
import { 
  Container, Typography, Box, Paper, Tabs, Tab, Button, 
  CircularProgress, Alert, TextField, Grid 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import SecurityIcon from '@mui/icons-material/Security';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import SEO from '../components/SEO';
import { Helmet } from 'react-helmet-async';

const PdfToolsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Tool specific states
  const [password, setPassword] = useState('');
  const [startPage, setStartPage] = useState('1');
  const [endPage, setEndPage] = useState('5');

  // Use environment variable or fallback to localhost
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'; 

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setFiles(null);
    setError('');
    setPassword('');
    setStartPage('1');
    setEndPage('5');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFiles(event.target.files);
      setError('');
    }
  };

  const handleSubmit = async (endpoint: string) => {
    if (!files || files.length === 0) {
      setError('Please select files first.');
      return;
    }

    setLoading(true);
    setError('');
    const formData = new FormData();
    
    // Append all selected files
    Array.from(files).forEach((file) => {
      formData.append('files', file);
    });

    // Append extra fields based on tool
    if (endpoint === 'protect-pdf') {
      formData.append('password', password);
    } else if (endpoint === 'split-pdf') {
      formData.append('start', startPage);
      formData.append('end', endPage);
    }

    try {
      const response = await fetch(`${BACKEND_URL}/${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Processing failed');

      // Handle file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = endpoint === 'extract-text' ? 'extracted_text.txt' : 'processed_document.pdf';
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

  const getEndpoint = () => {
    switch(tabValue) {
      case 0: return 'merge-pdf';
      case 1: return 'img-to-pdf';
      case 2: return 'doc-to-pdf';
      case 3: return 'split-pdf';
      case 4: return 'protect-pdf';
      case 5: return 'extract-text';
      default: return '';
    }
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "PDF Tools",
    "description": "Free online PDF tools. Merge PDF, Image to PDF, Doc to PDF, Split PDF, Protect PDF, and Extract Text.",
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
        title="PDF Tools - Merge, Split, Convert & Protect" 
        description="Free online PDF tools. Merge PDF, Image to PDF, Doc to PDF, Split PDF, Protect PDF, and Extract Text. Fast, secure, and easy to use."
        keywords="pdf tools, merge pdf, split pdf, pdf converter, image to pdf"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>
      <Typography variant="h3" gutterBottom align="center" color="primary">
        PDF Tools
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Securely process your documents using our high-speed tools.
      </Typography>

      <Paper elevation={3}>
        <Tabs value={tabValue} onChange={handleTabChange} centered variant="scrollable" scrollButtons="auto">
          <Tab icon={<MergeTypeIcon />} label="Merge PDF" />
          <Tab icon={<ImageIcon />} label="Image to PDF" />
          <Tab icon={<PictureAsPdfIcon />} label="Doc to PDF" />
          <Tab icon={<ContentCutIcon />} label="Split PDF" />
          <Tab icon={<SecurityIcon />} label="Protect PDF" />
          <Tab icon={<TextSnippetIcon />} label="Extract Text" />
        </Tabs>

        {/* Common Upload UI for all tabs */}
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <input
            accept={tabValue === 1 ? "image/*" : tabValue === 2 ? ".docx" : ".pdf"}
            style={{ display: 'none' }}
            id="raised-button-file"
            multiple={tabValue === 0 || tabValue === 1} // Allow multiple for Merge and Image
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="raised-button-file">
            <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />} size="large" sx={{ mb: 2 }}>
              Select {tabValue === 1 ? "Images" : tabValue === 2 ? "Word Doc" : "PDF File"}
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
          {tabValue === 3 && (
            <Grid container spacing={2} justifyContent="center" sx={{ mb: 2 }}>
              <Grid size={4}>
                <TextField label="Start Page" type="number" fullWidth value={startPage} onChange={(e) => setStartPage(e.target.value)} />
              </Grid>
              <Grid size={4}>
                <TextField label="End Page" type="number" fullWidth value={endPage} onChange={(e) => setEndPage(e.target.value)} />
              </Grid>
            </Grid>
          )}

          {tabValue === 4 && (
            <Box sx={{ mb: 2, maxWidth: 300, mx: 'auto' }}>
              <TextField 
                label="Set Password" type="password" fullWidth 
                value={password} onChange={(e) => setPassword(e.target.value)} 
              />
            </Box>
          )}

          <Box sx={{ mt: 2 }}>
            <Button 
              variant="contained" 
              size="large" 
              disabled={!files || loading || (tabValue === 4 && !password)}
              onClick={() => handleSubmit(getEndpoint())}
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

export default PdfToolsPage;