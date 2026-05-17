<script lang="ts" setup>
import { useTokenStore } from '@/store/token'
import { useRouter } from 'uni-router'

definePage({
  style: {
    navigationBarTitleText: '登录',
  },
})

const router = useRouter()
const tokenStore = useTokenStore()
// 添加密码可见性状态
const showPassword = ref(false)

async function doLogin() {
  if (tokenStore.hasLogin) {
    uni.navigateBack()
    return
  }
  try {
    // 调用登录接口
    await tokenStore.login({
      username: 'zacharylee',
      password: '123456',
    })
    
    // 登录成功后跳转到首页
    router.replaceAll('/pages/index/index')
  }
  catch (error) {
    console.log('登录失败', error)
    uni.showToast({
      title: '登录失败，请重试',
      icon: 'none'
    })
  }
}
</script>

<template>
  <view class="login-container">
    <view class="login-header">
      <image src="/static/logo.svg" alt="Logo" class="logo" />
      <text class="title">AI Agent开发者社区</text>
      <text class="subtitle">登录您的账户</text>
    </view>
    
    <view class="login-form">
      <view class="input-group">
        <view class="input-field">
          <text class="input-label">用户名</text>
          <input 
            type="text" 
            class="input" 
            placeholder="请输入用户名" 
            value="zacharylee"
          />
        </view>
        <view class="input-field">
          <text class="input-label">密码</text>
          <view class="password-input-container">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              class="input password-input" 
              placeholder="请输入密码" 
              value="123456"
            />
            <text 
              class="password-toggle-icon" 
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? '🙈' : '👁️' }}
            </text>
          </view>
        </view>
      </view>
      
      <button class="login-button" @click="doLogin">
        <text class="button-text">登录</text>
      </button>
      
      <view class="login-footer">
        <text class="footer-text">还没有账户？</text>
        <text class="link" @click="uni.navigateTo({ url: '/pages/auth/register' })">立即注册</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.login-container {
  height: 100vh;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  padding: 40rpx;
  box-sizing: border-box;
}

.login-header {
  text-align: center;
  margin-bottom: 80rpx;
  padding-top: 60rpx;

  .logo {
    width: 120rpx;
    height: 120rpx;
    margin: 0 auto 20rpx;
    display: block;
  }

  .title {
    font-size: 36rpx;
    font-weight: bold;
    color: #00d4ff;
    display: block;
    margin-bottom: 10rpx;
  }

  .subtitle {
    font-size: 28rpx;
    color: #94a3b8;
  }
}

.login-form {
  .input-group {
    margin-bottom: 60rpx;
  }

  .input-field {
    margin-bottom: 40rpx;

    .input-label {
      display: block;
      font-size: 28rpx;
      color: #e2e8f0;
      margin-bottom: 15rpx;
      font-weight: 500;
    }

    .password-input-container {
      position: relative;
      display: flex;
      align-items: center;
    }

    .password-input {
      flex: 1;
    }

    .password-toggle-icon {
      position: absolute;
      right: 20rpx;
      font-size: 36rpx;
      cursor: pointer;
      z-index: 10;
    }

    .input {
      width: 100%;
      height: 80rpx;
      background: rgba(30, 41, 59, 0.7);
      border: 1rpx solid #334155;
      border-radius: 12rpx;
      padding: 0 20rpx;
      color: #e2e8f0;
      font-size: 28rpx;
      box-sizing: border-box;

      &::placeholder {
        color: #64748b;
      }
    }
  }

  .login-button {
    width: 100%;
    height: 80rpx;
    background: linear-gradient(135deg, #00d4ff, #0099cc);
    border: none;
    border-radius: 12rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 212, 255, 0.3);
    margin-bottom: 30rpx;

    .button-text {
      font-size: 32rpx;
      font-weight: bold;
      color: white;
    }
  }

  .login-footer {
    display: flex;
    justify-content: center;
    align-items: center;

    .footer-text {
      font-size: 26rpx;
      color: #94a3b8;
      margin-right: 10rpx;
    }

    .link {
      font-size: 26rpx;
      color: #00d4ff;
      text-decoration: underline;
    }
  }
}
</style>