<!-- pages/index/index.vue -->
<template>
  <view class="index-container">
    <!-- 1. 自定义导航栏 -->
    <uni-nav-bar
      title="开发者社区"
      background-color="#fff"
      color="#333"
      fixed
      status-bar
    >
      <view slot="right" @click="onSearchClick">
        <uni-icons type="search" size="24" color="#333"></uni-icons>
      </view>
    </uni-nav-bar>

    <!-- 2. 内容区域 -->
    <scroll-view class="content" scroll-y :style="{ paddingTop: navBarHeight + 'px' }">
      
      <!-- 搜索框 -->
      <view class="search-box" @click="onSearchClick">
        <view class="search-input">
          <uni-icons type="search" size="18" color="#999" style="margin-right: 10rpx;"></uni-icons>
          <text style="color: #999;">搜索教程、资源或社区...</text>
        </view>
      </view>

      <!-- 轮播图 -->
      <view class="banner-section">
        <swiper
          class="banner-swiper"
          :indicator-dots="true"
          indicator-color="rgba(255, 255, 255, 0.5)"
          indicator-active-color="#fff"
          :autoplay="true"
          :interval="3000"
          :duration="500"
        >
          <swiper-item v-for="(item, index) in banners" :key="index">
            <image :src="item.image" mode="aspectFill" class="banner-image"></image>
          </swiper-item>
        </swiper>
      </view>

      <!-- 功能入口 -->
      <view class="feature-cards">
        <view class="card-row">
          <view class="card-item" @click="goToPage('/pages/tutorial/list')">
            <uni-icons type="bookmarks-filled" size="40" color="#4A7BF7"></uni-icons>
            <text>教程中心</text>
          </view>
          <view class="card-item" @click="goToPage('/pages/resource/list')">
            <uni-icons type="download-filled" size="40" color="#FF6B6B"></uni-icons>
            <text>精选资源</text>
          </view>
          <view class="card-item" @click="goToPage('/pages/community/list')">
            <uni-icons type="chatbubble-filled" size="40" color="#4ECDC4"></uni-icons>
            <text>技术社区</text>
          </view>
        </view>
        <view class="card-row">
          <view class="card-item" @click="goToPage('/pages/user/profile')">
            <uni-icons type="person-filled" size="40" color="#45B7D1"></uni-icons>
            <text>个人中心</text>
          </view>
          <view class="card-item" @click="goToPage('/pages/about/index')">
            <uni-icons type="info-filled" size="40" color="#96CEB4"></uni-icons>
            <text>关于我们</text>
          </view>
          <view class="card-item" @click="triggerSpecialAction">
            <uni-icons type="star-filled" size="40" color="#FFEAA7"></uni-icons>
            <text>快捷入口</text>
          </view>
        </view>
      </view>

      <!-- 推荐列表 -->
      <view class="recommend-section">
        <view class="section-header">
          <text class="section-title">热门推荐</text>
        </view>
        <view class="recommend-list">
          <view
            class="recommend-item"
            v-for="(item, index) in recommends"
            :key="item.id"
            @click="goToDetail(item.id, 'tutorial')"
          >
            <image :src="item.cover" mode="aspectFill" class="item-cover"></image>
            <view class="item-info">
              <text class="item-title">{{ item.title }}</text>
              <view class="item-meta">
                <text class="item-difficulty">难度: {{ getDifficultyText(item.difficulty) }}</text>
                <text class="item-views">浏览: {{ item.view_count }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

    </scroll-view>
  </view>
</template>

<script>
import { api } from '@/api'; // 确保这个文件存在且路径正确

export default {
  data() {
    return {
      navBarHeight: 0,
      banners: [],
      recommends: []
    };
  },
  onLoad() {
    // 计算导航栏高度
    const systemInfo = uni.getSystemInfoSync();
    this.navBarHeight = 44 + systemInfo.statusBarHeight;
    
    // 获取数据
    this.fetchHomeData();
  },
  methods: {
    async fetchHomeData() {
      try {
        uni.showLoading({ title: '加载中...' });
        const res = await api.home.getHomeData();
        if (res.code === 200) {
          this.banners = res.data.banners || [];
          this.recommends = res.data.recommends || [];
        } else {
          uni.showToast({ title: res.message || '加载失败', icon: 'none' });
        }
      } catch (error) {
        console.error('获取首页数据失败:', error);
        uni.showToast({ title: '网络错误', icon: 'none' });
      } finally {
        uni.hideLoading();
      }
    },
    onSearchClick() {
      uni.navigateTo({ url: '/pages/search/index' });
    },
    goToPage(url) {
      uni.navigateTo({ url: url });
    },
    goToDetail(id, type) {
      let url = '';
      if (type === 'tutorial') url = `/pages/tutorial/detail?id=${id}`;
      if (url) uni.navigateTo({ url });
    },
    getDifficultyText(difficulty) {
      const map = { 1: '入门', 2: '进阶', 3: '专家' };
      return map[difficulty] || '未知';
    },
    triggerSpecialAction() {
      uni.showToast({ title: '快捷入口被点击！', icon: 'none' });
    }
  }
};
</script>

<style lang="scss">
// 引入外部样式文件
// @import '@/styles/index.scss';
.index-container {
  width: 100%;
  height: 100vh;
  background-color: #f8f9fa;
  position: relative;

  .content {
    width: 100%;
    height: 100vh;
    box-sizing: border-box;

    .search-box {
      padding: 20rpx;
      background-color: #fff;
      margin: 20rpx;
      border-radius: 10rpx;
      display: flex;
      align-items: center;

      .search-input {
        width: 100%;
        height: 60rpx;
        background-color: #f5f5f5;
        border-radius: 30rpx;
        display: flex;
        align-items: center;
        padding: 0 20rpx;
      }
    }

    .banner-section {
      padding: 0 20rpx;
      margin-bottom: 30rpx;

      .banner-swiper {
        width: 100%;
        height: 300rpx;
        border-radius: 15rpx;
        overflow: hidden;

        .banner-image {
          width: 100%;
          height: 100%;
        }
      }
    }

    .feature-cards {
      padding: 0 20rpx;
      margin-bottom: 30rpx;

      .card-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20rpx;

        &:last-child {
          margin-bottom: 0;
        }

        .card-item {
          width: 220rpx;
          height: 120rpx;
          background-color: #fff;
          border-radius: 15rpx;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease;

          &:active {
            transform: scale(0.95);
          }

          text {
            margin-top: 10rpx;
            font-size: 24rpx;
            color: #333;
          }
        }
      }
    }

    .recommend-section {
      background-color: #fff;
      margin: 0 20rpx 20rpx;
      border-radius: 15rpx;
      overflow: hidden;

      .section-header {
        padding: 30rpx 20rpx 20rpx;
        border-bottom: 1rpx solid #eee;

        .section-title {
          font-size: 32rpx;
          font-weight: bold;
          color: #333;
        }
      }

      .recommend-list {
        padding: 20rpx;

        .recommend-item {
          display: flex;
          margin-bottom: 30rpx;

          &:last-child {
            margin-bottom: 0;
          }

          .item-cover {
            width: 180rpx;
            height: 120rpx;
            border-radius: 10rpx;
            margin-right: 20rpx;
          }

          .item-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .item-title {
              font-size: 28rpx;
              color: #333;
              line-height: 1.4;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }

            .item-meta {
              display: flex;
              justify-content: space-between;

              .item-difficulty,
              .item-views {
                font-size: 24rpx;
                color: #999;
              }
            }
          }
        }
      }
    }
  }
}

// 其他页面通用样式
.container {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.header {
  text-align: center;
  padding: 40rpx 0;
}

.title {
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
}

.content {
  .section {
    text-align: center;
    margin-bottom: 60rpx;
    
    .section-title {
      display: block;
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
    }
    
    .section-desc {
      font-size: 28rpx;
      color: #666;
    }
  }
  
  .features {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20rpx;
    
    .feature-card {
      background: white;
      border-radius: 16rpx;
      padding: 30rpx 20rpx;
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
      
      .feature-title {
        display: block;
        font-size: 30rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 10rpx;
      }
      
      .feature-desc {
        font-size: 24rpx;
        color: #666;
      }
    }
  }
}
</style>