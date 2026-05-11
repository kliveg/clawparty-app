// src/hooks/useLocale.ts
import { ref, reactive } from 'vue'

// 国际化语言资源
const locales = {
  zh: {
    tabbar: {
      home: '首页',
      tutorial: '教程中心',
      resources: '资源广场',
      community: '社区圈子',
      profile: '个人中心'
    },
    common: {
      hello: '你好',
      welcome: '欢迎使用AI Agent社区'
    }
  },
  en: {
    tabbar: {
      home: 'Home',
      tutorial: 'Tutorials',
      resources: 'Resources',
      community: 'Community',
      profile: 'Profile'
    },
    common: {
      hello: 'Hello',
      welcome: 'Welcome to AI Agent Community'
    }
  }
}

// 当前语言
export const currentLocale = ref('zh')

// 国际化翻译函数
export const t = (key: string) => {
  const keys = key.split('.')
  let result: any = locales[currentLocale.value]

  for (const k of keys) {
    result = result?.[k]
  }

  return result || key
}

// 切换语言
export const setLocale = (locale: string) => {
  if (locales.hasOwnProperty(locale)) {
    currentLocale.value = locale
    uni.setStorageSync('locale', locale)
  }
}

// 初始化语言
export const initLocale = () => {
  const savedLocale = uni.getStorageSync('locale')
  if (savedLocale && locales.hasOwnProperty(savedLocale)) {
    currentLocale.value = savedLocale
  } else {
    // 尝试根据系统语言设置默认语言
    const systemInfo = uni.getSystemInfoSync()
    const systemLocale = systemInfo.language?.substring(0, 2) || 'zh'
    currentLocale.value = locales.hasOwnProperty(systemLocale) ? systemLocale : 'zh'
  }
}

// 使用国际化Hook
export const useLocale = () => {
  initLocale()

  return {
    currentLocale,
    t,
    setLocale
  }
}
