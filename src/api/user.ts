// 用户相关API
import { User } from './types';

// Mock用户数据
let mockUser: User = {
  id: 1,
  username: 'AI开发者',
  avatar: '/static/images/default-avatar.png',
  level: 5,
  title: '资深开发者',
  posts: 42,
  followers: 128,
  following: 67,
  bio: '热爱AI技术，专注于Agent开发',
  joinDate: '2023-05-20'
};

// 获取用户信息
export const getUserInfo = async (userId?: number): Promise<User | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockUser;
};

// 更新用户信息
export const updateUserInfo = async (userData: Partial<User>): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  
  mockUser = {
    ...mockUser,
    ...userData
  };
  
  return mockUser;
};