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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16">
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
          <span className="inline-block border-b-4 border-blue-500 pb-2">探索目的地</span>
        </h1>
        
        {/* Search and Filter */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0 bg-white p-6 rounded-xl shadow-md">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="搜索目的地或国家..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredDestinations.map((destination) => (
            <motion.div
              key={destination.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl flex flex-col h-full"
            >
              <div className="relative h-56 overflow-hidden group">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-lg shadow-md text-sm font-medium">
                  {destination.category}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-bold text-gray-800">{destination.name}</h2>
                  <span className="text-blue-600 font-medium text-sm bg-blue-50 px-2 py-1 rounded">{destination.country}</span>
                </div>
                <p className="text-gray-600 mb-4 flex-grow">{destination.description}</p>
                <Link
                  to={`/destinations/${destination.id}`}
                  className="inline-block bg-blue-600 text-white text-center px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-transform duration-300 w-full"
                >
                  查看详情
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <div className="text-center bg-white p-12 rounded-xl shadow-md mt-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-600 text-lg font-medium">没有找到符合条件的目的地</p>
            <button 
              onClick={() => { setSelectedCategory('全部'); setSearchTerm(''); }}
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

export default Destinations;
