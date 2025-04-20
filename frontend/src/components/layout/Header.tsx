import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code, BarChart, LogIn, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-[--card] shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Code className="text-[--primary]" size={24} />
            <span className="font-bold text-xl">CodeGuard</span>
          </Link>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`font-medium hover:text-[--primary] transition-colors ${
                location.pathname === '/' ? 'text-[--primary]' : ''
              }`}
            >
              Editor
            </Link>
            <Link 
              to="/admin" 
              className={`font-medium hover:text-[--primary] transition-colors ${
                location.pathname === '/admin' ? 'text-[--primary]' : ''
              }`}
            >
              <div className="flex items-center gap-1">
                <BarChart size={18} />
                <span>Dashboard</span>
              </div>
            </Link>
            <Link 
              to="/login" 
              className="btn btn-primary flex items-center gap-1"
            >
              <LogIn size={18} />
              <span>Login</span>
            </Link>
          </nav>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 flex flex-col gap-4">
            <Link 
              to="/" 
              className={`font-medium p-2 rounded-md ${
                location.pathname === '/' ? 'bg-gray-100 text-[--primary]' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Editor
            </Link>
            <Link 
              to="/admin" 
              className={`font-medium p-2 rounded-md ${
                location.pathname === '/admin' ? 'bg-gray-100 text-[--primary]' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center gap-1">
                <BarChart size={18} />
                <span>Dashboard</span>
              </div>
            </Link>
            <Link 
              to="/login" 
              className="btn btn-primary flex items-center justify-center gap-1"
              onClick={() => setIsMenuOpen(false)}
            >
              <LogIn size={18} />
              <span>Login</span>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;