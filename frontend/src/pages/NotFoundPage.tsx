import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="container mx-auto py-12 px-4 flex flex-col items-center justify-center">
      <AlertTriangle size={64} className="text-[--warning] mb-6" />
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-8 text-center">The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn btn-primary flex items-center gap-2">
        <Home size={18} />
        <span>Back to Home</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;