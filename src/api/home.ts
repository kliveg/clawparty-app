// src/api/home.ts
export interface Banner {
  id: number;
  image: string;
  title?: string;
  link?: string;
}

export interface RecommendItem {
  id: number;
  title: string;
  cover: string;
  difficulty: number;
  view_count: number;
  description?: string;
}

export interface HomeData {
  banners: Banner[];
  recommends: RecommendItem[];
  featuredContent?: any;
  statistics?: any;
  announcements?: any[];
}

// Mock 数据
const mockHomeData: HomeData = {
  banners: [
    {
      id: 1,
      image: "https://via.placeholder.com/750x300/4A7BF7/ffffff?text=欢迎使用开发者社区",
      title: "欢迎使用开发者社区"
    },
    {
      id: 2,
      image: "https://via.placeholder.com/750x300/FF6B6B/ffffff?text=精选教程资源",
      title: "精选教程资源"
    },
    {
      id: 3,
      image: "https://via.placeholder.com/750x300/4ECDC4/ffffff?text=技术交流平台",
      title: "技术交流平台"
    }
  ],
  recommends: [
    {
      id: 1,
      title: "Vue3 入门教程 - 从零开始学习 Vue3",
      cover: "https://via.placeholder.com/180x120/4A7BF7/ffffff?text=Vue3",
      difficulty: 1,
      view_count: 1234
    },
    {
      id: 2,
      title: "TypeScript 高级用法详解",
      cover: "https://via.placeholder.com/180x120/FF6B6B/ffffff?text=TS",
      difficulty: 2,
      view_count: 987
    },
    {
      id: 3,
      title: "React Hooks 最佳实践",
      cover: "https://via.placeholder.com/180x120/4ECDC4/ffffff?text=React",
      difficulty: 2,
      view_count: 2345
    },
    {
      id: 4,
      title: "Node.js 后端开发实战",
      cover: "https://via.placeholder.com/180x120/45B7D1/ffffff?text=Node",
      difficulty: 3,
      view_count: 765
    }
  ],
  featuredContent: {
    title: "特色内容",
    items: [
      { id: 1, name: "推荐商品1", price: 99.99 },
      { id: 2, name: "推荐商品2", price: 149.99 },
      { id: 3, name: "推荐商品3", price: 199.99 }
    ]
  },
  statistics: {
    totalUsers: 12345,
    todayVisits: 1234,
    onlineUsers: 87
  },
  announcements: [
    { id: 1, title: "系统维护通知", content: "本周日凌晨2点进行系统维护" },
    { id: 2, title: "新功能上线", content: "新增购物车功能，提升用户体验" }
  ]
};

export const getHomeData = async (): Promise<HomeData> => {
  try {
    // 如果是开发环境，返回 mock 数据
    if (process.env.NODE_ENV === 'development') {
      console.log('使用 Mock 数据');
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(mockHomeData);
        }, 50); // 模拟网络延迟
      });
    }

    // 生产环境中实现获取首页数据的逻辑
    const response = await fetch('/api/home');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch home data:', error);

    // 如果是开发环境，当 API 调用失败时也返回 mock 数据
    if (process.env.NODE_ENV === 'development') {
      console.warn('API 调用失败，使用 Mock 数据');
      return mockHomeData;

    }

    throw error;
  }
};
