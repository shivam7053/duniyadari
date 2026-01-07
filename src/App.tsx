import { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, Typography, type PaletteMode } from '@mui/material';
import { getAppTheme } from './theme/theme';
import Layout from './components/Layout';
import SEO from './components/SEO';
import AdminPage from './pages/AdminPage';
import CategoryListPage from './pages/CategoryListPage';
import PostDetailPage from './pages/PostDetailPage';
import PdfToolsPage from './pages/PdfToolsPage';
import DocToolsPage from './pages/DocToolsPage';
import ImageToolsPage from './pages/ImageToolsPage';
import CalendarPage from './pages/CalendarPage';
import WorldClockPage from './pages/WorldClockPage';

// Placeholder components for now
const Home = () => (
  <Box p={4}>
    <SEO title="Home" description="Duniyadari - Your daily source for stories, government jobs, private jobs, and technology news." />
    <Typography variant="h4">Welcome to the Blog</Typography>
  </Box>
);

function App() {
  const [mode, setMode] = useState<PaletteMode>('light');

  const theme = useMemo(() => getAppTheme(mode), [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalizes CSS */}
      <Router>
        <Layout mode={mode} toggleTheme={toggleTheme}>
          <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Stories Routes */}
          <Route path="/stories/horror" element={<CategoryListPage category="horror" title="Horror Stories" />} />
          <Route path="/stories/romantic" element={<CategoryListPage category="romantic" title="Romantic Stories" />} />
          
          {/* Category Routes */}
          <Route path="/category/government-jobs" element={<CategoryListPage category="government-jobs" title="Government Jobs" />} />
          <Route path="/category/tech-space" element={<CategoryListPage category="tech-space" title="Technology & Space" />} />
          <Route path="/category/private-jobs" element={<CategoryListPage category="private-jobs" title="Private Jobs" />} />
          
          {/* Dynamic Post Route */}
          <Route path="/post/:id" element={<PostDetailPage />} />
          
          {/* Tools Route */}
          <Route path="/tools/pdf" element={<PdfToolsPage />} />
          <Route path="/tools/doc" element={<DocToolsPage />} />
          <Route path="/tools/image" element={<ImageToolsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/tools/world-clock" element={<WorldClockPage />} />

          {/* Admin Route */}
          <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
