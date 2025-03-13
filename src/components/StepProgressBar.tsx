// src/components/StepProgressBar.tsx
import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/outline';

export interface Step {
  name: string;
  description: string;
}

interface StepProgressBarProps {
  steps: Step[];
  activeStep: number;
  setActiveStep: (step: number) => void;
}

const StepProgressBar: React.FC<StepProgressBarProps> = ({ 
  steps, 
  activeStep, 
  setActiveStep 
}) => {
  return (
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
  );
};

export default StepProgressBar;
