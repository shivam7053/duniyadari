import React, { useState } from 'react';
import { 
  Container, Typography, Box, Paper, Tabs, Tab, Button, 
  CircularProgress, Alert, TextField, Grid, MenuItem 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PhotoSizeSelectSmallIcon from '@mui/icons-material/PhotoSizeSelectSmall';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import CropIcon from '@mui/icons-material/Crop';
import TransformIcon from '@mui/icons-material/Transform';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import FlipIcon from '@mui/icons-material/Flip';
import TuneIcon from '@mui/icons-material/Tune';
import BlurOnIcon from '@mui/icons-material/BlurOn';
import WatermarkIcon from '@mui/icons-material/BrandingWatermark';
import SEO from '../components/SEO';
import { Helmet } from 'react-helmet-async';

const ImageToolsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Tool specific states
  const [quality, setQuality] = useState('80');
  const [width, setWidth] = useState('800');
  const [height, setHeight] = useState('600');
  const [cropX, setCropX] = useState('0');
  const [cropY, setCropY] = useState('0');
  const [format, setFormat] = useState('PNG');
  const [rotation, setRotation] = useState('90');
  const [flipDirection, setFlipDirection] = useState('horizontal');
  const [brightness, setBrightness] = useState('1.0');
  const [contrast, setContrast] = useState('1.0');
  const [blurRadius, setBlurRadius] = useState('2');
  const [watermarkText, setWatermarkText] = useState('Sample');

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://duniyadari-api.onrender.com'; 

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setFiles(null);
    setError('');
    setQuality('80');
    setWidth('800');
    setHeight('600');
    setCropX('0');
    setCropY('0');
    setFormat('PNG');
    setRotation('90');
    setFlipDirection('horizontal');
    setBrightness('1.0');
    setContrast('1.0');
    setBlurRadius('2');
    setWatermarkText('Sample');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFiles(event.target.files);
      setError('');
    }
  };

  const getEndpoint = () => {
    switch(tabValue) {
      case 0: return 'compress-img';
      case 1: return 'resize-img';
      case 2: return 'crop-img';
      case 3: return 'convert-img';
      case 4: return 'rotate-img';
      case 5: return 'flip-img';
      case 6: return 'adjust-img';
      case 7: return 'blur-img';
      case 8: return 'watermark-img';
      default: return '';
    }
  };

  const handleSubmit = async () => {
    if (!files || files.length === 0) {
      setError('Please select an image first.');
      return;
    }

    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('files', files[0]);

    const endpoint = getEndpoint();

    if (endpoint === 'compress-img') {
      formData.append('quality', quality);
    } else if (endpoint === 'resize-img') {
      formData.append('width', width);
      formData.append('height', height);
    } else if (endpoint === 'crop-img') {
      formData.append('left', cropX);
      formData.append('top', cropY);
      formData.append('width', width);
      formData.append('height', height);
    } else if (endpoint === 'convert-img') {
      formData.append('format', format);
    } else if (endpoint === 'rotate-img') {
      formData.append('angle', rotation);
    } else if (endpoint === 'flip-img') {
      formData.append('direction', flipDirection);
    } else if (endpoint === 'adjust-img') {
      formData.append('brightness', brightness);
      formData.append('contrast', contrast);
    } else if (endpoint === 'blur-img') {
      formData.append('radius', blurRadius);
    } else if (endpoint === 'watermark-img') {
      formData.append('text', watermarkText);
    }

    try {
      const response = await fetch(`${BACKEND_URL}/${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || 'Processing failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const mimeType = blob.type;
      let ext = mimeType.split('/')[1] || 'png';
      if (ext === 'jpeg') ext = 'jpg';
      
      a.download = `processed_image.${ext}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to process image. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Image Tools",
    "description": "Free online Image tools. Compress, Resize, Crop, Convert, Rotate, Flip, Adjust, Blur, and Watermark images.",
    "url": window.location.href,
    "applicationCategory": "MultimediaApplication",
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
        title="Image Tools - Compress, Resize, Crop, Convert & More" 
        description="Free online Image tools. Compress, Resize, Crop, Convert, Rotate, Flip, Adjust, Blur, and Watermark your images."
        keywords="image tools, compress image, resize image, crop image, convert image, rotate image, flip image"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>
      <Typography variant="h3" gutterBottom align="center" color="primary">
        Image Tools
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Compress, resize, crop, convert & enhance your images
      </Typography>

      <Paper elevation={3}>
        <Tabs value={tabValue} onChange={handleTabChange} centered variant="scrollable" scrollButtons="auto">
          <Tab icon={<PhotoSizeSelectSmallIcon />} label="Compress" />
          <Tab icon={<AspectRatioIcon />} label="Resize" />
          <Tab icon={<CropIcon />} label="Crop" />
          <Tab icon={<TransformIcon />} label="Convert" />
          <Tab icon={<RotateRightIcon />} label="Rotate" />
          <Tab icon={<FlipIcon />} label="Flip" />
          <Tab icon={<TuneIcon />} label="Adjust" />
          <Tab icon={<BlurOnIcon />} label="Blur" />
          <Tab icon={<WatermarkIcon />} label="Watermark" />
        </Tabs>

        <Box sx={{ p: 4, textAlign: 'center' }}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="raised-button-file"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="raised-button-file">
            <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />} size="large" sx={{ mb: 2 }}>
              Select Image
            </Button>
          </label>
          
          {files && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">Selected: {files[0].name}</Typography>
            </Box>
          )}

          {/* Dynamic Inputs */}
          {tabValue === 0 && (
            <Box sx={{ maxWidth: 200, mx: 'auto', mb: 2 }}>
              <TextField 
                label="Quality (1-100)" type="number" fullWidth 
                value={quality} onChange={(e) => setQuality(e.target.value)} 
                inputProps={{ min: 1, max: 100 }}
              />
            </Box>
          )}

          {tabValue === 1 && (
            <Grid container spacing={2} justifyContent="center" sx={{ mb: 2 }}>
              <Grid size={4}>
                <TextField label="Width (px)" type="number" fullWidth value={width} onChange={(e) => setWidth(e.target.value)} inputProps={{ min: 1 }} />
              </Grid>
              <Grid size={4}>
                <TextField label="Height (px)" type="number" fullWidth value={height} onChange={(e) => setHeight(e.target.value)} inputProps={{ min: 1 }} />
              </Grid>
            </Grid>
          )}

          {tabValue === 2 && (
            <Grid container spacing={2} justifyContent="center" sx={{ mb: 2 }}>
              <Grid size={3}>
                <TextField label="X (Left)" type="number" fullWidth value={cropX} onChange={(e) => setCropX(e.target.value)} inputProps={{ min: 0 }} />
              </Grid>
              <Grid size={3}>
                <TextField label="Y (Top)" type="number" fullWidth value={cropY} onChange={(e) => setCropY(e.target.value)} inputProps={{ min: 0 }} />
              </Grid>
              <Grid size={3}>
                <TextField label="Width" type="number" fullWidth value={width} onChange={(e) => setWidth(e.target.value)} inputProps={{ min: 1 }} />
              </Grid>
              <Grid size={3}>
                <TextField label="Height" type="number" fullWidth value={height} onChange={(e) => setHeight(e.target.value)} inputProps={{ min: 1 }} />
              </Grid>
            </Grid>
          )}

          {tabValue === 3 && (
            <Box sx={{ maxWidth: 200, mx: 'auto', mb: 2 }}>
              <TextField select label="Target Format" fullWidth value={format} onChange={(e) => setFormat(e.target.value)}>
                <MenuItem value="PNG">PNG</MenuItem>
                <MenuItem value="JPEG">JPEG</MenuItem>
                <MenuItem value="WEBP">WEBP</MenuItem>
                <MenuItem value="BMP">BMP</MenuItem>
              </TextField>
            </Box>
          )}

          {tabValue === 4 && (
            <Box sx={{ maxWidth: 200, mx: 'auto', mb: 2 }}>
              <TextField select label="Rotation Angle" fullWidth value={rotation} onChange={(e) => setRotation(e.target.value)}>
                <MenuItem value="90">90° Clockwise</MenuItem>
                <MenuItem value="180">180°</MenuItem>
                <MenuItem value="270">270° Clockwise</MenuItem>
              </TextField>
            </Box>
          )}

          {tabValue === 5 && (
            <Box sx={{ maxWidth: 200, mx: 'auto', mb: 2 }}>
              <TextField select label="Flip Direction" fullWidth value={flipDirection} onChange={(e) => setFlipDirection(e.target.value)}>
                <MenuItem value="horizontal">Horizontal</MenuItem>
                <MenuItem value="vertical">Vertical</MenuItem>
              </TextField>
            </Box>
          )}

          {tabValue === 6 && (
            <Grid container spacing={2} justifyContent="center" sx={{ mb: 2 }}>
              <Grid size={4}>
                <TextField 
                  label="Brightness (0.5-2.0)" 
                  type="number" 
                  fullWidth 
                  value={brightness} 
                  onChange={(e) => setBrightness(e.target.value)} 
                  inputProps={{ min: 0.5, max: 2.0, step: 0.1 }}
                />
              </Grid>
              <Grid size={4}>
                <TextField 
                  label="Contrast (0.5-2.0)" 
                  type="number" 
                  fullWidth 
                  value={contrast} 
                  onChange={(e) => setContrast(e.target.value)} 
                  inputProps={{ min: 0.5, max: 2.0, step: 0.1 }}
                />
              </Grid>
            </Grid>
          )}

          {tabValue === 7 && (
            <Box sx={{ maxWidth: 200, mx: 'auto', mb: 2 }}>
              <TextField 
                label="Blur Radius (1-10)" 
                type="number" 
                fullWidth 
                value={blurRadius} 
                onChange={(e) => setBlurRadius(e.target.value)} 
                inputProps={{ min: 1, max: 10 }}
              />
            </Box>
          )}

          {tabValue === 8 && (
            <Box sx={{ maxWidth: 300, mx: 'auto', mb: 2 }}>
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
            <Button variant="contained" size="large" disabled={!files || loading} onClick={handleSubmit}>
              {loading ? <CircularProgress size={24} /> : 'Process Image'}
            </Button>
          </Box>

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </Box>
      </Paper>
    </Container>
  );
};

export default ImageToolsPage;