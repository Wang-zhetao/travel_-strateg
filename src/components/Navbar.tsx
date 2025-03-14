import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, PencilIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: '首页', path: '/' },
    { name: '目的地', path: '/destinations' },
    { name: '旅游攻略', path: '/guides' },
    { name: 'AI助手', path: '/chat' },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600">TravelGuide</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {link.path === '/chat' ? (
                  <div className="flex items-center">
                    <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                    {link.name}
                  </div>
                ) : (
                  link.name
                )}
              </Link>
            ))}
            <Link
              to="/guides/new"
              className="flex items-center bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <PencilIcon className="h-4 w-4 mr-1" />
              创建攻略
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 text-base font-medium ${
                  location.pathname === link.path
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.path === '/chat' ? (
                  <div className="flex items-center">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 mr-1" />
                    {link.name}
                  </div>
                ) : (
                  link.name
                )}
              </Link>
            ))}
            <Link
              to="/guides/new"
              className="flex items-center text-blue-600 px-3 py-2 text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              <PencilIcon className="h-5 w-5 mr-1" />
              创建攻略
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
