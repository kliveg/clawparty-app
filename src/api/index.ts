// API 服务入口
import { getHomeData } from './home';
import { getTutorials, getTutorialById } from './tutorial';
import { getResources, getResourceById, downloadResource } from './resource';
import { getPosts, getPostById, createPost, likePost } from './community';
import { getUserInfo, updateUserInfo } from './user';

export const api = {
  home: {
    getHomeData,
  },
  tutorial: {
    getTutorials,
    getTutorialById
  },
  resource: {
    getResources,
    getResourceById,
    downloadResource
  },
  community: {
    getPosts,
    getPostById,
    createPost,
    likePost
  },
  user: {
    getUserInfo,
    updateUserInfo
  }
};