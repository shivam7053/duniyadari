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
import { getDirectImageUrl } from '../utils';

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

  const metaDescription = post.seoDescription || post.excerpt || `${post.title} - Read more about this in our ${post.category} section on Duniyadari.`;
  const metaKeywords = post.seoKeywords?.length 
    ? post.seoKeywords.join(', ') 
    : (post.tags?.join(', ') || `${post.category}, ${post.title}, duniyadari`);

  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
  const imageUrl = post.coverImage ? getDirectImageUrl(post.coverImage) : undefined;

  const seo = (
    <SEO 
      title={post.title} 
      description={metaDescription}
      keywords={metaKeywords}
      image={imageUrl}
      type="article"
    />
  );

  
  // Default Schema for Articles/Stories
  let schemaData: any = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": metaDescription,
    "image": imageUrl ? [imageUrl] : undefined,
    "datePublished": new Date(post.createdAt).toISOString(),
    "dateModified": new Date(post.updatedAt || post.createdAt).toISOString(),
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
    let companyName = "Duniyadari";
    let jobDescription = post.excerpt || metaDescription;

    // Attempt to parse company from the first topic's content
    const firstTopicContent = post.topics?.[0]?.content || '';
    const companyMatch = firstTopicContent.match(/\*\*Company:\*\*\s*(.*)/);
    if (companyMatch && companyMatch[1]) {
      companyName = companyMatch[1].trim();
    }

    schemaData = {
      ...schemaData,
      "@type": "JobPosting",
      "title": post.title,
      "description": jobDescription,
      "hiringOrganization": {
        "@type": "Organization",
        "name": companyName
      },
      "datePosted": new Date(post.createdAt).toISOString(),
      // "validThrough" is no longer available in the new structure
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
          <StoryView post={post} />
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
          <JobView post={post} />
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
          <TechView post={post} />
        </>
      );
    default:
      return <Box p={4}><Typography>Unknown Category</Typography></Box>;
  }
};

export default PostDetailPage;
