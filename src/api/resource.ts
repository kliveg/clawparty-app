// 资源相关API
import { Resource } from './types';

// Mock数据
const mockResources: Resource[] = [
  {
    id: 1,
    title: 'AI Agent 框架模板',
    description: '开箱即用的AI Agent开发框架，包含常用功能模块',
    type: '模板',
    tags: ['框架', '模板', 'TypeScript'],
    author: '社区精选',
    date: '2024-01-15',
    downloadCount: 245,
    fileSize: '2.4MB',
    downloadUrl: '/downloads/agent-framework.zip'
  },
  {
    id: 2,
    title: '大模型API集成指南',
    description: '详细说明如何集成主流大语言模型API',
    type: '教程',
    tags: ['API', '集成', '文档'],
    author: '技术专家',
    date: '2024-01-12',
    downloadCount: 189,
    fileSize: '1.8MB',
    downloadUrl: '/downloads/api-integration-guide.pdf'
  },
  {
    id: 3,
    title: 'Agent性能优化工具',
    description: '帮助分析和优化Agent性能的专业工具',
    type: '工具',
    tags: ['性能', '调试', '工具'],
    author: '开源贡献者',
    date: '2024-01-10',
    downloadCount: 156,
    fileSize: '5.2MB',
    downloadUrl: '/downloads/performance-tool.exe'
  },
  {
    id: 4,
    title: '对话流设计资源包',
    description: '预设的对话流程设计模式和最佳实践',
    type: '资源',
    tags: ['设计', '流程', 'UX'],
    author: 'UX设计师',
    date: '2024-01-08',
    downloadCount: 98,
    fileSize: '3.1MB',
    downloadUrl: '/downloads/conversation-flow-kit.rar'
  },
  {
    id: 5,
    title: '训练数据集示例',
    description: '用于训练自定义AI Agent的高质量数据集',
    type: '数据集',
    tags: ['数据', '训练', 'ML'],
    author: '数据科学家',
    date: '2024-01-05',
    downloadCount: 210,
    fileSize: '12.5MB',
    downloadUrl: '/downloads/training-dataset.json'
  },
  {
    id: 6,
    title: '部署脚本集合',
    description: '一键部署AI Agent到多种平台的脚本工具',
    type: '工具',
    tags: ['部署', '自动化', 'DevOps'],
    author: '运维专家',
    date: '2024-01-03',
    downloadCount: 176,
    fileSize: '890KB',
    downloadUrl: '/downloads/deployment-scripts.tar.gz'
  }
];

// 获取资源列表
export const getResources = async (params?: {
  type?: string;
  search?: string;
  sortBy?: 'date' | 'popular' | 'download';
  page?: number;
  limit?: number;
}): Promise<{ data: Resource[]; total: number }> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 50));
  
  let filteredResources = [...mockResources];
  
  // 类型过滤
  if (params?.type && params.type !== '全部') {
    filteredResources = filteredResources.filter(resource => resource.type === params.type);
  }
  
  // 搜索过滤
  if (params?.search) {
    filteredResources = filteredResources.filter(resource =>
      resource.title.toLowerCase().includes(params.search!.toLowerCase()) ||
      resource.description.toLowerCase().includes(params.search!.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(params.search!.toLowerCase()))
    );
  }
  
  // 排序
  if (params?.sortBy) {
    switch (params.sortBy) {
      case 'popular':
        // 使用下载数作为受欢迎程度
        filteredResources.sort((a, b) => (b.downloadCount + (b.likes || 0)) - (a.downloadCount + (a.likes || 0)));
        break;
      case 'download':
        filteredResources.sort((a, b) => b.downloadCount - a.downloadCount);
        break;
      default: // 默认按日期排序
        filteredResources.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
    }
  }
  
  // 分页
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    data: filteredResources.slice(startIndex, endIndex),
    total: filteredResources.length
  };
};

// 获取单个资源详情
export const getResourceById = async (id: number): Promise<Resource | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockResources.find(resource => resource.id === id) || null;
};

// 下载资源
export const downloadResource = async (id: number): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  console.log(`开始下载资源 ${id}`);
  return true;
};