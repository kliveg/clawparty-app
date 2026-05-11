import type { IUserInfoRes } from '@/api/types/login'
import { defineStore } from 'pinia'

// 定义用户信息的接口
export interface UserInfo {
  id?: string | number
  // 添加其他可能的用户属性
  username?: string
  avatar?: string
  value?: string
  roles?: string[]
  [key: string]: any // 允许其他属性
  // ... 其他属性
}

export interface UserState {
  userInfo: UserInfo | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    userInfo: null
  }),
  
  getters: {
    userId: (state) => state.userInfo?.id || null,
    // ... 其他现有getter
  },
  
  actions: {
    // ... 现有的actions
  }
})
