import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { BlogPost } from '../index';
import { Box, CircularProgress, Typography, Alert, Container } from '@mui/material';
import { StoryView } from '../components/templates/StoryView';
import { JobView } from '../components/templates/JobView';
import { TechView } from '../components/templates/TechView';
import SEO from '../components/SEO';
import { Helmet } from 'react-helmet-async';

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      setError(null);
      try {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() } as BlogPost);
        }
      } catch (err: any) {
        console.error("Error fetching post:", err);
        setError(err.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <Box display="flex" justifyContent="center" p={10}><CircularProgress /></Box>;
  if (error) return <Container sx={{ py: 4 }}><Alert severity="error">Error: {error}</Alert></Container>;
  if (!post) return <Box p={4}><Typography variant="h5">Post not found</Typography></Box>;

  const seo = (
    <SEO 
      title={post.title} 
      description={`${post.title} - Read more about this in our ${post.category} section on Duniyadari.`}
      keywords={`${post.category}, ${post.title}, duniyadari`}
    />
  );

  // Generate Structured Data (JSON-LD) for Google Rich Results
  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
  
  // Default Schema for Articles/Stories
  let schemaData: any = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "datePublished": new Date(post.createdAt).toISOString(),
    "author": {
      "@type": "Organization",
      "name": "Duniyadari",
      "url": siteUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "Duniyadari",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`
      }
    }
  };

  // Specific Schema for Jobs
  if (post.category === 'government-jobs' || post.category === 'private-jobs') {
    const jobPost = post as any;
    schemaData = {
      ...schemaData,
      "@type": "JobPosting",
      "title": jobPost.title,
      "description": jobPost.requirements || jobPost.title,
      "hiringOrganization": {
        "@type": "Organization",
        "name": jobPost.company || "Duniyadari"
      },
      "datePosted": new Date(jobPost.createdAt).toISOString(),
      "validThrough": jobPost.applicationEndDate || undefined,
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "IN"
        }
      }
    };
  }

  // Render the correct template based on category
  switch (post.category) {
    case 'horror':
    case 'romantic':
      return (
        <>
          {seo}
          <Helmet>
            <script type="application/ld+json">
              {JSON.stringify(schemaData)}
            </script>
          </Helmet>
          <StoryView post={post as any} />
        </>
      );
    case 'government-jobs':
    case 'private-jobs':
      return (
        <>
          {seo}
          <Helmet>
            <script type="application/ld+json">
              {JSON.stringify(schemaData)}
            </script>
          </Helmet>
          <JobView post={post as any} />
        </>
      );
    case 'tech-space':
      return (
        <>
          {seo}
          <Helmet>
            <script type="application/ld+json">
              {JSON.stringify(schemaData)}
            </script>
          </Helmet>
          <TechView post={post as any} />
        </>
      );
    default:
      return <Box p={4}><Typography>Unknown Category</Typography></Box>;
  }
};

export default PostDetailPage;
