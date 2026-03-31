import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Heart, Star, Wifi, Wind, UtensilsCrossed, Car, Dumbbell, ShieldCheck, Loader2, Phone, ChevronLeft, Users, Zap, Tv, Thermometer, Shirt, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ReviewSection from '../components/listings/ReviewSection';

const AMENITY_ICONS = {
  wifi: { icon: Wifi, label: 'WiFi' }, ac: { icon: Wind, label: 'AC' },
  food: { icon: UtensilsCrossed, label: 'Food Included' }, parking: { icon: Car, label: 'Parking' },
  gym: { icon: Dumbbell, label: 'Gym' }, cctv: { icon: Camera, label: 'CCTV' },
  powerBackup: { icon: Zap, label: 'Power Backup' }, tv: { icon: Tv, label: 'TV' },
  hotWater: { icon: Thermometer, label: 'Hot Water' }, laundry: { icon: Shirt, label: 'Laundry' },
};

const GENDER_COLOR = { Boys: 'badge-boys', Girls: 'badge-girls', Coliving: 'badge-coliving', Any: 'bg-gray-100 text-gray-600' };

export default function ListingDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [saved, setSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    api.get(`/listings/${id}`).then(r => {
      setListing(r.data.listing);
      // Check wishlist
      if (user?.wishlist?.includes(id)) setSaved(true);
    }).catch(() => toast.error('Listing not found')).finally(() => setLoading(false));
  }, [id]);

  const toggleSave = async () => {
    if (!isLoggedIn) return toast.error('Please login to save listings');
    setSaveLoading(true);
    try {
      const { data } = await api.post(`/wishlist/${id}/toggle`);
      setSaved(data.saved);
      toast.success(data.saved ? 'Saved to wishlist ❤️' : 'Removed from wishlist');
    } catch { toast.error('Failed'); }
    finally { setSaveLoading(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 size={36} className="animate-spin text-brand-400" />
    </div>
  );
  if (!listing) return <div className="page-container py-20 text-center text-gray-400">Listing not found.</div>;

  const images = listing.images?.length ? listing.images : [{ url: 'https://placehold.co/800x500/f5f5f0/ccc?text=No+Image' }];
  const activeAmenities = Object.entries(listing.amenities || {}).filter(([, v]) => v);

  return (
    <div className="py-8">
      <div className="page-container">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
          <Link to="/listings" className="hover:text-brand-500 flex items-center gap-1"><ChevronLeft size={14} /> Listings</Link>
          <span>/</span>
          <Link to={`/listings?city=${listing.city}`} className="hover:text-brand-500">{listing.city}</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium truncate">{listing.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Images + Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden h-80 bg-gray-100">
                <img src={images[activeImg]?.url} alt={listing.title} className="w-full h-full object-cover" />
                {listing.isVerified && (
                  <div className="absolute top-4 left-4 badge badge-verified">
                    <ShieldCheck size={12} /> Verified Listing
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === activeImg ? 'border-brand-500' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Basic Info */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`badge ${GENDER_COLOR[listing.genderPreference]}`}>
                  <Users size={11} /> {listing.genderPreference}
                </span>
                <span className="badge bg-gray-100 text-gray-600">{listing.pgType}</span>
                {listing.sharingType?.map(s => (
                  <span key={s} className="badge bg-blue-50 text-blue-600">{s} Sharing</span>
                ))}
              </div>
              <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
              <div className="flex items-center gap-1.5 text-gray-500 mb-4">
                <MapPin size={16} className="text-brand-400" />
                <span>{listing.address}, {listing.locality}, {listing.city}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                  <span className="font-bold text-gray-800">{listing.avgRating?.toFixed(1) || '–'}</span>
                  <span className="text-gray-400 text-sm">({listing.reviewCount || 0} reviews)</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500 text-sm">{listing.viewCount || 0} views</span>
              </div>
            </div>

            {/* Description */}
            <div className="card p-5">
              <h3 className="font-display font-bold text-lg mb-3">About this PG</h3>
              <p className="text-gray-600 leading-relaxed">{listing.description}</p>
            </div>

            {/* Amenities */}
            {activeAmenities.length > 0 && (
              <div className="card p-5">
                <h3 className="font-display font-bold text-lg mb-4">Amenities & Facilities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {activeAmenities.map(([key]) => {
                    const a = AMENITY_ICONS[key];
                    if (!a) return null;
                    const Icon = a.icon;
                    return (
                      <div key={key} className="flex items-center gap-2.5 p-3 bg-green-50 rounded-xl">
                        <Icon size={16} className="text-green-600" />
                        <span className="text-sm font-medium text-gray-700">{a.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* House Rules */}
            {listing.houseRules?.length > 0 && (
              <div className="card p-5">
                <h3 className="font-display font-bold text-lg mb-3">House Rules</h3>
                <ul className="space-y-2">
                  {listing.houseRules.map((rule, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-brand-400 mt-0.5">•</span> {rule}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Map placeholder */}
            {listing.coordinates?.lat && (
              <div className="card p-5">
                <h3 className="font-display font-bold text-lg mb-3">Location on Map</h3>
                <div className="rounded-xl overflow-hidden h-56 bg-gray-100 flex items-center justify-center">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${listing.coordinates.lat},${listing.coordinates.lng}`}
                    target="_blank" rel="noreferrer"
                    className="btn-outline"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>
            )}

            {/* Reviews */}
            <ReviewSection listingId={id} />
          </div>

          {/* Right: Pricing + Owner card */}
          <div className="space-y-4">
            {/* Price Card */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card p-5 sticky top-20">
              <div className="mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-display text-3xl font-bold text-brand-600">
                    ₹{listing.monthlyRent?.toLocaleString()}
                  </span>
                  <span className="text-gray-400">/month</span>
                </div>
                <div className="text-sm text-gray-500">
                  Security Deposit: <span className="font-semibold text-gray-700">₹{listing.securityDeposit?.toLocaleString() || 'N/A'}</span>
                </div>
              </div>

              {/* Room availability */}
              <div className="mb-4 pb-4 border-b border-gray-100">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Available Rooms</span>
                  <span className={`font-semibold ${listing.availableRooms > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {listing.availableRooms > 0 ? `${listing.availableRooms} Available` : 'Full'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {showPhone ? (
                  <a href={`tel:${listing.owner?.phone}`} className="btn-primary w-full flex items-center justify-center gap-2">
                    <Phone size={16} /> +91 {listing.owner?.phone}
                  </a>
                ) : (
                  <button onClick={() => { if (!isLoggedIn) { toast.error('Login to view contact'); return; } setShowPhone(true); }}
                    className="btn-primary w-full flex items-center justify-center gap-2">
                    <Phone size={16} /> Show Contact Number
                  </button>
                )}
                <button onClick={toggleSave} disabled={saveLoading}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold border-2 transition-all ${saved ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-gray-200 text-gray-600 hover:border-brand-400'}`}>
                  <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
                  {saved ? 'Saved to Wishlist' : 'Save to Wishlist'}
                </button>
              </div>
            </motion.div>

            {/* Owner Card */}
            <div className="card p-5">
              <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Listed by</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-brand-600 text-lg">{listing.owner?.name?.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{listing.owner?.name}</div>
                  {listing.owner?.ownerProfile?.isVerified && (
                    <div className="badge badge-verified text-xs mt-0.5">
                      <ShieldCheck size={10} /> Verified Owner
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
