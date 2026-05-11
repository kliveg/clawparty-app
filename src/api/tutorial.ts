// 教程相关API
import { Tutorial } from './types';

// Mock数据
const mockTutorials: Tutorial[] = [
  {
    id: 1,
    title: 'AI Agent 开发入门指南',
    description: '从零开始学习如何构建一个基础的AI Agent，涵盖核心概念和基础实现方法',
    author: 'AI开发者',
    level: '初级',
    createTime: '2024-01-15',
    updateTime: '2024-01-15',
    views: 1250,
    likes: 45,
    shares: 12,
    coverImage: '/static/images/tutorial-default.png'
  },
  {
    id: 2,
    title: '大模型集成实践',
    description: '了解如何将主流大语言模型集成到你的Agent中，实现更智能的交互',
    author: '技术专家',
    level: '中级',
    createTime: '2024-01-12',
    updateTime: '2024-01-12',
    views: 2100,
    likes: 89,
    shares: 24,
    coverImage: '/static/images/tutorial-default.png'
  },
  {
    id: 3,
    title: '多模态Agent设计',
    description: '构建能够处理文本、图像等多种输入的智能Agent系统',
    author: '架构师',
    level: '高级',
    createTime: '2024-01-10',
    updateTime: '2024-01-10',
    views: 890,
    likes: 32,
    shares: 8,
    coverImage: '/static/images/tutorial-default.png'
  },
  {
    id: 4,
    title: 'Agent记忆系统实现',
    description: '设计和实现持久化记忆系统，让Agent具备长期学习能力',
    author: '算法工程师',
    level: '中级',
    createTime: '2024-01-08',
    updateTime: '2024-01-08',
    views: 1560,
    likes: 67,
    shares: 18,
    coverImage: '/static/images/tutorial-default.png'
  }
];

// 获取教程列表
export const getTutorials = async (params?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: Tutorial[]; total: number }> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 50));
  
  let filteredTutorials = [...mockTutorials];
  
  // 分类过滤
  if (params?.category && params.category !== '全部') {
    filteredTutorials = filteredTutorials.filter(tutorial =>
      tutorial.level === params.category
    );
  }
  
  // 搜索过滤
  if (params?.search) {
    filteredTutorials = filteredTutorials.filter(tutorial =>
      tutorial.title.toLowerCase().includes(params.search!.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(params.search!.toLowerCase())
    );
  }
  
  // 分页
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    data: filteredTutorials.slice(startIndex, endIndex),
    total: filteredTutorials.length
  };
};

// 获取单个教程详情
export const getTutorialById = async (id: number): Promise<Tutorial | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockTutorials.find(tutorial => tutorial.id === id) || null;
};