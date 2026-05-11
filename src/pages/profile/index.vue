<template>
  <view class="profile-container">
    <!-- 用户信息区域 -->
    <view class="user-info-section">
      <view class="user-avatar">
        <image :src="userInfo.avatar" mode="aspectFill" class="avatar-img" />
        <view class="edit-icon" @click="editProfile">
          <text>✏️</text>
        </view>
      </view>
      <view class="user-details">
        <text class="username">{{ userInfo.username }}</text>
        <text class="user-level">Lv.{{ userInfo.level }} {{ userInfo.title }}</text>
        <view class="user-stats">
          <view class="stat-item">
            <text class="stat-num">{{ userInfo.posts }}</text>
            <text class="stat-label">帖子</text>
          </view>
          <view class="stat-item">
            <text class="stat-num">{{ userInfo.followers }}</text>
            <text class="stat-label">粉丝</text>
          </view>
          <view class="stat-item">
            <text class="stat-num">{{ userInfo.following }}</text>
            <text class="stat-label">关注</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-group">
        <view class="menu-item" @click="goToMyPosts">
          <text class="menu-icon">📝</text>
          <text class="menu-text">我的帖子</text>
          <text class="arrow">></text>
        </view>
        <view class="menu-item" @click="goToBookmarks">
          <text class="menu-icon">🔖</text>
          <text class="menu-text">收藏夹</text>
          <text class="arrow">></text>
        </view>
        <view class="menu-item" @click="goToHistory">
          <text class="menu-icon">🕒</text>
          <text class="menu-text">浏览历史</text>
          <text class="arrow">></text>
        </view>
      </view>

      <view class="menu-group">
        <view class="menu-item" @click="goToSettings">
          <text class="menu-icon">⚙️</text>
          <text class="menu-text">设置</text>
          <text class="arrow">></text>
        </view>
        <view class="menu-item" @click="goToHelp">
          <text class="menu-icon">❓</text>
          <text class="menu-text">帮助与反馈</text>
          <text class="arrow">></text>
        </view>
        <view class="menu-item" @click="logout">
          <text class="menu-icon">🚪</text>
          <text class="menu-text">退出登录</text>
          <text class="arrow">></text>
        </view>
      </view>
    </view>

    <!-- 快捷入口 -->
    <view class="quick-actions-section">
      <view class="section-title">快捷入口</view>
      <view class="quick-actions-grid">
        <view class="quick-action" @click="createPost">
          <text class="action-icon">➕</text>
          <text class="action-text">发布帖子</text>
        </view>
        <view class="quick-action" @click="joinGroups">
          <text class="action-icon">👥</text>
          <text class="action-text">我的小组</text>
        </view>
        <view class="quick-action" @click="myResources">
          <text class="action-icon">📚</text>
          <text class="action-text">我的资源</text>
        </view>
        <view class="quick-action" @click="myCourses">
          <text class="action-icon">🎓</text>
          <text class="action-text">我的课程</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from '@/api';

interface UserInfo {
  username: string;
  avatar: string;
  level: number;
  title: string;
  posts: number;
  followers: number;
  following: number;
  bio: string;
  joinDate: string;
}

const userInfo = ref<UserInfo>({
  username: '',
  avatar: '',
  level: 0,
  title: '',
  posts: 0,
  followers: 0,
  following: 0,
  bio: '',
  joinDate: ''
});

onMounted(async () => {
  await loadUserInfo();
});

const loadUserInfo = async () => {
  try {
    const userData = await api.user.getUserInfo();
    if(userData) {
      userInfo.value = userData;
    }
  } catch (error) {
    console.error('Failed to load user info:', error);
    uni.showToast({
      title: '获取用户信息失败',
      icon: 'error'
    });
  }
};

const editProfile = () => {
  uni.navigateTo({
    url: '/pages/profile/edit'
  });
};

const goToMyPosts = () => {
  uni.navigateTo({
    url: '/pages/profile/posts'
  });
};

const goToBookmarks = () => {
  uni.navigateTo({
    url: '/pages/profile/bookmarks'
  });
};

const goToHistory = () => {
  uni.navigateTo({
    url: '/pages/profile/history'
  });
};

const goToSettings = () => {
  uni.navigateTo({
    url: '/pages/profile/settings'
  });
};

const goToHelp = () => {
  uni.navigateTo({
    url: '/pages/profile/help'
  });
};

const logout = () => {
  uni.showModal({
    title: '确认退出',
    content: '您确定要退出登录吗？',
    success(res) {
      if (res.confirm) {
        console.log('用户退出登录');
        uni.showToast({
          title: '已退出',
          icon: 'success'
        });
      }
    }
  });
};

const createPost = () => {
  uni.navigateTo({
    url: '/pages/community/create'
  });
};

const joinGroups = () => {
  uni.navigateTo({
    url: '/pages/profile/groups'
  });
};

const myResources = () => {
  uni.navigateTo({
    url: '/pages/profile/resources'
  });
};

const myCourses = () => {
  uni.navigateTo({
    url: '/pages/profile/courses'
  });
};
</script>

<style scoped lang="scss">
.profile-container {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #0f172a;
}

.user-info-section {
  background: linear-gradient(135deg, #1e293b, #0f172a);
  border-radius: 20rpx;
  padding: 40rpx 30rpx;
  margin-bottom: 20rpx;
  color: white;
  position: relative;
  overflow: hidden;
  border: 1rpx solid #334155;
  box-shadow: 0 8rpx 24rpx rgba(0, 212, 255, 0.15);

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%);
    pointer-events: none;
  }

  .user-avatar {
    position: relative;
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 auto 20rpx;
    border: 4rpx solid #00d4ff;
    box-shadow: 0 0 20rpx rgba(0, 212, 255, 0.5);

    .avatar-img {
      width: 100%;
      height: 100%;
    }

    .edit-icon {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 40rpx;
      height: 40rpx;
      background: rgba(0, 212, 255, 0.9);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20rpx;
    }
  }

  .user-details {
    text-align: center;

    .username {
      display: block;
      font-size: 36rpx;
      font-weight: bold;
      margin-bottom: 10rpx;
      color: #e2e8f0;
    }

    .user-level {
      display: block;
      font-size: 26rpx;
      color: #00d4ff;
      margin-bottom: 20rpx;
    }

    .user-stats {
      display: flex;
      justify-content: space-around;

      .stat-item {
        text-align: center;

        .stat-num {
          display: block;
          font-size: 32rpx;
          font-weight: bold;
          color: #e2e8f0;
        }

        .stat-label {
          display: block;
          font-size: 24rpx;
          color: #94a3b8;
        }
      }
    }
  }
}

.menu-section {
  .menu-group {
    background: #1e293b;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.2);
    border: 1rpx solid #334155;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .menu-item {
    display: flex;
    align-items: center;
    padding: 30rpx;
    border-bottom: 1rpx solid #334155;

    &:last-child {
      border-bottom: none;
    }

    .menu-icon {
      font-size: 36rpx;
      margin-right: 20rpx;
      width: 40rpx;
    }

    .menu-text {
      flex: 1;
      font-size: 28rpx;
      color: #e2e8f0;
    }

    .arrow {
      font-size: 24rpx;
      color: #64748b;
    }
  }
}

.quick-actions-section {
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #e2e8f0;
    margin-bottom: 20rpx;
  }

  .quick-actions-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20rpx;

    .quick-action {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 30rpx 10rpx;
      background: #1e293b;
      border-radius: 16rpx;
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.2);
      border: 1rpx solid #334155;

      .action-icon {
        font-size: 40rpx;
        margin-bottom: 10rpx;
      }

      .action-text {
        font-size: 24rpx;
        color: #94a3b8;
      }
    }
  }
}
</style>
