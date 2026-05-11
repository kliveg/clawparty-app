// API 数据类型定义
export interface Tutorial {
  id: number;
  title: string;
  description: string;
  author: string;
  level: string;
  coverImage?: string;
  createTime: string;
  updateTime: string;
  views: number;
  likes: number;
  shares: number;
}

export interface Resource {
  id: number;
  title: string;
  description: string;
  type: string;
  tags: string[];
  author: string;
  date: string;
  downloadCount: number;
  fileSize: string;
  downloadUrl: string;
  likes?: number;
}

export interface Post {
  id: number;
  username: string;
  avatar: string;
  time: string;
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  isLiked: boolean;
  isTop?: boolean;
  category: string;
}

export interface User {
  id: number;
  username: string;
  avatar: string;
  level: number;
  title: string;
  posts: number;
  followers: number;
  following: number;
  bio: string;
  joinDate: string;
}