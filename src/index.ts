export type Category = 'horror' | 'romantic' | 'government-jobs' | 'tech-space' | 'private-jobs';

// Base interface for common fields
interface BasePost {
  id?: string;
  title: string;
  createdAt: number;
  category: Category;
}

// 1. Stories: Multiple rows of text + image
export interface StorySegment {
  text: string;
  imageUrl: string;
}

export interface StoryPost extends BasePost {
  category: 'horror' | 'romantic';
  segments: StorySegment[];
}

// 2. Jobs: Specific job details
export interface JobPost extends BasePost {
  category: 'government-jobs' | 'private-jobs';
  sector: string;
  department: string;
  company: string;
  requirements: string;
  applicationStartDate: string;
  applicationEndDate: string;
}

// 3. Tech & Space: Simple blog with hero image
export interface TechPost extends BasePost {
  category: 'tech-space';
  heroImageUrl: string;
  content: string;
}

export type BlogPost = StoryPost | JobPost | TechPost;