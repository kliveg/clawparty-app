// 封装uni.request拦截器，适配小程序域名校验
const baseURL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000/api'  // 开发环境
  : 'https://your-api-domain.com/api'  // 生产环境

class Request {
  constructor(options = {}) {
    this.baseURL = options.baseURL || baseURL
    this.defaultOptions = {
      timeout: 10000,
      header: {
        'Content-Type': 'application/json'
      }
    }
  }

  // 请求拦截器
  interceptRequest(config) {
    // 添加认证token
    const token = uni.getStorageSync('token')
    if (token) {
      config.header = {
        ...config.header,
        'Authorization': `Bearer ${token}`
      }
    }
    
    // 添加请求标识
    config.header['X-Requested-With'] = 'XMLHttpRequest'
    
    return config
  }

  // 响应拦截器
  interceptResponse(response, requestConfig) {
    // 统一处理错误
    if (response.errMsg && response.errMsg.includes('fail')) {
      throw new Error(response.errMsg)
    }
    
    const { statusCode, data } = response
    
    if (statusCode !== 200) {
      throw new Error(`HTTP Error: ${statusCode}`)
    }
    
    // 根据业务约定处理响应
    if (data && typeof data === 'object') {
      if (data.code !== undefined && data.code !== 0) {
        throw new Error(data.message || '请求失败')
      }
    }
    
    return data
  }

  // GET请求
  get(url, params = {}, options = {}) {
    return this.request({
      url,
      method: 'GET',
      data: params,
      ...options
    })
  }

  // POST请求
  post(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'POST',
      data,
      ...options
    })
  }

  // PUT请求
  put(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'PUT',
      data,
      ...options
    })
  }

  // DELETE请求
  delete(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'DELETE',
      data,
      ...options
    })
  }

  // 通用请求方法
  async request(config) {
    // 合并默认配置
    const mergedConfig = {
      ...this.defaultOptions,
      ...config
    }

    // 处理完整URL
    if (!mergedConfig.url.startsWith('http')) {
      mergedConfig.url = this.baseURL + mergedConfig.url
    }

    // 请求拦截
    const interceptedConfig = this.interceptRequest(mergedConfig)

    try {
      // 发起请求
      const response = await uni.request(interceptedConfig)
      
      // 响应拦截
      return this.interceptResponse(response, interceptedConfig)
    } catch (error) {
      // 错误处理
      console.error('Request Error:', error)
      
      // 根据错误类型返回不同的提示
      if (error.errMsg) {
        uni.showToast({
          title: '网络连接失败',
          icon: 'none'
        })
      } else {
        uni.showToast({
          title: error.message || '请求失败',
          icon: 'none'
        })
      }
      
      throw error
    }
  }
}

// 创建实例
const request = new Request()

export default request