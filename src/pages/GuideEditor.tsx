import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

// 模拟攻略数据获取函数
const getGuideData = (id: string | undefined) => {
  // 实际应用中，这里应该从 API 获取数据
  return {
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
        - 参加传统舞蹈表演`,
      },
    ],
  };
};

const GuideEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [guide, setGuide] = useState<any>(null);
  const [availableTags] = useState(['海岛', '美食', '文化', '自然', '城市', '古迹', '浪漫', '美景', '酒店', '温泉', '赏樱', '奢华', '度假', '艺术']);

  useEffect(() => {
    // 模拟数据加载
    setTimeout(() => {
      const data = getGuideData(id);
      setGuide(data);
      setIsLoading(false);
    }, 500);
  }, [id]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuide({ ...guide, title: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuide({ ...guide, mainImage: e.target.value });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = guide.tags.includes(tag)
      ? guide.tags.filter((t: string) => t !== tag)
      : [...guide.tags, tag];
    setGuide({ ...guide, tags: newTags });
  };

  const handleSectionTitleChange = (index: number, value: string) => {
    const newContent = [...guide.content];
    newContent[index].title = value;
    setGuide({ ...guide, content: newContent });
  };

  const handleSectionContentChange = (index: number, value: string) => {
    const newContent = [...guide.content];
    newContent[index].content = value;
    setGuide({ ...guide, content: newContent });
  };

  const addNewSection = () => {
    const newContent = [
      ...guide.content,
      {
        type: 'section',
        title: '新章节标题',
        content: '在这里添加内容...',
      },
    ];
    setGuide({ ...guide, content: newContent });
  };

  const removeSection = (index: number) => {
    if (guide.content.length <= 1) {
      alert('至少需要保留一个章节');
      return;
    }
    const newContent = guide.content.filter((_: any, i: number) => i !== index);
    setGuide({ ...guide, content: newContent });
  };

  const handleSave = () => {
    setIsSaving(true);
    // 模拟保存到服务器
    setTimeout(() => {
      setIsSaving(false);
      // 保存成功后跳转到详情页
      navigate(`/guides/${guide.id}`);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8">编辑旅游攻略</h1>

          {/* 基本信息 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">基本信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">标题</label>
                <input
                  type="text"
                  value={guide.title}
                  onChange={handleTitleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">封面图片 URL</label>
                <input
                  type="text"
                  value={guide.mainImage}
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 标签 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">标签</h2>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-4 py-2 rounded-full ${
                    guide.tags.includes(tag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* 内容章节 */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">内容章节</h2>
              <button
                onClick={addNewSection}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <PlusCircleIcon className="h-5 w-5 mr-1" />
                添加章节
              </button>
            </div>

            {guide.content.map((section: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 p-6 bg-gray-50 rounded-lg"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">章节 {index + 1}</h3>
                  <button
                    onClick={() => removeSection(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">章节标题</label>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => handleSectionTitleChange(index, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">章节内容</label>
                  <textarea
                    value={section.content}
                    onChange={(e) => handleSectionContentChange(index, e.target.value)}
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
                isSaving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? '保存中...' : '保存'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideEditor; 
