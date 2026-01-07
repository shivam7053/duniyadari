import React, { useState } from 'react';
import { 
  Container, Typography, Box, Paper, Grid, Select, MenuItem, 
  FormControl, InputLabel, IconButton, ToggleButton, ToggleButtonGroup, Tooltip
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SEO from '../components/SEO';
import { Helmet } from 'react-helmet-async';

// Moon Phase Calculation Helper
const getMoonPhase = (year: number, month: number, day: number) => {
  // Reference New Moon: January 6, 2000 at 12:24 UTC
  // We use UTC noon to avoid timezone shifting issues
  const date = new Date(Date.UTC(year, month, day, 12, 0, 0));
  const knownNewMoon = new Date(Date.UTC(2000, 0, 6, 12, 24, 0));
  
  const diffTime = date.getTime() - knownNewMoon.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  const lunarCycle = 29.53058867;
  
  // Calculate age of moon
  const lunarAge = (diffDays % lunarCycle + lunarCycle) % lunarCycle;
  
  // Map to 8 phases (0-7)
  const index = Math.round((lunarAge / lunarCycle) * 8) % 8;
  
  const phases = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];
  const names = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
  
  return { emoji: phases[index], name: names[index], isFullMoon: index === 4 };
};

const CalendarPage: React.FC = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [view, setView] = useState<'month' | 'year'>('month');

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1));
    }
  };

  const handleNextMonth = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1));
    }
  };

  const handleYearChange = (year: number) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
  };

  const handleMonthChange = (month: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), month, 1));
  };

  const handleViewChange = (_event: React.MouseEvent<HTMLElement>, newView: 'month' | 'year' | null) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 21 }, (_, i) => today.getFullYear() - 10 + i);

  // Render a single month grid
  const renderMonthGrid = (targetDate: Date, isCompact: boolean = false) => {
    const daysInMonth = getDaysInMonth(targetDate);
    const firstDay = getFirstDayOfMonth(targetDate);
    const monthIndex = targetDate.getMonth();
    const year = targetDate.getFullYear();

    const cells = [];
    // Padding
    for (let i = 0; i < firstDay; i++) {
      cells.push(<Grid size={1} key={`empty-${i}`} />);
    }
    // Days
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = 
        d === today.getDate() && 
        monthIndex === today.getMonth() && 
        year === today.getFullYear();
      
      const moon = getMoonPhase(year, monthIndex, d);

      cells.push(
        <Grid 
          size={1} 
          key={`day-${d}`} 
          sx={{ 
            height: isCompact ? 40 : { xs: 80, md: 110 }, 
            border: '1px solid', 
            borderColor: isToday ? 'primary.main' : 'divider',
            borderRadius: 1,
            p: isCompact ? 0.5 : 1,
            bgcolor: isToday ? 'primary.light' : 'background.paper',
            color: isToday ? 'white' : 'text.primary',
            position: 'relative',
            transition: 'all 0.2s',
            '&:hover': { bgcolor: isToday ? 'primary.main' : 'action.hover', transform: 'scale(1.02)', zIndex: 1, boxShadow: 2 },
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: isCompact ? 'center' : 'flex-start',
            alignItems: isCompact ? 'center' : 'flex-start'
          }}
        >
          <Typography fontWeight="bold" variant={isCompact ? "caption" : "body1"} sx={{ lineHeight: 1 }}>{d}</Typography>
          
          {/* Moon Phase */}
          <Tooltip title={moon.name} arrow>
            <Typography 
              variant={isCompact ? "caption" : "h5"} 
              sx={{ 
                mt: isCompact ? 0 : 'auto', 
                alignSelf: isCompact ? 'center' : 'flex-end',
                fontSize: isCompact ? '0.8rem' : '1.5rem',
                filter: moon.isFullMoon ? 'drop-shadow(0 0 4px gold)' : 'none'
              }}
            >
              {moon.emoji}
            </Typography>
          </Tooltip>
        </Grid>
      );
    }
    return cells;
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calendar & Moon Phases",
    "description": "View yearly and monthly calendar with moon phases. Track lunar cycles and plan your schedule.",
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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <SEO 
        title="Calendar with Moon Phases - Monthly & Yearly View" 
        description="Free online calendar with moon phases. View monthly and yearly calendars, track full moons, new moons, and lunar cycles."
        keywords="calendar, moon phases, lunar calendar, full moon dates, new moon dates, online calendar, yearly calendar, monthly calendar"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
            <Box display="flex" alignItems="center" gap={1}>
                <IconButton onClick={handlePrevMonth}><ArrowBackIosIcon fontSize="small" /></IconButton>
                <Typography variant="h4" sx={{ minWidth: 220, textAlign: 'center', fontWeight: 'bold' }}>
                  {view === 'month' ? `${months[currentDate.getMonth()]} ` : ''}{currentDate.getFullYear()}
                </Typography>
                <IconButton onClick={handleNextMonth}><ArrowForwardIosIcon fontSize="small" /></IconButton>
            </Box>

            <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                <ToggleButtonGroup
                  value={view}
                  exclusive
                  onChange={handleViewChange}
                  size="small"
                  color="primary"
                >
                  <ToggleButton value="month" aria-label="month view">
                    <CalendarViewMonthIcon sx={{ mr: 1 }} /> Month
                  </ToggleButton>
                  <ToggleButton value="year" aria-label="year view">
                    <CalendarMonthIcon sx={{ mr: 1 }} /> Year
                  </ToggleButton>
                </ToggleButtonGroup>

                {view === 'month' && (
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Month</InputLabel>
                    <Select 
                        value={currentDate.getMonth()} 
                        label="Month"
                        onChange={(e) => handleMonthChange(Number(e.target.value))}
                    >
                        {months.map((m, i) => <MenuItem key={i} value={i}>{m}</MenuItem>)}
                    </Select>
                </FormControl>
                )}
                <FormControl size="small" sx={{ minWidth: 100 }}>
                    <InputLabel>Year</InputLabel>
                    <Select 
                        value={currentDate.getFullYear()} 
                        label="Year"
                        onChange={(e) => handleYearChange(Number(e.target.value))}
                    >
                        {years.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                    </Select>
                </FormControl>
            </Box>
        </Box>

        {view === 'month' ? (
          <>
            {/* Weekday Headers */}
            <Grid container columns={7} spacing={1} sx={{ mb: 1 }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <Grid size={1} key={day} sx={{ textAlign: 'center', fontWeight: 'bold', color: 'text.secondary', py: 1 }}>
                        {day}
                    </Grid>
                ))}
            </Grid>

            {/* Month Grid */}
            <Grid container columns={7} spacing={1}>
                {renderMonthGrid(currentDate)}
            </Grid>
          </>
        ) : (
          /* Year Grid */
          <Grid container spacing={3}>
            {months.map((monthName, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={monthName}>
                <Paper variant="outlined" sx={{ p: 1 }}>
                  <Typography variant="subtitle1" align="center" fontWeight="bold" gutterBottom color="primary">
                    {monthName}
                  </Typography>
                  <Grid container columns={7} spacing={0.5}>
                    {['S','M','T','W','T','F','S'].map((d, i) => (
                      <Grid size={1} key={i} sx={{ textAlign: 'center', fontSize: '0.7rem', color: 'text.secondary' }}>{d}</Grid>
                    ))}
                    {renderMonthGrid(new Date(currentDate.getFullYear(), index, 1), true)}
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default CalendarPage;