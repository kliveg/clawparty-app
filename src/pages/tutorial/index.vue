<template>
  <view class="tutorial-container">
    <view class="search-bar">
      <input
        type="text"
        placeholder="搜索教程、技术栈或框架..."
        class="search-input"
        :value="searchKeyword"
        @input="onSearch"
      />
    </view>

    <view class="category-tabs">
      <scroll-view scroll-x="true" class="tabs-scroll" show-scrollbar="false">
        <view
          v-for="(category, index) in categories"
          :key="index"
          class="tab-item"
          :class="{ active: activeCategory === index }"
          @click="switchCategory(index)"
        >
          {{ category.name }}
        </view>
      </scroll-view>
    </view>

    <view class="tutorials-list">
      <view
        v-for="(tutorial, index) in displayedTutorials"
        :key="tutorial.id"
        class="tutorial-item"
        @click="goToTutorialDetail(tutorial.id)"
      >
        <view class="tutorial-cover">
          <image
            :src="tutorial.coverImage || '/static/images/tutorial-default.png'"
            mode="aspectFill"
            class="cover-image"
          />
          <view class="level-badge" :class="getLevelClass(tutorial.level)">
            {{ tutorial.level }}
          </view>
        </view>
        <view class="tutorial-info">
          <text class="title">{{ tutorial.title }}</text>
          <text class="desc">{{ tutorial.description }}</text>
          <view class="meta">
            <text class="author">{{ tutorial.author }}</text>
            <text class="views">👁 {{ tutorial.views }}</text>
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

interface Tutorial {
  id: number;
  title: string;
  description: string;
  author: string;
  level: string;
  coverImage?: string;
  views: number;
}

const activeCategory = ref(0);
const searchKeyword = ref('');
const tutorials = ref<Tutorial[]>([]);
const loading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const hasMore = computed(() => currentPage.value < totalPages.value);

const categories = [
  { id: 0, name: '全部' },
  { id: 1, name: '零基础入门' },
  { id: 2, name: 'WSL环境' },
  { id: 3, name: 'Docker部署' },
  { id: 4, name: 'Ollama配置' },
  { id: 5, name: 'Hermes教程' },
  { id: 6, name: 'OpenClaw教程' },
  { id: 7, name: '报错排错' }
];

const displayedTutorials = computed(() => {
  if (activeCategory.value === 0) {
    return tutorials.value;
  }
  const categoryName = categories[activeCategory.value].name;
  return tutorials.value.filter(tutorial =>
    tutorial.title.includes(categoryName) ||
    tutorial.description.includes(categoryName)
  );
});

onMounted(async () => {
  await loadTutorials();
});

const loadTutorials = async () => {
  loading.value = true;
  try {
    const response = await api.tutorial.getTutorials({
      category: categories[activeCategory.value].name,
      search: searchKeyword.value,
      page: currentPage.value,
      limit: 10
    });

    if (currentPage.value === 1) {
      tutorials.value = response.data;
    } else {
      tutorials.value = [...tutorials.value, ...response.data];
    }

    totalPages.value = Math.ceil(response.total / 10);
  } catch (error) {
    console.error('Failed to load tutorials:', error);
  } finally {
    loading.value = false;
  }
};

const switchCategory = async (index: number) => {
  activeCategory.value = index;
  currentPage.value = 1;
  await loadTutorials();
};

const onSearch = async (e: any) => {
  searchKeyword.value = e.detail.value;
  currentPage.value = 1;
  await loadTutorials();
};

const loadMore = async () => {
  if (!hasMore.value || loading.value) return;

  currentPage.value++;
  await loadTutorials();
};

const goToTutorialDetail = (id: number) => {
  uni.navigateTo({
    url: `/pages/tutorial/detail?id=${id}`
  });
};

const getLevelClass = (level: string) => {
  if (level.includes('初级') || level.includes('入门')) return 'beginner';
  if (level.includes('中级')) return 'intermediate';
  if (level.includes('高级')) return 'advanced';
  return 'beginner';
};
</script>

<style scoped lang="scss">
.tutorial-container {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #0f172a;
}

.search-bar {
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

.category-tabs {
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

.tutorials-list {
  .tutorial-item {
    display: flex;
    background: #1e293b;
    border-radius: 16rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.2);
    border: 1rpx solid #334155;

    .tutorial-cover {
      width: 180rpx;
      height: 120rpx;
      border-radius: 12rpx;
      overflow: hidden;
      margin-right: 20rpx;
      position: relative;

      .cover-image {
        width: 100%;
        height: 100%;
      }

      .level-badge {
        position: absolute;
        top: 8rpx;
        right: 8rpx;
        padding: 4rpx 12rpx;
        border-radius: 20rpx;
        font-size: 20rpx;
        font-weight: bold;
        color: white;

        &.beginner {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        &.intermediate {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        &.advanced {
          background: linear-gradient(135deg, #ef4444, #dc2626);
        }
      }
    }

    .tutorial-info {
      flex: 1;
      display: flex;
      flex-direction: column;

      .title {
        font-size: 30rpx;
        font-weight: bold;
        color: #e2e8f0;
        margin-bottom: 10rpx;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .desc {
        font-size: 24rpx;
        color: #94a3b8;
        margin-bottom: 15rpx;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .meta {
        display: flex;
        justify-content: space-between;

        .author {
          font-size: 22rpx;
          color: #64748b;
        }

        .views {
          font-size: 22rpx;
          color: #64748b;
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
