// src/components/StepMessage.tsx
import { motion } from 'framer-motion';

interface StepMessageProps {
  activeStep: number;
}

const StepMessage: React.FC<StepMessageProps> = ({ activeStep }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      key={activeStep}
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
  );
};

export default StepMessage;
