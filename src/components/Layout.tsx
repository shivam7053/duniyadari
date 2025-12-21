import React from 'react';
import { Box, type PaletteMode } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  mode: PaletteMode;
  toggleTheme: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, mode, toggleTheme }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar mode={mode} toggleTheme={toggleTheme} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
