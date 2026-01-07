import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Paper, Grid, Card, CardContent, 
  Autocomplete, TextField, IconButton, keyframes
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DeleteIcon from '@mui/icons-material/Delete';
import SEO from '../components/SEO';
import { Helmet } from 'react-helmet-async';

// Comprehensive list of major timezones
const allTimeZones = [
  { name: 'Honolulu', zone: 'Pacific/Honolulu', country: 'USA' },
  { name: 'Anchorage', zone: 'America/Anchorage', country: 'USA' },
  { name: 'Los Angeles', zone: 'America/Los_Angeles', country: 'USA' },
  { name: 'Vancouver', zone: 'America/Vancouver', country: 'Canada' },
  { name: 'Denver', zone: 'America/Denver', country: 'USA' },
  { name: 'Chicago', zone: 'America/Chicago', country: 'USA' },
  { name: 'Mexico City', zone: 'America/Mexico_City', country: 'Mexico' },
  { name: 'New York', zone: 'America/New_York', country: 'USA' },
  { name: 'Toronto', zone: 'America/Toronto', country: 'Canada' },
  { name: 'Sao Paulo', zone: 'America/Sao_Paulo', country: 'Brazil' },
  { name: 'Buenos Aires', zone: 'America/Argentina/Buenos_Aires', country: 'Argentina' },
  { name: 'London', zone: 'Europe/London', country: 'UK' },
  { name: 'Paris', zone: 'Europe/Paris', country: 'France' },
  { name: 'Berlin', zone: 'Europe/Berlin', country: 'Germany' },
  { name: 'Rome', zone: 'Europe/Rome', country: 'Italy' },
  { name: 'Madrid', zone: 'Europe/Madrid', country: 'Spain' },
  { name: 'Moscow', zone: 'Europe/Moscow', country: 'Russia' },
  { name: 'Istanbul', zone: 'Europe/Istanbul', country: 'Turkey' },
  { name: 'Dubai', zone: 'Asia/Dubai', country: 'UAE' },
  { name: 'Riyadh', zone: 'Asia/Riyadh', country: 'Saudi Arabia' },
  { name: 'New Delhi', zone: 'Asia/Kolkata', country: 'India' },
  { name: 'Bangkok', zone: 'Asia/Bangkok', country: 'Thailand' },
  { name: 'Jakarta', zone: 'Asia/Jakarta', country: 'Indonesia' },
  { name: 'Singapore', zone: 'Asia/Singapore', country: 'Singapore' },
  { name: 'Hong Kong', zone: 'Asia/Hong_Kong', country: 'China' },
  { name: 'Shanghai', zone: 'Asia/Shanghai', country: 'China' },
  { name: 'Tokyo', zone: 'Asia/Tokyo', country: 'Japan' },
  { name: 'Seoul', zone: 'Asia/Seoul', country: 'South Korea' },
  { name: 'Sydney', zone: 'Australia/Sydney', country: 'Australia' },
  { name: 'Melbourne', zone: 'Australia/Melbourne', country: 'Australia' },
  { name: 'Auckland', zone: 'Pacific/Auckland', country: 'New Zealand' },
];

const spin = keyframes`
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(360deg); }
`;

const WorldClockPage: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [myCities, setMyCities] = useState([
    { name: 'New York', zone: 'America/New_York', country: 'USA' },
    { name: 'London', zone: 'Europe/London', country: 'UK' },
    { name: 'Paris', zone: 'Europe/Paris', country: 'France' },
    { name: 'Dubai', zone: 'Asia/Dubai', country: 'UAE' },
    { name: 'New Delhi', zone: 'Asia/Kolkata', country: 'India' },
    { name: 'Singapore', zone: 'Asia/Singapore', country: 'Singapore' },
    { name: 'Tokyo', zone: 'Asia/Tokyo', country: 'Japan' },
    { name: 'Sydney', zone: 'Australia/Sydney', country: 'Australia' },
    { name: 'Los Angeles', zone: 'America/Los_Angeles', country: 'USA' },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddCity = (_event: any, newValue: typeof allTimeZones[0] | null) => {
    if (newValue && !myCities.some(c => c.name === newValue.name)) {
      setMyCities([...myCities, newValue]);
    }
  };

  const handleRemoveCity = (cityName: string) => {
    setMyCities(myCities.filter(c => c.name !== cityName));
  };

  const formatTime = (date: Date, timeZone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
      timeZone,
    }).format(date);
  };

  const formatDate = (date: Date, timeZone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone,
    }).format(date);
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "World Clock",
    "description": "Check current time across major cities worldwide. Real-time world clock and time zone converter.",
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <SEO 
        title="World Clock - Current Time & Time Zones Worldwide" 
        description="Get the exact current local time in cities around the world. Accurate world clock, time zone converter, and daylight saving time information."
        keywords="world clock, current time, time zones, local time, utc time, gmt time, online clock, time converter, exact time"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>
      <Box textAlign="center" mb={6}>
        {/* Animated Globe */}
        <Box sx={{ mb: 2, display: 'inline-block', perspective: '500px' }}>
          <Box sx={{
            width: { xs: 80, md: 120 },
            height: { xs: 80, md: 120 },
            position: 'relative',
            transformStyle: 'preserve-3d',
            animation: `${spin} 20s linear infinite`,
          }}>
            {/* Globe Surface */}
            <Box sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: (theme) => `radial-gradient(circle at 25% 25%, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
              boxShadow: (theme) => `inset -15px -10px 30px ${theme.palette.primary.dark}`,
            }} />
            {/* Rings */}
            <Box sx={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '1px dashed', borderColor: 'primary.light', opacity: 0.3, transform: 'rotateY(30deg)' }} />
            <Box sx={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '1px dashed', borderColor: 'primary.light', opacity: 0.3, transform: 'rotateY(-30deg)' }} />
            <Box sx={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '1px dashed', borderColor: 'primary.light', opacity: 0.3, transform: 'rotateY(90deg)' }} />
            <Box sx={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '1px dashed', borderColor: 'primary.light', opacity: 0.3, transform: 'rotateX(90deg)' }} />
          </Box>
        </Box>

        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color="primary">
          World Clock
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Current local time and time zones around the world
        </Typography>
      </Box>

      {/* Current Local Time */}
      <Paper elevation={3} sx={{ p: 4, mb: 6, textAlign: 'center', bgcolor: 'primary.main', color: 'white', borderRadius: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ opacity: 0.9 }}>Your Local Time</Typography>
        <Typography variant="h2" fontWeight="bold">
          {time.toLocaleTimeString()}
        </Typography>
        <Typography variant="h5" sx={{ mt: 1, opacity: 0.9 }}>
          {time.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Typography>
      </Paper>

      {/* Add City Selector */}
      <Box sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
        <Autocomplete
          options={allTimeZones.filter(tz => !myCities.some(c => c.name === tz.name))}
          getOptionLabel={(option) => `${option.name}, ${option.country}`}
          onChange={handleAddCity}
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="Add City / Country" 
              variant="outlined" 
              placeholder="Search for a city..."
            />
          )}
        />
      </Box>

      <Grid container spacing={3}>
        {myCities.map((city) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={city.name}>
            <Card 
              elevation={2}
              sx={{ 
                height: '100%',
                position: 'relative',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 6, '& .delete-btn': { opacity: 1 } }
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Box display="flex" justifyContent="center" alignItems="center" mb={2} color="primary.main">
                  <AccessTimeIcon sx={{ mr: 1 }} />
                  <Typography variant="h6" component="div" fontWeight="bold">
                    {city.name}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {city.country}
                </Typography>
                <Typography variant="h4" component="div" sx={{ my: 2, fontWeight: 'medium' }}>
                  {formatTime(time, city.zone)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(time, city.zone)}
                </Typography>
                <IconButton 
                  className="delete-btn"
                  size="small" 
                  onClick={() => handleRemoveCity(city.name)}
                  sx={{ position: 'absolute', top: 8, right: 8, opacity: 0, transition: 'opacity 0.2s' }}
                >
                  <DeleteIcon fontSize="small" color="action" />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default WorldClockPage;