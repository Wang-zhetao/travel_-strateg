import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { UserIcon, PaperAirplaneIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatMessage {
  role: string;
  content: string;
}

interface ChatResponse {
  message: string;
  created_at: string;
}

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 使用DeepSeek大模型API处理聊天
  const processWithDeepSeek = async (userMessage: string): Promise<string> => {
    try {
      // 准备请求数据
      const requestData = {
        message: userMessage,
        history: chatHistory.length > 0 ? chatHistory : undefined,
      };
      
      // 调用后端API
      const response = await fetch('http://localhost:8080/api/chat/deepseek', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      if (!response.ok) {
        throw new Error(`请求失败，状态码: ${response.status}`);
      }
      
      const data: ChatResponse = await response.json();
      
      // 更新聊天历史
      const userChatMessage: ChatMessage = {
        role: 'user',
        content: userMessage,
      };
      
      const aiChatMessage: ChatMessage = {
        role: 'assistant',
        content: data.message,
      };
      
      setChatHistory(prev => [...prev, userChatMessage, aiChatMessage]);
      
      return data.message;
    } catch (error) {
      console.error('与DeepSeek API通信时出错:', error);
      return '抱歉，我暂时无法连接到服务器。请稍后再试。';
    }
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;
    const newMessage: Message = {
      id: Math.random().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputText('');
    setLoading(true);
    
    // 使用DeepSeek处理消息
    const response = await processWithDeepSeek(inputText);
    
    const aiMessage: Message = {
      id: Math.random().toString(),
      text: response,
      sender: 'ai',
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, aiMessage]);
    setLoading(false);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 按Enter键发送消息
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 在首次加载时显示欢迎消息
  useEffect(() => {
    const welcomeMessage: Message = {
      id: Math.random().toString(),
      text: '你好！我是基于DeepSeek大模型的旅游AI助手，可以回答与旅游相关的问题，推荐目的地，或者提供旅游攻略。请问有什么可以帮到你的吗？',
      sender: 'ai',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    
    // 添加初始AI消息到聊天历史
    setChatHistory([{
      role: 'assistant',
      content: '你好！我是基于DeepSeek大模型的旅游AI助手，可以回答与旅游相关的问题，推荐目的地，或者提供旅游攻略。请问有什么可以帮到你的吗？',
    }]);
  }, []);

  return (
    <div className="container mx-auto max-w-4xl pt-8 pb-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden h-[80vh] flex flex-col"
      >
        <div className="bg-blue-600 text-white p-4 flex items-center">
          <ChatBubbleLeftIcon className="h-6 w-6 mr-2" />
          <h1 className="text-xl font-semibold">DeepSeek旅游助手</h1>
        </div>
        
        <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
          {messages.map((message) => (
            <motion.div 
              key={message.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
            >
              {message.sender === 'ai' && (
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center mr-2">
                  <ChatBubbleLeftIcon className="h-5 w-5 text-white" />
                </div>
              )}
              <div
                className={`p-3 rounded-lg shadow-sm max-w-[70%] ${
                  message.sender === 'user' ? 'bg-blue-100' : 'bg-white'
                }`}
              >
                <p className="text-gray-800 whitespace-pre-wrap">{message.text}</p>
                <p className="text-xs text-gray-500 mt-1 text-right">{message.timestamp.toLocaleTimeString()}</p>
              </div>
              {message.sender === 'user' && (
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center ml-2">
                  <UserIcon className="h-5 w-5 text-gray-700" />
                </div>
              )}
            </motion.div>
          ))}
          {loading && (
            <div className="flex justify-center p-4">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="h-8 w-8 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full"
              />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t border-gray-200 bg-white relative">
          <div className="relative flex">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入问题...（例如：推荐一个旅游目的地）"
              className="w-full p-3 pr-12 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-white rounded-full focus:outline-none ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              title="发送消息"
              disabled={loading || inputText.trim() === ''}
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AIChat;
