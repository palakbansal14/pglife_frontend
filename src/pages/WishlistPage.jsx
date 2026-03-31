import { useState, useEffect } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ListingCard from '../components/listings/ListingCard';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/wishlist').then(r => setWishlist(r.data.wishlist || [])).finally(() => setLoading(false));
  }, []);

  const handleRemove = (id) => setWishlist(prev => prev.filter(l => l._id !== id));

  return (
    <div className="py-10">
      <div className="page-container">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-1 flex items-center gap-3">
            <Heart className="text-brand-500 fill-brand-100" size={28} /> Saved PGs
          </h1>
          <p className="text-gray-500">{wishlist.length} PG{wishlist.length !== 1 ? 's' : ''} saved</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={36} className="animate-spin text-brand-400" />
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={48} className="text-gray-200 mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold text-gray-600 mb-2">No Saved PGs Yet</h3>
            <p className="text-gray-400 text-sm mb-6">Start exploring and save your favourite PGs here.</p>
            <Link to="/listings" className="btn-primary">Browse PGs</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {wishlist.map(listing => (
              <ListingCard
                key={listing._id}
                listing={listing}
                inWishlist={true}
                onWishlistToggle={(id, saved) => { if (!saved) handleRemove(id); }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
