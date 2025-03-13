import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ClockIcon, UserIcon, HeartIcon, PlusIcon } from '@heroicons/react/24/outline';

const guides = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
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
    id: 6,
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

const allTags = Array.from(new Set(guides.flatMap(guide => guide.tags)));

const Guides = () => {
  const [selectedTag, setSelectedTag] = useState('全部');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGuides = guides.filter(guide => {
    const matchesTag = selectedTag === '全部' || guide.tags.includes(selectedTag);
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
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

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGuides.map(guide => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl flex flex-col h-full"
            >
              <div className="relative">
                <img
                  src={guide.image}
                  alt={guide.title}
                  className="h-64 w-full object-cover"
                />
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 m-4 rounded-lg shadow-md">
                  <div className="flex items-center">
                    <HeartIcon className="h-4 w-4 mr-1" />
                    <span>{guide.likes}</span>
                  </div>
                </div>
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
                <p className="text-gray-600 mb-4 flex-grow">{guide.excerpt}</p>
                <div className="flex items-center justify-between text-gray-500 text-sm mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-1" />
                    <span className="mr-4 text-gray-700 font-medium">{guide.author}</span>
                    <ClockIcon className="h-4 w-4 mr-1" />
                    <span>{guide.readTime}</span>
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

        {filteredGuides.length === 0 && (
          <div className="text-center bg-white p-12 rounded-xl shadow-md mt-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-600 text-lg font-medium">没有找到符合条件的攻略</p>
            <button 
              onClick={() => { setSelectedTag('全部'); setSearchTerm(''); }}
              className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors"
            >
              重置搜索
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Guides;
