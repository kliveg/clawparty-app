<template>
  <view class="community-container">
    <view class="community-header">
      <view class="search-section">
        <input
          type="text"
          placeholder="搜索话题、开发者或技术..."
          class="search-input"
          :value="searchKeyword"
          @input="onSearch"
        />
      </view>

      <view class="quick-actions">
        <view class="action-btn primary" @click="createPost">
          <text class="action-icon">✏️</text>
          <text class="action-text">发布话题</text>
        </view>
        <view class="action-btn secondary" @click="joinGroup">
          <text class="action-icon">👥</text>
          <text class="action-text">加入小组</text>
        </view>
      </view>
    </view>

    <view class="community-tabs">
      <scroll-view scroll-x="true" class="tabs-scroll" show-scrollbar="false">
        <view
          v-for="(tab, index) in tabs"
          :key="index"
          class="tab-item"
          :class="{ active: activeTab === index }"
          @click="switchTab(index)"
        >
          {{ tab.name }}
        </view>
      </scroll-view>
    </view>

    <view class="posts-list">
      <view
        v-for="(post, index) in posts"
        :key="post.id"
        class="post-item"
        @click="goToPostDetail(post.id)"
      >
        <view class="post-header">
          <view class="avatar">
            <image :src="post.avatar" mode="aspectFill" class="avatar-img" />
          </view>
          <view class="user-info">
            <text class="username">{{ post.username }}</text>
            <text class="time">{{ post.time }}</text>
          </view>
          <view class="post-type" v-if="post.isTop">
            <text class="top-tag">置顶</text>
          </view>
        </view>

        <view class="post-content">
          <text class="content-text">{{ post.content }}</text>

          <view class="post-images" v-if="post.images && post.images.length > 0">
            <view
              v-for="(img, imgIndex) in post.images"
              :key="imgIndex"
              class="post-image"
              @click.stop="previewImage(img, post.images)"
            >
              <image :src="img" mode="aspectFill" class="image" />
            </view>
          </view>
        </view>

        <view class="post-stats">
          <view class="stat-item" @click.stop="toggleLike(post.id)">
            <text class="stat-icon">{{ getLikeStatus(post.id) ? '❤️' : '🤍' }}</text>
            <text class="stat-text">{{ getLikeCount(post.id) > 0 ? getLikeCount(post.id) : '赞' }}</text>
          </view>
          <view class="stat-item" @click.stop="commentPost(post.id)">
            <text class="stat-icon">💬</text>
            <text class="stat-text">{{ post.comments > 0 ? post.comments : '评论' }}</text>
          </view>
          <view class="stat-item" @click.stop="sharePost(post.id)">
            <text class="stat-icon">📤</text>
            <text class="stat-text">分享</text>
          </view>
        </view>
      </view>
    </view>

    <view v-if="hasMore" class="load-more" @click="loadMore">
      <text>加载更多</text>
    </view>
    <view v-else-if="!loading" class="no-more">
      <text>没有更多内容了</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { api } from '@/api';

let searchTimeout: NodeJS.Timeout | null = null;

interface Post {
  id: number;
  username: string;
  avatar: string;
  time: string;
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  isLiked: boolean;
  isTop?: boolean;
  category: string;
}

const activeTab = ref(0);
const searchKeyword = ref('');
const posts = ref<Post[]>([]);
const loading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const hasMore = computed(() => currentPage.value < totalPages.value);
const likedPosts = ref<{ [key: number]: boolean }>({});
const likeCounts = ref<{ [key: number]: number }>({});

const tabs = [
  { id: 0, name: '推荐' },
  { id: 1, name: '最新' },
  { id: 2, name: '热门' },
  { id: 3, name: '技术讨论' },
  { id: 4, name: '经验分享' },
  { id: 5, name: '求助答疑' }
];

onMounted(async () => {
  await loadPosts();
});

const loadPosts = async () => {
  loading.value = true;
  try {
    const response = await api.community.getPosts({
      category: tabs[activeTab.value].name,
      search: searchKeyword.value,
      sortBy: activeTab.value === 2 ? 'popular' :
        activeTab.value === 1 ? 'latest' : undefined,
      page: currentPage.value,
      limit: 10
    });

    if (currentPage.value === 1) {
      posts.value = response.data;
    } else {
      posts.value = [...posts.value, ...response.data];
    }

    totalPages.value = Math.ceil(response.total / 10);

    response.data.forEach(post => {
      likedPosts.value[post.id] = post.isLiked;
      likeCounts.value[post.id] = post.likes;
    });
  } catch (error) {
    console.error('Failed to load posts:', error);
  } finally {
    loading.value = false;
  }
};

const switchTab = async (index: number) => {
  activeTab.value = index;
  currentPage.value = 1;
  await loadPosts();
};

const onSearch = async (e: any) => {
  searchKeyword.value = e.detail.value;

  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  searchTimeout = setTimeout(async () => {
    currentPage.value = 1;
    await loadPosts();
  }, 500);
};

const loadMore = async () => {
  if (!hasMore.value || loading.value) return;

  currentPage.value++;
  await loadPosts();
};

const toggleLike = async (id: number) => {
  try {
    const result = await api.community.likePost(id);
    if (result.success) {
      likedPosts.value[id] = result.liked;
      likeCounts.value[id] = result.likes;
    }
  } catch (error) {
    console.error('Failed to toggle like:', error);
  }
};

const getLikeStatus = (id: number) => {
  return likedPosts.value[id] || false;
};

const getLikeCount = (id: number) => {
  return likeCounts.value[id] || 0;
};

const commentPost = (id: number) => {
  uni.navigateTo({
    url: `/pages/community/comment?id=${id}`
  });
};

const sharePost = (id: number) => {
  uni.showActionSheet({
    itemList: ['发送给朋友', '分享到朋友圈', '复制链接', '取消'],
    success(res) {
      console.log('分享操作:', res.tapIndex);
    }
  });
};

const previewImage = (current: string, urls: string[]) => {
  uni.previewImage({
    current,
    urls
  });
};

const goToPostDetail = (id: number) => {
  uni.navigateTo({
    url: `/pages/community/detail?id=${id}`
  });
};

const createPost = () => {
  uni.navigateTo({
    url: '/pages/community/create'
  });
};

const joinGroup = () => {
  uni.showModal({
    title: '加入小组',
    content: '您确定要加入AI Agent开发者小组吗？',
    success(res) {
      if (res.confirm) {
        uni.showToast({
          title: '成功加入小组',
          icon: 'success'
        });
      }
    }
  });
};
</script>

<style scoped lang="scss">
.community-container {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #0f172a;
}

.community-header {
  .search-section {
    margin-bottom: 20rpx;

    .search-input {
      width: 100%;
      height: 60rpx;
      background: #1e293b;
      border-radius: 30rpx;
      padding: 0 20rpx;
      font-size: 28rpx;
      color: #e2e8f0;
      border: 1rpx solid #334155;

      &::placeholder {
        color: #64748b;
      }
    }
  }

  .quick-actions {
    display: flex;
    margin-bottom: 20rpx;

    .action-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20rpx;
      border-radius: 16rpx;
      margin: 0 10rpx;
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.2);

      &.primary {
        background: linear-gradient(135deg, #00d4ff, #0099cc);

        .action-text {
          color: white;
        }
      }

      &.secondary {
        background: #1e293b;
        border: 1rpx solid #334155;

        .action-text {
          color: #e2e8f0;
        }
      }

      .action-icon {
        font-size: 32rpx;
        margin-right: 10rpx;
      }

      .action-text {
        font-size: 26rpx;
        font-weight: 500;
      }
    }
  }
}

.community-tabs {
  white-space: nowrap;
  margin-bottom: 20rpx;

  .tabs-scroll {
    display: flex;
    white-space: nowrap;
  }

  .tab-item {
    display: inline-block;
    padding: 10rpx 30rpx;
    margin-right: 20rpx;
    background: #1e293b;
    border-radius: 30rpx;
    font-size: 26rpx;
    color: #94a3b8;
    border: 1rpx solid #334155;

    &.active {
      background: linear-gradient(135deg, #00d4ff, #0099cc);
      color: white;
      border-color: #00d4ff;
    }
  }
}

.posts-list {
  .post-item {
    background: #1e293b;
    border-radius: 16rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.2);
    border: 1rpx solid #334155;

    .post-header {
      display: flex;
      align-items: center;
      margin-bottom: 15rpx;

      .avatar {
        width: 60rpx;
        height: 60rpx;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 15rpx;
        border: 2rpx solid #00d4ff;

        .avatar-img {
          width: 100%;
          height: 100%;
        }
      }

      .user-info {
        flex: 1;

        .username {
          display: block;
          font-size: 28rpx;
          font-weight: bold;
          color: #e2e8f0;
        }

        .time {
          font-size: 22rpx;
          color: #64748b;
        }
      }

      .post-type {
        .top-tag {
          font-size: 20rpx;
          color: #fff;
          background: linear-gradient(135deg, #ff6b35, #f7931e);
          padding: 4rpx 10rpx;
          border-radius: 20rpx;
        }
      }
    }

    .post-content {
      margin-bottom: 15rpx;

      .content-text {
        font-size: 28rpx;
        color: #e2e8f0;
        line-height: 1.6;
      }

      .post-images {
        display: flex;
        flex-wrap: wrap;
        margin-top: 15rpx;

        .post-image {
          width: calc((100% - 20rpx) / 3);
          height: 180rpx;
          border-radius: 12rpx;
          overflow: hidden;
          margin-right: 10rpx;
          margin-bottom: 10rpx;

          .image {
            width: 100%;
            height: 100%;
          }

          &:nth-child(3n) {
            margin-right: 0;
          }
        }
      }
    }

    .post-stats {
      display: flex;
      border-top: 1rpx solid #334155;
      padding-top: 15rpx;

      .stat-item {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;

        .stat-icon {
          font-size: 32rpx;
          margin-right: 8rpx;
        }

        .stat-text {
          font-size: 24rpx;
          color: #94a3b8;
        }
      }
    }
  }
}

.load-more, .no-more {
  text-align: center;
  padding: 30rpx;
  color: #64748b;
  font-size: 28rpx;
}
</style>
