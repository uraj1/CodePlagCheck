import { Code, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[--card] shadow-inner mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Code className="text-[--primary]" size={20} />
            <span className="font-semibold">CodeGuard © {new Date().getFullYear()}</span>
          </div>
          
          <div className="flex items-center gap-6">
            <a 
              href="#" 
              className="text-[--secondary] hover:text-[--primary] transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a 
              href="#" 
              className="text-[--secondary] hover:text-[--primary] transition-colors"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="text-[--secondary] hover:text-[--primary] transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;