// 社区相关API
import { Post } from './types';

// Mock数据
const mockPosts: Post[] = [
  {
    id: 1,
    username: 'AI探索者',
    avatar: '/static/images/avatar1.png',
    time: '2小时前',
    content: '大家好，我想请教一下关于AI Agent记忆系统的设计方案。目前我在做一个需要长期记忆的Agent项目，大家有什么好的实现思路吗？',
    likes: 15,
    comments: 8,
    isLiked: false,
    isTop: true,
    category: '求助答疑'
  },
  {
    id: 2,
    username: '代码工匠',
    avatar: '/static/images/avatar2.png',
    time: '5小时前',
    content: '分享一个最近开发的多模态Agent项目经验，整合了文本、图像识别和语音处理功能，感觉效果还不错！',
    images: [
      '/static/images/post-img1.jpg',
      '/static/images/post-img2.jpg'
    ],
    likes: 32,
    comments: 12,
    isLiked: true,
    isTop: false,
    category: '经验分享'
  },
  {
    id: 3,
    username: '算法研究员',
    avatar: '/static/images/avatar3.png',
    time: '昨天',
    content: '关于大模型微调的一些心得总结，特别是针对特定领域任务的优化策略，希望对大家有帮助。',
    likes: 45,
    comments: 20,
    isLiked: false,
    isTop: false,
    category: '技术讨论'
  },
  {
    id: 4,
    username: '前端开发者',
    avatar: '/static/images/avatar4.png',
    time: '1天前',
    content: '有没有人遇到过Agent响应延迟的问题？我在生产环境中遇到了性能瓶颈，正在寻找优化方案。',
    likes: 8,
    comments: 5,
    isLiked: false,
    isTop: false,
    category: '求助答疑'
  },
  {
    id: 5,
    username: 'AI架构师',
    avatar: '/static/images/avatar5.png',
    time: '2天前',
    content: '分享一份我们团队整理的Agent设计模式文档，包含了常见的架构模式和最佳实践。',
    likes: 67,
    comments: 24,
    isLiked: true,
    isTop: false,
    category: '资料分享'
  }
];

// 获取帖子列表
export const getPosts = async (params?: {
  category?: string;
  search?: string;
  sortBy?: 'latest' | 'popular' | 'comments';
  page?: number;
  limit?: number;
}): Promise<{ data: Post[]; total: number }> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 50));
  
  let filteredPosts = [...mockPosts];
  
  // 分类过滤
  if (params?.category && params.category !== '推荐') {
    filteredPosts = filteredPosts.filter(post => post.category === params.category);
  }
  
  // 搜索过滤
  if (params?.search) {
    filteredPosts = filteredPosts.filter(post =>
      post.content.toLowerCase().includes(params.search!.toLowerCase()) ||
      post.username.toLowerCase().includes(params.search!.toLowerCase())
    );
  }
  
  // 排序
  if (params?.sortBy) {
    switch (params.sortBy) {
      case 'popular':
        filteredPosts.sort((a, b) => b.likes - a.likes);
        break;
      case 'comments':
        filteredPosts.sort((a, b) => b.comments - a.comments);
        break;
      default: // 默认按时间排序
        // 这里需要解析时间字符串为可比较的格式
        filteredPosts.sort((a, b) => {
          const timeA = parseTimeAgo(a.time);
          const timeB = parseTimeAgo(b.time);
          return timeB - timeA; // 最新的在前面
        });
        break;
    }
  }
  
  // 分页
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    data: filteredPosts.slice(startIndex, endIndex),
    total: filteredPosts.length
  };
};

// 解析相对时间字符串为毫秒数
const parseTimeAgo = (timeStr: string): number => {
  const now = new Date();
  const num = parseInt(timeStr.match(/\d+/)?.[0] || '0');
  
  if (timeStr.includes('分钟')) {
    return now.getTime() - num * 60 * 1000;
  } else if (timeStr.includes('小时')) {
    return now.getTime() - num * 60 * 60 * 1000;
  } else if (timeStr.includes('天')) {
    return now.getTime() - num * 24 * 60 * 60 * 1000;
  } else if (timeStr.includes('昨天')) {
    return now.getTime() - 24 * 60 * 60 * 1000;
  } else {
    // 默认返回当前时间
    return now.getTime();
  }
};

// 获取单个帖子详情
export const getPostById = async (id: number): Promise<Post | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockPosts.find(post => post.id === id) || null;
};

// 创建帖子
export const createPost = async (postData: Omit<Post, 'id' | 'likes' | 'comments' | 'isLiked' | 'time'>): Promise<Post> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newPost: Post = {
    ...postData,
    id: mockPosts.length + 1,
    likes: 0,
    comments: 0,
    isLiked: false,
    time: '刚刚'
  };
  
  mockPosts.unshift(newPost);
  return newPost;
};

// 点赞帖子
export const likePost = async (id: number): Promise<{ success: boolean; liked: boolean; likes: number }> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const post = mockPosts.find(p => p.id === id);
  if (!post) {
    return { success: false, liked: false, likes: 0 };
  }
  
  post.isLiked = !post.isLiked;
  post.likes += post.isLiked ? 1 : -1;
  
  return {
    success: true,
    liked: post.isLiked,
    likes: post.likes
  };
};