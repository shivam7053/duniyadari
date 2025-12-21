import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, Typography, CardActionArea, CircularProgress, Box, Alert } from '@mui/material';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import type { BlogPost, Category } from '../index';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { Helmet } from 'react-helmet-async';

interface Props {
  category: Category;
  title: string;
}

const CategoryListPage: React.FC<Props> = ({ category, title }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const q = query(collection(db, 'posts'), where('category', '==', category));
        const querySnapshot = await getDocs(q);
        const fetchedPosts: BlogPost[] = [];
        querySnapshot.forEach((doc) => {
          fetchedPosts.push({ id: doc.id, ...doc.data() } as BlogPost);
        });
        setPosts(fetchedPosts);
      } catch (err: any) {
        console.error("Error fetching posts:", err);
        setError(err.message || 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [category]);

  if (loading) return <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>;
  if (error) return <Container sx={{ py: 4 }}><Alert severity="error">Error loading content: {error}</Alert></Container>;

  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
  const description = `Browse our latest ${title}. Read stories, find jobs, and explore technology news on Duniyadari.`;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "headline": title,
    "description": description,
    "url": window.location.href,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": posts.map((post, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${siteUrl}/post/${post.id}`,
        "name": post.title
      }))
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <SEO 
        title={title} 
        description={description}
        keywords={`${category}, ${title}, blog, duniyadari`}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>
      <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 4, borderBottom: 2, borderColor: 'primary.main', display: 'inline-block' }}>
        {title}
      </Typography>
      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
            <Card sx={{ height: '100%' }}>
              <CardActionArea onClick={() => navigate(`/post/${post.id}`)} sx={{ height: '100%', p: 2 }}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
        {posts.length === 0 && (
          <Grid size={12}>
            <Typography variant="h6" color="text.secondary">No posts found in this category yet.</Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default CategoryListPage;
