import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const destinations = [
  {
    id: 1,
    name: '巴厘岛',
    country: '印度尼西亚',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
    description: '印尼最受欢迎的旅游目的地，拥有美丽的海滩和独特的文化',
    category: '海岛',
  },
  {
    id: 2,
    name: '北海道',
    country: '日本',
    image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989',
    description: '日本著名的旅游胜地，四季都有独特的魅力',
    category: '自然风光',
  },
  {
    id: 3,
    name: '圣托里尼',
    country: '希腊',
    image: 'https://images.unsplash.com/photo-1469796466635-455ede028aca',
    description: '希腊最美丽的岛屿之一，以其蓝顶白墙建筑闻名于世',
    category: '海岛',
  },
  {
    id: 4,
    name: '巴黎',
    country: '法国',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
    description: '浪漫之都，艺术与美食的天堂',
    category: '城市',
  },
  {
    id: 5,
    name: '京都',
    country: '日本',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e',
    description: '日本传统文化的代表，拥有众多历史古迹',
    category: '文化古迹',
  },
  {
    id: 6,
    name: '马尔代夫',
    country: '马尔代夫',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8',
    description: '世界顶级的度假胜地，水上屋和海底世界闻名遐迩',
    category: '海岛',
  },
];

const categories = ['全部', '海岛', '自然风光', '城市', '文化古迹'];

const Destinations = () => {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDestinations = destinations.filter((destination) => {
    const matchesCategory = selectedCategory === '全部' || destination.category === selectedCategory;
    const matchesSearch = destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destination.country.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8">探索目的地</h1>
        
        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                } transition-colors`}
              >
                {category}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="搜索目的地或国家..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDestinations.map((destination) => (
            <motion.div
              key={destination.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="relative h-48">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium">
                  {destination.category}
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold">{destination.name}</h2>
                  <span className="text-gray-600">{destination.country}</span>
                </div>
                <p className="text-gray-600 mb-4">{destination.description}</p>
                <Link
                  to={`/destinations/${destination.id}`}
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  查看详情
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <div className="text-center text-gray-600 py-12">
            没有找到符合条件的目的地
          </div>
        )}
      </div>
    </div>
  );
};

export default Destinations; 
