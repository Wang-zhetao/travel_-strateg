import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ClockIcon, UserIcon, HeartIcon, PlusIcon } from '@heroicons/react/24/outline';

// 定义攻略的接口类型
interface Guide {
  id: string;
  title: string;
  author?: string; // 可选字段
  date?: string; // 可选字段
  readTime?: string; // 可选字段
  likes?: number; // 可选字段
  image?: string; // 兼容旧数据
  mainImage?: string; // 后端实际字段名
  excerpt?: string;
  tags: string[];
  created_at?: string;
  updated_at?: string;
  content?: any[];
  isNew?: boolean; // 新增字段，标记是否为新发布的攻略
  highlighted?: boolean; // 新增字段，标记是否为新发布的攻略
}

// 原硬编码数据保留作为备用，如果API请求失败时显示
const fallbackGuides = [
  {
    id: '1',
    title: '巴厘岛完全攻略：10天深度游',
    author: '旅行达人',
    date: '2024-03-01',
    readTime: '15分钟',
    likes: 328,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
    excerpt: '从文化体验到海滩度假，这份巴厘岛攻略将带你深入探索这个天堂般的岛屿。',
    tags: ['海岛', '美食', '文化'],
  },
  {
    id: '2',
    title: '北海道自由行：最佳行程规划',
    author: '美食家',
    date: '2024-02-28',
    readTime: '12分钟',
    likes: 256,
    image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989',
    excerpt: '详细的北海道旅行规划，包括交通、住宿、美食和景点推荐。',
    tags: ['自然', '美食', '温泉'],
  },
  {
    id: '3',
    title: '圣托里尼深度游：悬崖酒店体验',
    author: '摄影师',
    date: '2024-02-25',
    readTime: '10分钟',
    likes: 412,
    image: 'https://images.unsplash.com/photo-1469796466635-455ede028aca',
    excerpt: '探索圣托里尼最美的悬崖酒店，体验爱琴海上最浪漫的日落。',
    tags: ['浪漫', '美景', '酒店'],
  },
  {
    id: '4',
    title: '京都赏樱攻略：最佳观赏地点',
    author: '文化达人',
    date: '2024-02-20',
    readTime: '8分钟',
    likes: 289,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e',
    excerpt: '一份完整的京都赏樱指南，包括最佳观赏时间和地点推荐。',
    tags: ['文化', '赏樱', '古迹'],
  },
  {
    id: '5',
    title: '马尔代夫水上屋全攻略',
    author: '奢旅专家',
    date: '2024-02-15',
    readTime: '11分钟',
    likes: 356,
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8',
    excerpt: '马尔代夫水上屋选择指南，帮你找到最适合的岛屿和度假村。',
    tags: ['海岛', '奢华', '度假'],
  },
  {
    id: '6',
    title: '巴黎艺术之旅：博物馆与画廊',
    author: '艺术爱好者',
    date: '2024-02-10',
    readTime: '14分钟',
    likes: 198,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
    excerpt: '探索巴黎丰富的艺术宝藏，从卢浮宫到奥赛博物馆的完整指南。',
    tags: ['城市', '艺术', '文化'],
  },
];

const Guides = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const newGuideId = searchParams.get('new');
  
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState('全部');
  const [searchTerm, setSearchTerm] = useState('');
  
  //攻略列表的引用
  const guideRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // 从后端API获取攻略数据
  useEffect(() => {
    const fetchGuides = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/api/guides');
        
        if (!response.ok) {
          throw new Error(`获取数据失败，状态码: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('获取到的攻略数据:', data);
        
        // 转换API返回的数据格式以匹配UI组件需要的格式
        const formattedApiData = data.map((guide: any) => ({
          ...guide,
          image: guide.mainImage, // 将mainImage复制到image字段供UI使用
          likes: guide.likes || 0,
          author: guide.author || '匿名用户',
          readTime: guide.readTime || '5分钟',
          date: guide.date || new Date(guide.created_at).toLocaleDateString('zh-CN'),
          excerpt: guide.excerpt || guide.title + '的精彩内容...',
          isNew: true, // 标记是否为新发布的攻略
          highlighted: guide.id === newGuideId, // 标记是否为新发布的攻略
        }));
        
        // 将格式化后的后端数据和备用数据合并
        const combinedGuides = [...formattedApiData, ...fallbackGuides];
        setGuides(combinedGuides);
        setError(null);
      } catch (err) {
        console.error('获取攻略数据失败:', err);
        setError('获取攻略数据失败，请刷新页面重试');
        // 如果API请求失败，使用备用数据
        setGuides(fallbackGuides);
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, [newGuideId]);
  
  // 当页面加载完成后，如果有新发布的攻略，滚动到该攻略
  useEffect(() => {
    if (!loading && newGuideId && guideRefs.current[newGuideId]) {
      setTimeout(() => {
        guideRefs.current[newGuideId]?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 500); // 等待0.5秒后滚动到新发布的攻略
    }
  }, [loading, newGuideId, guides]);

  // 计算所有标签，用于过滤
  const allTags = Array.from(new Set(guides.flatMap(guide => guide.tags)));

  const filteredGuides = guides.filter(guide => {
    const matchesTag = selectedTag === '全部' || guide.tags.includes(selectedTag);
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (guide.excerpt && guide.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesTag && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16">
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 md:mb-0">
            <span className="inline-block border-b-4 border-blue-500 pb-2">旅游攻略</span>
          </h1>
          <Link
            to="/guides/new"
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            创建攻略
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0 bg-white p-6 rounded-xl shadow-md">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              onClick={() => setSelectedTag('全部')}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedTag === '全部'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              全部
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedTag === tag
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="搜索攻略..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              刷新页面
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredGuides.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-xl mb-4">暂无攻略内容</p>
            <Link 
              to="/guides/new" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              创建第一篇攻略
            </Link>
          </div>
        )}

        {/* Guides Grid */}
        {!loading && !error && filteredGuides.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGuides.map(guide => (
              <motion.div
                key={guide.id}
                ref={(el) => { guideRefs.current[guide.id] = el; }}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: guide.highlighted ? [1, 1.05, 1] : 1,
                }}
                transition={{
                  duration: 0.3,
                  scale: guide.highlighted ? {
                    duration: 0.8,
                    repeat: 2,
                    repeatType: 'reverse'
                  } : undefined
                }}
                whileHover={{ y: -10 }}
                className={`bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl flex flex-col h-full ${
                  guide.highlighted 
                    ? 'ring-4 ring-blue-500 ring-offset-4' 
                    : guide.isNew 
                      ? 'ring-2 ring-blue-500 ring-offset-2' 
                      : ''
                }`}
              >
                <div className="relative">
                  <img
                    src={guide.image || guide.mainImage} // 优先使用image，如果没有则使用mainImage
                    alt={guide.title}
                    className="h-64 w-full object-cover"
                    onError={(e) => {
                      console.error('图片加载失败:', guide.image || guide.mainImage);
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg width="800" height="400" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="800" height="400" fill="%23f5f5f5"%3E%3C/rect%3E%3Cg%3E%3Ctext x="50%" y="50%" font-family="Arial" font-size="24" text-anchor="middle" fill="%23999"%3E图片加载失败%3C/text%3E%3C/g%3E%3C/svg%3E';
                    }}
                  />
                  <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 m-4 rounded-lg shadow-md">
                    <div className="flex items-center">
                      <HeartIcon className="h-4 w-4 mr-1" />
                      <span>{guide.likes || 0}</span>
                    </div>
                  </div>
                  {guide.isNew && (
                    <div className="absolute top-0 left-0 bg-green-500 text-white px-3 py-1 m-4 rounded-lg shadow-md">
                      <span className="flex items-center">
                        <span className="mr-1">新</span>
                        <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {guide.tags.map(tag => (
                      <span
                        key={tag}
                        className="bg-blue-50 text-blue-600 text-sm px-3 py-1 rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link to={`/guides/${guide.id}`} className="block group">
                    <h2 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors">
                      {guide.title}
                    </h2>
                  </Link>
                  <p className="text-gray-600 mb-4 flex-grow">{guide.excerpt || guide.title}</p>
                  <div className="flex items-center justify-between text-gray-500 text-sm mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 mr-1" />
                      <span className="mr-4 text-gray-700 font-medium">{guide.author || '匿名用户'}</span>
                      <ClockIcon className="h-4 w-4 mr-1" />
                      <span>{guide.readTime || '5分钟'}</span>
                    </div>
                    <Link
                      to={`/guides/edit/${guide.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      编辑
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Guides;
