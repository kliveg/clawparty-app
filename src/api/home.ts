// src/api/home.ts
export interface HomeData {
  // 定义首页数据接口
  featuredContent?: any;
  statistics?: any;
  announcements?: any[];
}

// Mock 数据
const mockHomeData: HomeData = {
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