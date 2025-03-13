import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    关于我们: [
      { name: '联系我们', path: '/contact' },
      { name: '加入我们', path: '/careers' },
    ],
    旅行服务: [
      { name: '目的地', path: '/destinations' },
      { name: '旅游攻略', path: '/guides' },
      { name: '旅行保险', path: '/insurance' },
    ],
    帮助中心: [
      { name: '常见问题', path: '/faq' },
      { name: '用户协议', path: '/terms' },
      { name: '隐私政策', path: '/privacy' },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">TravelGuide</h3>
            <p className="text-gray-400 mb-4">
              为您提供最全面的旅游攻略和目的地指南，让每一次旅行都成为难忘的回忆。
            </p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>© {currentYear} TravelGuide. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
