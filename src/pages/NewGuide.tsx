import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  PlusCircleIcon, 
  TrashIcon, 
  PhotoIcon, 
  ArrowUpTrayIcon, 
  CheckIcon, 
  XMarkIcon,
  DocumentTextIcon,
  LinkIcon,
  QrCodeIcon,
  DocumentDuplicateIcon,
  PencilIcon,
  TableCellsIcon,
  CodeBracketIcon,
  ListBulletIcon,
  HashtagIcon
} from '@heroicons/react/24/outline';

const NewGuide = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [previewImage, setPreviewImage] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);
  const [availableTags] = useState(['海岛', '美食', '文化', '自然', '城市', '古迹', '浪漫', '美景', '酒店', '温泉', '赏樱', '奢华', '度假', '艺术']);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  const [guide, setGuide] = useState({
    title: '',
    mainImage: '',
    tags: [] as string[],
    content: [
      {
        type: 'section',
        title: '章节标题',
        content: '在这里添加内容...',
      },
    ],
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuide({ ...guide, title: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuide({ ...guide, mainImage: e.target.value });
    setPreviewImage(e.target.value);
  };

  const handleTagToggle = (tag: string) => {
    const newTags = guide.tags.includes(tag)
      ? guide.tags.filter((t) => t !== tag)
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
    
    // 滚动到新添加的章节
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  };

  const removeSection = (index: number) => {
    if (guide.content.length <= 1) {
      alert('至少需要保留一个章节');
      return;
    }
    const newContent = guide.content.filter((_, i) => i !== index);
    setGuide({ ...guide, content: newContent });
  };

  const validateForm = () => {
    if (!guide.title.trim()) {
      alert('请输入攻略标题');
      return false;
    }
    if (!guide.mainImage.trim()) {
      alert('请输入封面图片 URL');
      return false;
    }
    if (guide.tags.length === 0) {
      alert('请至少选择一个标签');
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    
    setIsSaving(true);
    // 模拟保存到服务器
    setTimeout(() => {
      setIsSaving(false);
      // 保存成功后跳转到攻略列表页
      navigate('/guides');
    }, 1000);
  };

  const nextStep = () => {
    if (activeStep < 2) {
      setActiveStep(activeStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const steps = [
    { name: '基本信息', description: '设置攻略标题和封面' },
    { name: '标签选择', description: '为攻略添加分类标签' },
    { name: '内容编辑', description: '编写攻略详细内容' },
  ];

  // 简单的Markdown渲染函数
  const renderMarkdown = (text: string) => {
    // 处理标题
    let rendered = text.replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold my-3">$1</h3>');
    rendered = rendered.replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold my-4">$1</h2>');
    rendered = rendered.replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold my-5">$1</h1>');
    
    // 处理粗体和斜体
    rendered = rendered.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    rendered = rendered.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // 处理链接
    rendered = rendered.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>');
    
    // 处理图片
    rendered = rendered.replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="my-4 rounded-lg max-w-full">');
    
    // 处理列表
    rendered = rendered.replace(/^\s*-\s*(.*$)/gm, '<li class="ml-4">$1</li>');
    rendered = rendered.replace(/^\s*\d+\.\s*(.*$)/gm, '<li class="ml-4 list-decimal">$1</li>');
    
    // 处理代码块
    rendered = rendered.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-3 rounded-lg my-3 overflow-x-auto"><code>$1</code></pre>');
    
    // 处理行内代码
    rendered = rendered.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>');
    
    // 处理分隔线
    rendered = rendered.replace(/^\s*---\s*$/gm, '<hr class="my-4 border-t border-gray-300">');
    
    // 处理段落
    rendered = rendered.replace(/^\s*(.+)$/gm, (match) => {
      if (
        !match.startsWith('<h') && 
        !match.startsWith('<li') && 
        !match.startsWith('<pre') && 
        !match.startsWith('<hr')
      ) {
        return `<p class="my-2">${match}</p>`;
      }
      return match;
    });
    
    // 将连续的列表项包装在ul或ol中
    rendered = rendered.replace(/<li class="ml-4">[\s\S]*?<\/li>/g, '<ul class="list-disc my-3 pl-5">$&</ul>');
    rendered = rendered.replace(/<li class="ml-4 list-decimal">[\s\S]*?<\/li>/g, '<ol class="list-decimal my-3 pl-5">$&</ol>');
    
    // 修复嵌套的ul和ol
    rendered = rendered.replace(/<\/ul>\s*<ul[^>]*>/g, '');
    rendered = rendered.replace(/<\/ol>\s*<ol[^>]*>/g, '');
    
    return rendered;
  };

  // 插入Markdown语法
  const insertMarkdown = (index: number, syntax: string, placeholder: string = '') => {
    const newContent = [...guide.content];
    const textarea = document.getElementById(`section-content-${index}`) as HTMLTextAreaElement;
    
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
      
      const beforeText = textarea.value.substring(0, start);
      const afterText = textarea.value.substring(end);
      
      let insertedText;
      if (selectedText) {
        insertedText = syntax.replace('$1', selectedText);
      } else {
        insertedText = syntax.replace('$1', placeholder);
      }
      
      newContent[index].content = beforeText + insertedText + afterText;
      setGuide({ ...guide, content: newContent });
      
      // 设置光标位置
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = start + insertedText.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    } else {
      // 如果没有找到textarea，直接在内容末尾添加
      newContent[index].content += syntax.replace('$1', placeholder);
      setGuide({ ...guide, content: newContent });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-xl overflow-hidden"
        >
          {/* 顶部进度条 */}
          <div className="bg-gradient-to-r from-gray-800 to-black p-6 text-white">
            <h1 className="text-3xl font-bold mb-4">创建新攻略</h1>
            <p className="text-gray-300 mb-8">分享你的旅行经验，帮助他人探索世界</p>
            
            {/* 步骤条 */}
            <div className="relative mb-12">
              {/* 步骤指示器 */}
              <div className="flex justify-between items-center relative z-10">
                {steps.map((step, index) => (
                  <motion.div 
                    key={index} 
                    className="flex flex-col items-center"
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <motion.button
                      onClick={() => {
                        if (index > activeStep) {
                          // 只允许点击当前或之前的步骤
                          const button = document.getElementById(`step-button-${activeStep}`);
                          if (button) {
                            button.classList.add('ring-4', 'ring-blue-300');
                            setTimeout(() => {
                              button.classList.remove('ring-4', 'ring-blue-300');
                            }, 300);
                          }
                          return;
                        }
                        setActiveStep(index);
                      }}
                      id={`step-button-${index}`}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold mb-2 
                        transition-all duration-300 relative
                        ${activeStep >= index 
                        ? 'bg-blue-500 text-white shadow-lg' 
                        : 'bg-gray-700 text-gray-400'}`}
                      whileTap={{ scale: 0.95 }}
                      whileHover={activeStep >= index ? { 
                        boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)', 
                        scale: 1.1
                      } : {}}
                    >
                      {activeStep > index ? (
                        <motion.div
                          initial={{ rotate: -90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CheckIcon className="h-6 w-6" />
                        </motion.div>
                      ) : (
                        <motion.span
                          key={`step-number-${index}`}
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {index + 1}
                        </motion.span>
                      )}
                      
                      {/* 当前步骤的脉冲效果 */}
                      {activeStep === index && (
                        <motion.div 
                          className="absolute w-full h-full rounded-full border-2 border-white"
                          initial={{ opacity: 1, scale: 1 }}
                          animate={{ opacity: 0, scale: 1.4 }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </motion.button>
                    <motion.div 
                      className="flex flex-col items-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <span className={`font-medium ${activeStep >= index ? 'text-white' : 'text-gray-400'}`}>
                        {step.name}
                      </span>
                      <span className={`text-xs mt-1 ${activeStep >= index ? 'text-gray-300' : 'text-gray-500'}`}>
                        {step.description}
                      </span>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
              
              {/* 水平连接线 */}
              <div className="absolute top-5 left-0 w-full h-[2px] bg-gray-700 -z-0">
                <motion.div 
                  initial={{ width: '0%' }}
                  animate={{ 
                    width: `${activeStep === 0 ? 0 : activeStep === 1 ? 50 : 100}%` 
                  }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 relative overflow-hidden"
                >
                  {/* 水波纹动画效果 */}
                  <motion.div 
                    className="absolute top-0 left-0 w-full h-full opacity-30"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)',
                      backgroundSize: '200% 100%',
                    }}
                    animate={{
                      backgroundPosition: ['100% 0%', '-100% 0%'],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: 'linear',
                    }}
                  />
                </motion.div>
              </div>
              
              {/* 小船图标 */}
              <motion.div 
                className="absolute top-[-25px] text-white"
                initial={{ left: '0%' }}
                animate={{ 
                  left: `${activeStep === 0 ? 0 : activeStep === 1 ? 50 : 100}%`,
                  translateX: '-50%',
                  y: [0, -5, 0],
                  rotate: [0, 5, 0, -5, 0]
                }}
                transition={{ 
                  duration: 0.5,
                  y: { repeat: Infinity, duration: 1.5 },
                  rotate: { repeat: Infinity, duration: 2 }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white drop-shadow-lg">
                  <path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"></path>
                  <path d="M4 15V4a1 1 0 0 1 1-1h3v7" />
                  <path d="M9 3h10l3 7" />
                  <line x1="2" y1="19" x2="22" y2="19" />
                </svg>
                {/* 小波纹效果 */}
                <motion.div
                  className="absolute -bottom-4 -left-4 -right-4 flex justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div 
                    className="w-2 h-2 bg-blue-300 rounded-full mx-0.5 opacity-70"
                    animate={{ y: [-1, -3, -1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div 
                    className="w-2 h-2 bg-blue-300 rounded-full mx-0.5 opacity-70"
                    animate={{ y: [-1, -4, -1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div 
                    className="w-2 h-2 bg-blue-300 rounded-full mx-0.5 opacity-70"
                    animate={{ y: [-1, -3, -1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  />
                </motion.div>
              </motion.div>
            </div>
            
            {/* 步骤提示信息 */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={activeStep} // 确保每次切换都会重新动画
              className="text-center text-sm text-gray-300 italic mt-2"
            >
              {activeStep === 0 && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  请填写攻略标题和封面图片
                </motion.span>
              )}
              {activeStep === 1 && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  选择适合你的攻略的标签
                </motion.span>
              )}
              {activeStep === 2 && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  最后一步！请填写你的攻略内容
                </motion.span>
              )}
            </motion.div>
          </div>

          <div className="p-8">
            {/* 步骤 1: 基本信息 */}
            {activeStep === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">基本信息</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      攻略标题 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={guide.title}
                      onChange={handleTitleChange}
                      placeholder="例如：巴厘岛深度游 - 10天完美行程"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      一个好的标题能吸引更多读者，建议包含目的地和行程天数
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      封面图片 <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="flex-grow">
                        <div className="relative">
                          <input
                            type="text"
                            value={guide.mainImage}
                            onChange={handleImageChange}
                            placeholder="输入图片URL地址"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pl-10"
                          />
                          <PhotoIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                    
                    {/* 图片预览 */}
                    {previewImage ? (
                      <div className="mt-4 relative rounded-lg overflow-hidden group">
                        <img 
                          src={previewImage} 
                          alt="封面预览" 
                          className="w-full h-48 object-cover rounded-lg"
                          onError={() => setPreviewImage('')}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                          <button 
                            onClick={() => setPreviewImage('')}
                            className="opacity-0 group-hover:opacity-100 bg-white p-2 rounded-full"
                          >
                            <XMarkIcon className="h-5 w-5 text-gray-700" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">输入URL后将显示图片预览</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 步骤 2: 标签选择 */}
            {activeStep === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">选择标签</h2>
                <p className="text-gray-600 mb-6">
                  为你的攻略选择合适的标签，这将帮助用户更容易找到你的内容
                </p>
                
                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="flex flex-wrap gap-3">
                    {availableTags.map((tag) => (
                      <motion.button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-full flex items-center ${
                          guide.tags.includes(tag)
                            ? 'bg-black text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                        } transition-colors shadow-sm`}
                      >
                        {guide.tags.includes(tag) && (
                          <CheckIcon className="h-4 w-4 mr-1" />
                        )}
                        {tag}
                      </motion.button>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">已选标签</h3>
                  <div className="flex flex-wrap gap-2">
                    {guide.tags.length > 0 ? (
                      guide.tags.map((tag) => (
                        <span key={tag} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-600 text-sm">请至少选择一个标签</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 步骤 3: 内容编辑 */}
            {activeStep === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                ref={contentRef}
                className="bg-white"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">编辑攻略内容</h2>
                    <p className="text-gray-600 max-w-2xl">
                      使用富文本编辑器或Markdown语法创建精美的旅游攻略
                    </p>
                  </div>
                  <div className="flex space-x-3 mt-4 md:mt-0">
                    <button
                      onClick={() => setIsPreviewMode(!isPreviewMode)}
                      className={`flex items-center px-3 py-1.5 rounded-md border transition-colors ${
                        isPreviewMode 
                          ? 'bg-black text-white border-black' 
                          : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <DocumentTextIcon className="h-4 w-4 mr-1" />
                      {isPreviewMode ? '编辑模式' : '预览模式'}
                    </button>
                    <motion.button
                      onClick={addNewSection}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center bg-black text-white px-3 py-1.5 rounded-md hover:bg-gray-800 transition-colors shadow-sm"
                    >
                      <PlusCircleIcon className="h-4 w-4 mr-1" />
                      添加章节
                    </motion.button>
                  </div>
                </div>

                {guide.content.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="mb-8 border border-gray-200 rounded-lg overflow-hidden"
                  >
                    {/* 章节标题 */}
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-gray-500 text-sm mr-3">章节 {index + 1}</span>
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => handleSectionTitleChange(index, e.target.value)}
                          placeholder="章节标题"
                          className="text-lg font-medium text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0 w-full"
                        />
                      </div>
                      <div className="flex items-center space-x-1">
                        {index > 0 && (
                          <button
                            onClick={() => {
                              const newContent = [...guide.content];
                              [newContent[index], newContent[index - 1]] = [newContent[index - 1], newContent[index]];
                              setGuide({ ...guide, content: newContent });
                            }}
                            className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-200 transition-colors"
                            title="上移章节"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                        )}
                        {index < guide.content.length - 1 && (
                          <button
                            onClick={() => {
                              const newContent = [...guide.content];
                              [newContent[index], newContent[index + 1]] = [newContent[index + 1], newContent[index]];
                              setGuide({ ...guide, content: newContent });
                            }}
                            className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-200 transition-colors"
                            title="下移章节"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            const newContent = [...guide.content];
                            newContent.splice(index + 1, 0, {
                              type: 'section',
                              title: '新章节标题',
                              content: '在这里添加内容...',
                            });
                            setGuide({ ...guide, content: newContent });
                          }}
                          className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-200 transition-colors"
                          title="在下方添加章节"
                        >
                          <DocumentDuplicateIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeSection(index)}
                          className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-200 transition-colors"
                          title="删除章节"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {!isPreviewMode && (
                      <>
                        {/* Markdown工具栏 */}
                        <div className="flex items-center space-x-1 px-4 py-2 border-b border-gray-200 overflow-x-auto bg-gray-50">
                          <div className="flex items-center space-x-1 pr-2 border-r border-gray-200">
                            <button 
                              className="p-1 rounded hover:bg-gray-200 text-gray-700"
                              onClick={() => insertMarkdown(index, '# $1', '标题')}
                              title="标题1"
                            >
                              <HashtagIcon className="h-4 w-4" />
                            </button>
                            <button 
                              className="p-1 rounded hover:bg-gray-200 text-gray-700 text-xs"
                              onClick={() => insertMarkdown(index, '## $1', '标题')}
                              title="标题2"
                            >
                              <div className="flex items-center">
                                <HashtagIcon className="h-4 w-4" />
                                <HashtagIcon className="h-4 w-4" />
                              </div>
                            </button>
                            <button 
                              className="p-1 rounded hover:bg-gray-200 text-gray-700 text-xs"
                              onClick={() => insertMarkdown(index, '### $1', '标题')}
                              title="标题3"
                            >
                              <div className="flex items-center">
                                <HashtagIcon className="h-4 w-4" />
                                <HashtagIcon className="h-4 w-4" />
                                <HashtagIcon className="h-4 w-4" />
                              </div>
                            </button>
                          </div>

                          <div className="flex items-center space-x-1 px-2 border-r border-gray-200">
                            <button 
                              className="p-1 rounded hover:bg-gray-200 font-bold"
                              onClick={() => insertMarkdown(index, '**$1**', '粗体文本')}
                              title="粗体"
                            >
                              B
                            </button>
                            <button 
                              className="p-1 rounded hover:bg-gray-200 italic"
                              onClick={() => insertMarkdown(index, '*$1*', '斜体文本')}
                              title="斜体"
                            >
                              I
                            </button>
                            <button 
                              className="p-1 rounded hover:bg-gray-200"
                              onClick={() => insertMarkdown(index, '`$1`', '代码')}
                              title="行内代码"
                            >
                              <CodeBracketIcon className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="flex items-center space-x-1 px-2 border-r border-gray-200">
                            <button 
                              className="p-1 rounded hover:bg-gray-200"
                              onClick={() => insertMarkdown(index, '- $1\n- \n- ', '列表项')}
                              title="无序列表"
                            >
                              <ListBulletIcon className="h-4 w-4" />
                            </button>
                            <button 
                              className="p-1 rounded hover:bg-gray-200"
                              onClick={() => insertMarkdown(index, '1. $1\n2. \n3. ', '列表项')}
                              title="有序列表"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h10M7 16h10M3 8h.01M3 12h.01M3 16h.01" />
                              </svg>
                            </button>
                          </div>

                          <div className="flex items-center space-x-1 px-2 border-r border-gray-200">
                            <button 
                              className="p-1 rounded hover:bg-gray-200"
                              onClick={() => insertMarkdown(index, '[链接文本](https://example.com)', '')}
                              title="插入链接"
                            >
                              <LinkIcon className="h-4 w-4" />
                            </button>
                            <button 
                              className="p-1 rounded hover:bg-gray-200"
                              onClick={() => insertMarkdown(index, '![图片描述](https://example.com/image.jpg)', '')}
                              title="插入图片"
                            >
                              <PhotoIcon className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="flex items-center space-x-1 px-2">
                            <button 
                              className="p-1 rounded hover:bg-gray-200"
                              onClick={() => insertMarkdown(index, '```\n$1\n```', '代码块')}
                              title="代码块"
                            >
                              <QrCodeIcon className="h-4 w-4" />
                            </button>
                            <button 
                              className="p-1 rounded hover:bg-gray-200"
                              onClick={() => insertMarkdown(index, '---\n', '')}
                              title="分隔线"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16" />
                              </svg>
                            </button>
                            <button 
                              className="p-1 rounded hover:bg-gray-200"
                              onClick={() => insertMarkdown(index, '| 表头1 | 表头2 | 表头3 |\n| --- | --- | --- |\n| 单元格1 | 单元格2 | 单元格3 |\n| 单元格4 | 单元格5 | 单元格6 |', '')}
                              title="表格"
                            >
                              <TableCellsIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* 编辑区域 */}
                        <div className="p-4">
                          <textarea
                            id={`section-content-${index}`}
                            value={section.content}
                            onChange={(e) => handleSectionContentChange(index, e.target.value)}
                            placeholder="在这里输入内容，支持Markdown语法..."
                            rows={10}
                            className="w-full border-none focus:outline-none focus:ring-0 resize-none text-gray-700 placeholder-gray-400 font-mono"
                          />
                        </div>
                      </>
                    )}

                    {/* 预览模式 */}
                    {isPreviewMode && (
                      <div className="p-6 prose prose-sm sm:prose lg:prose-lg max-w-none">
                        <div 
                          dangerouslySetInnerHTML={{ __html: renderMarkdown(section.content) }} 
                          className="markdown-preview"
                        />
                      </div>
                    )}

                    {/* 底部状态栏 */}
                    <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>字数: {section.content.length}</span>
                        <span>最后编辑: {new Date().toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          className={`text-gray-500 hover:text-gray-700 ${isPreviewMode ? 'opacity-50' : ''}`}
                          disabled={isPreviewMode}
                        >
                          <PencilIcon className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => setIsPreviewMode(!isPreviewMode)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* 底部工具栏 */}
                <div className="mt-6 flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center text-gray-700 hover:text-gray-900">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      保存草稿
                    </button>
                    <button 
                      onClick={() => setIsPreviewMode(!isPreviewMode)}
                      className="flex items-center text-gray-700 hover:text-gray-900"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {isPreviewMode ? '编辑模式' : '预览模式'}
                    </button>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">总字数: {guide.content.reduce((acc, section) => acc + section.content.length, 0)}</span>
                    <span className="text-sm text-gray-500">Markdown</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 导航按钮 */}
            <div className="mt-8 flex justify-between">
              <button
                onClick={activeStep === 0 ? () => navigate('/guides') : prevStep}
                className="px-6 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
              >
                {activeStep === 0 ? '取消' : '上一步'}
              </button>
              
              {activeStep < 2 ? (
                <motion.button
                  onClick={nextStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors shadow-sm"
                >
                  下一步
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleSave}
                  disabled={isSaving}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors shadow-sm flex items-center ${
                    isSaving ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      保存中...
                    </>
                  ) : (
                    <>
                      <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
                      发布攻略
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NewGuide; 
