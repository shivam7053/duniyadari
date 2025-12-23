import React, { useState } from 'react';
import { 
  Container, Typography, Box, Paper, Tabs, Tab, Button, 
  CircularProgress, Alert, TextField, Grid, MenuItem 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import SecurityIcon from '@mui/icons-material/Security';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import CompressIcon from '@mui/icons-material/Compress';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
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
  const [rotation, setRotation] = useState('90');
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://duniyadari-api.onrender.com'; 

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setFiles(null);
    setError('');
    setPassword('');
    setStartPage('1');
    setEndPage('5');
    setRotation('90');
    setWatermarkText('CONFIDENTIAL');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFiles(event.target.files);
      setError('');
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
      case 6: return 'compress-pdf';
      case 7: return 'rotate-pdf';
      case 8: return 'unlock-pdf';
      case 9: return 'watermark-pdf';
      default: return '';
    }
  };

  const getAcceptType = () => {
    if (tabValue === 1) return 'image/*';
    if (tabValue === 2) return '.docx';
    return '.pdf';
  };

  const getButtonLabel = () => {
    if (tabValue === 1) return 'Select Images';
    if (tabValue === 2) return 'Select Word Doc';
    return 'Select PDF File';
  };

  const handleSubmit = async () => {
    if (!files || files.length === 0) {
      setError('Please select files first.');
      return;
    }

    const endpoint = getEndpoint();

    // Validation
    if (endpoint === 'protect-pdf' && !password) {
      setError('Please enter a password.');
      return;
    }
    if (endpoint === 'unlock-pdf' && !password) {
      setError('Please enter the PDF password.');
      return;
    }

    setLoading(true);
    setError('');
    const formData = new FormData();
    
    Array.from(files).forEach((file) => {
      formData.append('files', file);
    });

    if (endpoint === 'protect-pdf' || endpoint === 'unlock-pdf') {
      formData.append('password', password);
    } else if (endpoint === 'split-pdf') {
      formData.append('start', startPage);
      formData.append('end', endPage);
    } else if (endpoint === 'rotate-pdf') {
      formData.append('rotation', rotation);
    } else if (endpoint === 'watermark-pdf') {
      formData.append('text', watermarkText);
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

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "PDF Tools",
    "description": "Free online PDF tools. Merge, Split, Compress, Rotate, Protect, Unlock, Watermark PDF files and more.",
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
        title="PDF Tools - Merge, Split, Compress, Rotate & Protect" 
        description="Free online PDF tools. Merge PDF, Image to PDF, Doc to PDF, Split, Compress, Rotate, Protect, Unlock, and Watermark PDFs."
        keywords="pdf tools, merge pdf, split pdf, compress pdf, rotate pdf, protect pdf, unlock pdf, watermark pdf"
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
        Secure, fast & free PDF utilities - All-in-one solution
      </Typography>

      <Paper elevation={3}>
        <Tabs value={tabValue} onChange={handleTabChange} centered variant="scrollable" scrollButtons="auto">
          <Tab icon={<MergeTypeIcon />} label="Merge" />
          <Tab icon={<ImageIcon />} label="Image → PDF" />
          <Tab icon={<PictureAsPdfIcon />} label="Doc → PDF" />
          <Tab icon={<ContentCutIcon />} label="Split" />
          <Tab icon={<SecurityIcon />} label="Protect" />
          <Tab icon={<TextSnippetIcon />} label="Extract Text" />
          <Tab icon={<CompressIcon />} label="Compress" />
          <Tab icon={<RotateRightIcon />} label="Rotate" />
          <Tab icon={<LockOpenIcon />} label="Unlock" />
          <Tab icon={<AutoFixHighIcon />} label="Watermark" />
        </Tabs>

        <Box sx={{ p: 4, textAlign: 'center' }}>
          <input
            accept={getAcceptType()}
            style={{ display: 'none' }}
            id="raised-button-file"
            multiple={tabValue === 0 || tabValue === 1}
            type="file"
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
                placeholder="Enter a strong password"
              />
            </Box>
          )}

          {tabValue === 7 && (
            <Box sx={{ mb: 2, maxWidth: 300, mx: 'auto' }}>
              <TextField 
                select
                label="Rotation Angle" 
                fullWidth 
                value={rotation} 
                onChange={(e) => setRotation(e.target.value)}
              >
                <MenuItem value="90">90° Clockwise</MenuItem>
                <MenuItem value="180">180°</MenuItem>
                <MenuItem value="270">270° Clockwise</MenuItem>
              </TextField>
            </Box>
          )}

          {tabValue === 8 && (
            <Box sx={{ mb: 2, maxWidth: 300, mx: 'auto' }}>
              <TextField 
                label="PDF Password" type="password" fullWidth 
                value={password} onChange={(e) => setPassword(e.target.value)} 
                placeholder="Enter PDF password to unlock"
              />
            </Box>
          )}

          {tabValue === 9 && (
            <Box sx={{ mb: 2, maxWidth: 300, mx: 'auto' }}>
              <TextField 
                label="Watermark Text" 
                fullWidth 
                value={watermarkText} 
                onChange={(e) => setWatermarkText(e.target.value)} 
                placeholder="Enter watermark text"
              />
            </Box>
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

export default PdfToolsPage;