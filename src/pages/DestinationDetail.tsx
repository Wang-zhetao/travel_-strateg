import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

// 模拟目的地详细数据
const destinationData = {
  id: 1,
  name: '巴厘岛',
  country: '印度尼西亚',
  description: '巴厘岛是印度尼西亚最受欢迎的旅游目的地之一，以其美丽的海滩、独特的文化和壮观的自然景观而闻名。这里有着丰富的文化遗产、传统舞蹈、精美的手工艺品和令人垂涎的美食。',
  mainImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
  gallery: [
    'https://images.unsplash.com/photo-1544644181-1484b3fdfc62',
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
    'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b',
    'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8',
  ],
  highlights: [
    {
      title: '乌布文化之旅',
      description: '探索巴厘岛文化中心，参观传统市场、皇宫和艺术画廊。',
    },
    {
      title: '海滩休闲时光',
      description: '在库塔海滩享受阳光、冲浪和日落美景。',
    },
    {
      title: '神圣寺庙之旅',
      description: '参观塔纳罗特寺和乌鲁瓦图寺等著名寺庙。',
    },
    {
      title: '美食探索',
      description: '品尝印尼传统美食，参加烹饪课程。',
    },
  ],
  practicalInfo: {
    bestTimeToVisit: '4月至10月（旱季）',
    language: '印尼语（英语普遍使用）',
    currency: '印尼盾',
    transportation: '出租车、摩托车租赁、包车服务',
    accommodation: '豪华度假村、精品酒店、民宿',
  },
};

const DestinationDetail = () => {
  const { id } = useParams();
  // 实际应用中，这里应该根据 id 从 API 获取数据
  const destination = destinationData;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh]">
        <img
          src={destination.mainImage}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center text-white text-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold mb-4"
            >
              {destination.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl"
            >
              {destination.country}
            </motion.p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6">目的地介绍</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            {destination.description}
          </p>
        </motion.div>

        {/* Gallery */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6">图片展示</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {destination.gallery.map((image, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="rounded-lg overflow-hidden"
              >
                <img
                  src={image}
                  alt={`${destination.name} - ${index + 1}`}
                  className="w-full h-48 object-cover"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6">亮点推荐</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destination.highlights.map((highlight, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-gray-50 p-6 rounded-lg"
              >
                <h3 className="text-xl font-semibold mb-3">{highlight.title}</h3>
                <p className="text-gray-600">{highlight.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Practical Information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-6">实用信息</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div>
                <dt className="font-semibold mb-2">最佳旅行时间</dt>
                <dd className="text-gray-600">{destination.practicalInfo.bestTimeToVisit}</dd>
              </div>
              <div>
                <dt className="font-semibold mb-2">当地语言</dt>
                <dd className="text-gray-600">{destination.practicalInfo.language}</dd>
              </div>
              <div>
                <dt className="font-semibold mb-2">货币</dt>
                <dd className="text-gray-600">{destination.practicalInfo.currency}</dd>
              </div>
              <div>
                <dt className="font-semibold mb-2">交通方式</dt>
                <dd className="text-gray-600">{destination.practicalInfo.transportation}</dd>
              </div>
              <div>
                <dt className="font-semibold mb-2">住宿选择</dt>
                <dd className="text-gray-600">{destination.practicalInfo.accommodation}</dd>
              </div>
            </dl>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DestinationDetail; 
