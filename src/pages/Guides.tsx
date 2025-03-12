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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">旅游攻略</h1>
          <Link
            to="/guides/new"
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            创建攻略
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex space-x-4 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedTag('全部')}
              className={`px-4 py-2 rounded-full ${
                selectedTag === '全部'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              } transition-colors`}
            >
              全部
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full ${
                  selectedTag === tag
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                } transition-colors`}
              >
                {tag}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="搜索攻略..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map(guide => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="md:flex h-full">
                <div className="md:flex-shrink-0">
                  <img
                    src={guide.image}
                    alt={guide.title}
                    className="h-48 w-full md:w-48 object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {guide.tags.map(tag => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link to={`/guides/${guide.id}`}>
                    <h2 className="text-xl font-semibold mb-2 hover:text-blue-600 transition-colors">
                      {guide.title}
                    </h2>
                  </Link>
                  <p className="text-gray-600 mb-4 flex-grow">{guide.excerpt}</p>
                  <div className="flex items-center justify-between text-gray-500 text-sm">
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 mr-1" />
                      <span className="mr-4">{guide.author}</span>
                      <ClockIcon className="h-4 w-4 mr-1" />
                      <span className="mr-4">{guide.readTime}</span>
                      <HeartIcon className="h-4 w-4 mr-1" />
                      <span>{guide.likes}</span>
                    </div>
                    <Link
                      to={`/guides/edit/${guide.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      编辑
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredGuides.length === 0 && (
          <div className="text-center text-gray-600 py-12">
            没有找到符合条件的攻略
          </div>
        )}
      </div>
    </div>
  );
};

export default Guides; 
