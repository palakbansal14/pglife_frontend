import { Link } from 'react-router-dom';
import { Heart, MapPin, Star, Wifi, Wind, UtensilsCrossed, ShieldCheck, Users } from 'lucide-react';
import { useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const GENDER_STYLE = {
  Boys: 'badge-boys', Girls: 'badge-girls', Coliving: 'badge-coliving', Any: 'bg-gray-100 text-gray-600'
};

export default function ListingCard({ listing, onWishlistToggle, inWishlist: initialSaved = false }) {
  const [saved, setSaved] = useState(initialSaved);
  const [savingLoading, setSavingLoading] = useState(false);
  const { isLoggedIn } = useAuth();

  const firstImage = listing.images?.[0]?.url || 'https://placehold.co/600x400/f5f5f0/ccc?text=No+Image';

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) return toast.error('Please login to save listings');
    setSavingLoading(true);
    try {
      const { data } = await api.post(`/wishlist/${listing._id}/toggle`);
      setSaved(data.saved);
      toast.success(data.saved ? 'Saved to wishlist ❤️' : 'Removed from wishlist');
      onWishlistToggle?.(listing._id, data.saved);
    } catch {
      toast.error('Failed to update wishlist');
    } finally { setSavingLoading(false); }
  };

  return (
    <Link to={`/listings/${listing._id}`} className="card group block overflow-hidden">
      {/* Image */}
      <div className="relative overflow-hidden h-52">
        <img
          src={firstImage} alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`badge ${GENDER_STYLE[listing.genderPreference] || 'bg-gray-100 text-gray-600'}`}>
            <Users size={11} /> {listing.genderPreference}
          </span>
          {listing.isVerified && (
            <span className="badge badge-verified">
              <ShieldCheck size={11} /> Verified
            </span>
          )}
        </div>
        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={savingLoading}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md ${
            saved ? 'bg-brand-500 text-white' : 'bg-white/90 text-gray-500 hover:bg-white hover:text-brand-500'
          }`}
        >
          <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
        </button>
        {/* Price tag */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm">
          <span className="font-bold text-brand-600 text-base">₹{listing.monthlyRent?.toLocaleString()}</span>
          <span className="text-gray-500 text-xs">/mo</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-base leading-snug mb-1 line-clamp-1 group-hover:text-brand-500 transition-colors">
          {listing.title}
        </h3>
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <MapPin size={13} className="text-brand-400 flex-shrink-0" />
          <span className="line-clamp-1">{listing.locality}, {listing.city}</span>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {listing.amenities?.wifi && <span className="amenity-chip"><Wifi size={11} /> WiFi</span>}
          {listing.amenities?.ac && <span className="amenity-chip"><Wind size={11} /> AC</span>}
          {listing.amenities?.food && <span className="amenity-chip"><UtensilsCrossed size={11} /> Food</span>}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Star size={13} className="text-amber-400 fill-amber-400" />
            <span className="text-sm font-semibold text-gray-800">{listing.avgRating?.toFixed(1) || '–'}</span>
            <span className="text-xs text-gray-400">({listing.reviewCount || 0})</span>
          </div>
          <div className="text-xs text-gray-400">
            Deposit: ₹{listing.securityDeposit?.toLocaleString() || '–'}
          </div>
        </div>
      </div>
    </Link>
  );
}
