import React, { useState } from 'react';
import { 
  Container, Typography, Box, Paper, Tabs, Tab, Button, 
<<<<<<< HEAD
  CircularProgress, Alert, TextField, Grid, MenuItem 
=======
  CircularProgress, Alert, TextField, Grid 
>>>>>>> df89fc36aa132a2c8ad7021dda1781cfb54b7662
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import SecurityIcon from '@mui/icons-material/Security';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
<<<<<<< HEAD
import CompressIcon from '@mui/icons-material/Compress';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
=======
>>>>>>> df89fc36aa132a2c8ad7021dda1781cfb54b7662
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
<<<<<<< HEAD
  const [rotation, setRotation] = useState('90');
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://duniyadari-api.onrender.com'; 
=======

  // Use environment variable or fallback to localhost
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'; 
>>>>>>> df89fc36aa132a2c8ad7021dda1781cfb54b7662

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setFiles(null);
    setError('');
    setPassword('');
    setStartPage('1');
    setEndPage('5');
<<<<<<< HEAD
    setRotation('90');
    setWatermarkText('CONFIDENTIAL');
=======
>>>>>>> df89fc36aa132a2c8ad7021dda1781cfb54b7662
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFiles(event.target.files);
      setError('');
    }
  };

<<<<<<< HEAD
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
=======
  const handleSubmit = async (endpoint: string) => {
>>>>>>> df89fc36aa132a2c8ad7021dda1781cfb54b7662
    if (!files || files.length === 0) {
      setError('Please select files first.');
      return;
    }

<<<<<<< HEAD
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

=======
>>>>>>> df89fc36aa132a2c8ad7021dda1781cfb54b7662
    setLoading(true);
    setError('');
    const formData = new FormData();
    
<<<<<<< HEAD
=======
    // Append all selected files
>>>>>>> df89fc36aa132a2c8ad7021dda1781cfb54b7662
    Array.from(files).forEach((file) => {
      formData.append('files', file);
    });

<<<<<<< HEAD
    if (endpoint === 'protect-pdf' || endpoint === 'unlock-pdf') {
=======
    // Append extra fields based on tool
    if (endpoint === 'protect-pdf') {
>>>>>>> df89fc36aa132a2c8ad7021dda1781cfb54b7662
      formData.append('password', password);
    } else if (endpoint === 'split-pdf') {
      formData.append('start', startPage);
      formData.append('end', endPage);
<<<<<<< HEAD
    } else if (endpoint === 'rotate-pdf') {
      formData.append('rotation', rotation);
    } else if (endpoint === 'watermark-pdf') {
      formData.append('text', watermarkText);
=======
>>>>>>> df89fc36aa132a2c8ad7021dda1781cfb54b7662
    }

    try {
      const response = await fetch(`${BACKEND_URL}/${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Processing failed');

<<<<<<< HEAD
=======
      // Handle file download
>>>>>>> df89fc36aa132a2c8ad7021dda1781cfb54b7662
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

<<<<<<< HEAD
=======
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

>>>>>>> df89fc36aa132a2c8ad7021dda1781cfb54b7662
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "PDF Tools",
<<<<<<< HEAD
    "description": "Free online PDF tools. Merge, Split, Compress, Rotate, Protect, Unlock, Watermark PDF files and more.",
=======
    "description": "Free online PDF tools. Merge PDF, Image to PDF, Doc to PDF, Split PDF, Protect PDF, and Extract Text.",
>>>>>>> df89fc36aa132a2c8ad7021dda1781cfb54b7662
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
<<<<<<< HEAD
        title="PDF Tools - Merge, Split, Compress, Rotate & Protect" 
        description="Free online PDF tools. Merge PDF, Image to PDF, Doc to PDF, Split, Compress, Rotate, Protect, Unlock, and Watermark PDFs."
        keywords="pdf tools, merge pdf, split pdf, compress pdf, rotate pdf, protect pdf, unlock pdf, watermark pdf"
=======
        title="PDF Tools - Merge, Split, Convert & Protect" 
        description="Free online PDF tools. Merge PDF, Image to PDF, Doc to PDF, Split PDF, Protect PDF, and Extract Text. Fast, secure, and easy to use."
        keywords="pdf tools, merge pdf, split pdf, pdf converter, image to pdf"
>>>>>>> df89fc36aa132a2c8ad7021dda1781cfb54b7662
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
<<<<<<< HEAD
        Secure, fast & free PDF utilities - All-in-one solution
=======
        Securely process your documents using our high-speed tools.
>>>>>>> df89fc36aa132a2c8ad7021dda1781cfb54b7662
      </Typography>

      <Paper elevation={3}>
        <Tabs value={tabValue} onChange={handleTabChange} centered variant="scrollable" scrollButtons="auto">
<<<<<<< HEAD
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
=======
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
>>>>>>> df89fc36aa132a2c8ad7021dda1781cfb54b7662
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="raised-button-file">
            <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />} size="large" sx={{ mb: 2 }}>
<<<<<<< HEAD
              {getButtonLabel()}
=======
              Select {tabValue === 1 ? "Images" : tabValue === 2 ? "Word Doc" : "PDF File"}
>>>>>>> df89fc36aa132a2c8ad7021dda1781cfb54b7662
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
<<<<<<< HEAD
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
=======
>>>>>>> df89fc36aa132a2c8ad7021dda1781cfb54b7662
              />
            </Box>
          )}

          <Box sx={{ mt: 2 }}>
            <Button 
              variant="contained" 
              size="large" 
<<<<<<< HEAD
              disabled={!files || loading}
              onClick={handleSubmit}
=======
              disabled={!files || loading || (tabValue === 4 && !password)}
              onClick={() => handleSubmit(getEndpoint())}
>>>>>>> df89fc36aa132a2c8ad7021dda1781cfb54b7662
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