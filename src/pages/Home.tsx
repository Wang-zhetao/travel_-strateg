import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const popularDestinations = [
  {
    id: 1,
    name: '巴厘岛',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
    description: '印尼最受欢迎的旅游目的地，拥有美丽的海滩和独特的文化',
  },
  {
    id: 2,
    name: '北海道',
    image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989',
    description: '日本著名的旅游胜地，四季都有独特的魅力',
  },
  {
    id: 3,
    name: '圣托里尼',
    image: 'https://images.unsplash.com/photo-1469796466635-455ede028aca',
    description: '希腊最美丽的岛屿之一，以其蓝顶白墙建筑闻名于世',
  },
  {
    id: 4,
    name: '巴黎',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
    description: '浪漫之都，艺术与美食的天堂',
  },
];

const featuredGuides = [
  {
    id: 1,
    title: '巴厘岛完全攻略',
    author: '旅行达人',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62',
    readTime: '10分钟',
  },
  {
    id: 2,
    title: '北海道自由行攻略',
    author: '美食家',
    image: 'https://images.unsplash.com/photo-1542931287-023b922fa89b',
    readTime: '15分钟',
  },
  {
    id: 3,
    title: '圣托里尼深度游',
    author: '摄影师',
    image: 'https://images.unsplash.com/photo-1469796466635-455ede028aca',
    readTime: '12分钟',
  },
  {
    id: 4,
    title: '京都赏樱攻略',
    author: '文化达人',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e',
    readTime: '8分钟',
  },
];

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-cover bg-center" style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1469474968028-56623f02e42e)'
      }}>
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative h-full flex items-center justify-center text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">探索世界的每个角落</h1>
            <p className="text-xl md:text-2xl mb-8">让我们为您的下一次冒险提供完美指南</p>
            <Link
              to="/destinations"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-medium transition-colors"
            >
              开始探索
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">热门目的地</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {popularDestinations.map((destination) => (
              <motion.div
                key={destination.id}
                whileHover={{ y: -10 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{destination.name}</h3>
                  <p className="text-gray-600 mb-4">{destination.description}</p>
                  <Link
                    to={`/destinations/${destination.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    了解更多 →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Guides */}
      <section className="py-16">
        <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">精选攻略</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredGuides.map((guide) => (
              <motion.div
                key={guide.id}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <img
                  src={guide.image}
                  alt={guide.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{guide.title}</h3>
                  <div className="flex items-center text-gray-600 mb-4">
                    <span>{guide.author}</span>
                    <span className="mx-2">·</span>
                    <span>{guide.readTime}</span>
                  </div>
                  <Link
                    to={`/guides/${guide.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    阅读攻略 →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 
