import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClockIcon, UserIcon, HeartIcon, CalendarIcon, PencilIcon } from '@heroicons/react/24/outline';

// 模拟攻略详细数据
const guideData = {
  id: 1,
  title: '巴厘岛完全攻略：10天深度游',
  author: '旅行达人',
  date: '2024-03-01',
  readTime: '15分钟',
  likes: 328,
  mainImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
  tags: ['海岛', '美食', '文化'],
  content: [
    {
      type: 'section',
      title: '行前准备',
      content: `巴厘岛位于印度尼西亚，是一个热带岛屿天堂。在出发前，需要注意以下几点：
      1. 最佳旅行时间：4月至10月的旱季
      2. 签证：落地签证可停留30天
      3. 货币：建议在当地兑换印尼盾
      4. 穿着：轻便舒适的夏季服装，参观寺庙需要准备长裤或沙龙`,
    },
    {
      type: 'section',
      title: '行程安排',
      content: `Day 1-2：库塔海滩区
      - 入住酒店，适应当地时差
      - 库塔海滩冲浪或者享受日光浴
      - 逛库塔艺术市场
      - 欣赏海滩日落
      
      Day 3-4：乌布文化之旅
      - 参观猴子森林
      - 德格拉朗梯田
      - 乌布市场
      - 乌布皇宫
      - 参加传统舞蹈表演
      
      Day 5-6：努沙杜瓦
      - 水上运动体验
      - 海底漫步
      - SPA护理
      - 海鲜晚餐
      
      Day 7-8：神圣寺庙之旅
      - 塔纳罗特寺
      - 乌鲁瓦图寺
      - 圣泉寺
      - 观看火舞表演
      
      Day 9-10：金巴兰
      - 放松休闲
      - 享受沙滩
      - 日落海鲜烧烤
      - 购物返程`,
    },
    {
      type: 'section',
      title: '美食推荐',
      content: `1. 印尼炒饭（Nasi Goreng）
      2. 沙爹（Satay）
      3. 峇厘烤猪排（Babi Guling）
      4. 印尼炒面（Mie Goreng）
      5. 海鲜烧烤
      6. 热带水果`,
    },
    {
      type: 'section',
      title: '交通建议',
      content: `1. 机场到酒店：建议预约接机服务
      2. 岛内交通：
         - 包车：最方便，可以和司机商定行程
         - 出租车：市区内短途推荐
         - 摩托车：适合年轻人探索小路
      3. 不同区域间的转移：建议包车或预约接送`,
    },
    {
      type: 'section',
      title: '注意事项',
      content: `1. 防晒必备：靠近赤道，紫外线强
      2. 饮水安全：饮用矿泉水
      3. 着装得体：进入寺庙需要穿着得体
      4. 货币兑换：建议在正规兑换点
      5. 小费文化：服务业普遍有小费
      6. 保险：建议购买旅行保险`,
    },
  ],
  relatedGuides: [
    {
      id: 2,
      title: '巴厘岛美食地图',
      image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62',
    },
    {
      id: 3,
      title: '巴厘岛最佳拍照地点',
      image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b',
    },
    {
      id: 4,
      title: '巴厘岛水上活动全指南',
      image: 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8',
    },
  ],
};

const GuideDetail = () => {
  const { id } = useParams();
  // 实际应用中，这里应该根据 id 从 API 获取数据
  const guide = guideData;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh]">
        <img
          src={guide.mainImage}
          alt={guide.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-[1440px] w-full mx-auto px-4 text-white text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-center space-x-2 mb-4">
                {guide.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{guide.title}</h1>
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 mr-2" />
                  <span>{guide.author}</span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  <span>{guide.date}</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  <span>{guide.readTime}</span>
                </div>
                <div className="flex items-center">
                  <HeartIcon className="h-5 w-5 mr-2" />
                  <span>{guide.likes}</span>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  to={`/guides/edit/${guide.id}`}
                  className="inline-flex items-center bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full transition-colors"
                >
                  <PencilIcon className="h-5 w-5 mr-2" />
                  编辑攻略
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1440px] w-full mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            {guide.content.map((section, index) => (
              <div key={index} id={`section-${index}`} className="mb-12">
                <h2 className="text-3xl font-bold mb-6">{section.title}</h2>
                <div className="prose prose-lg max-w-none">
                  {section.content.split('\n').map((paragraph, i) => (
                    <p key={i} className="mb-4 text-gray-700 whitespace-pre-wrap">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-8">
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold mb-4">目录</h3>
                <ul className="space-y-2">
                  {guide.content.map((section, index) => (
                    <li key={index}>
                      <a href={`#section-${index}`} className="text-blue-600 hover:text-blue-800">
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">相关攻略</h3>
                <div className="space-y-4">
                  {guide.relatedGuides.map((relatedGuide) => (
                    <motion.div
                      key={relatedGuide.id}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-lg overflow-hidden shadow-sm"
                    >
                      <img
                        src={relatedGuide.image}
                        alt={relatedGuide.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="text-md font-semibold hover:text-blue-600 transition-colors">
                          {relatedGuide.title}
                        </h4>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GuideDetail; 
