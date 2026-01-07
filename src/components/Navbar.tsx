import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Menu, 
  MenuItem, 
  Box, 
  Container,
  IconButton,
  type PaletteMode
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  mode: PaletteMode;
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ mode, toggleTheme }) => {
  const navigate = useNavigate();
  
  // State for the Stories Dropdown
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // State for the Jobs Dropdown
  const [anchorElJobs, setAnchorElJobs] = useState<null | HTMLElement>(null);
  const openJobs = Boolean(anchorElJobs);

  // State for Date & Time Dropdown
  const [anchorElDateTime, setAnchorElDateTime] = useState<null | HTMLElement>(null);
  const openDateTime = Boolean(anchorElDateTime);

  const handleStoriesClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleJobsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElJobs(event.currentTarget);
  };

  const handleDateTimeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElDateTime(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElJobs(null);
    setAnchorElDateTime(null);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleClose();
  };

  return (
    <AppBar position="sticky" color="default" elevation={1} sx={{ top: 0, zIndex: 1100 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo / Brand Name */}
          <Box
            sx={{ mr: 4, display: { xs: 'none', md: 'flex' }, flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => handleNavigate('/')}
          >
            <Box
              component="img"
              src="/logo.png"
              alt="duniyadari"
              sx={{ height: 40 }}
            />
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', lineHeight: 1, mt: 0.5, color: 'primary.main' }}>
              duniyadari
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            
            {/* Stories Dropdown */}
            <Box>
              <Button
                id="stories-button"
                aria-controls={open ? 'stories-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleStoriesClick}
                endIcon={<KeyboardArrowDownIcon />}
                color="inherit"
              >
                Stories
              </Button>
              <Menu
                id="stories-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'stories-button',
                }}
              >
                <MenuItem onClick={() => handleNavigate('/stories/horror')}>Horror Stories</MenuItem>
                <MenuItem onClick={() => handleNavigate('/stories/romantic')}>Romantic Stories</MenuItem>
              </Menu>
            </Box>

            {/* Jobs Dropdown */}
            <Box>
              <Button
                id="jobs-button"
                aria-controls={openJobs ? 'jobs-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openJobs ? 'true' : undefined}
                onClick={handleJobsClick}
                endIcon={<KeyboardArrowDownIcon />}
                color="inherit"
              >
                Jobs
              </Button>
              <Menu
                id="jobs-menu"
                anchorEl={anchorElJobs}
                open={openJobs}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'jobs-button',
                }}
              >
                <MenuItem onClick={() => handleNavigate('/category/government-jobs')}>Government Job</MenuItem>
                <MenuItem onClick={() => handleNavigate('/category/private-jobs')}>Private Job</MenuItem>
              </Menu>
            </Box>

            {/* Other Categories */}
            <Button color="inherit" onClick={() => handleNavigate('/category/tech-space')}>
              Technology & Space
            </Button>
            <Button color="inherit" onClick={() => handleNavigate('/tools/pdf')}>
              PDF Tools
            </Button>
            <Button color="inherit" onClick={() => handleNavigate('/tools/doc')}>
              Doc Tools
            </Button>
            <Button color="inherit" onClick={() => handleNavigate('/tools/image')}>
              Image Tools
            </Button>
            
            {/* Date & Time Dropdown */}
            <Box>
              <Button
                id="datetime-button"
                aria-controls={openDateTime ? 'datetime-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openDateTime ? 'true' : undefined}
                onClick={handleDateTimeClick}
                endIcon={<KeyboardArrowDownIcon />}
                color="inherit"
              >
                Date & Time
              </Button>
              <Menu
                id="datetime-menu"
                anchorEl={anchorElDateTime}
                open={openDateTime}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'datetime-button',
                }}
              >
                <MenuItem onClick={() => handleNavigate('/calendar')}>Calendar</MenuItem>
                <MenuItem onClick={() => handleNavigate('/tools/world-clock')}>World Clock</MenuItem>
              </Menu>
            </Box>
          </Box>

          {/* Theme Toggle (Right side) */}
          <Box sx={{ flexGrow: 0 }}>
            <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
