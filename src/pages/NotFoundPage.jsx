import { Link } from 'react-router-dom';
import { Home, SearchX } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center px-4">
        <div className="font-display text-8xl font-bold text-brand-200 mb-4">404</div>
        <SearchX size={48} className="text-gray-300 mx-auto mb-4" />
        <h1 className="font-display text-2xl font-bold text-gray-800 mb-2">Page Not Found</h1>
        <p className="text-gray-500 text-sm mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <Home size={16} /> Go to Home
        </Link>
      </div>
    </div>
  );
}
