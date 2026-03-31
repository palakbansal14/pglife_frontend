import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Heart, Star, TrendingUp, ToggleLeft, ToggleRight, Pencil, Trash2, Loader2, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function OwnerDashboardPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/owner/listings'), api.get('/owner/stats')])
      .then(([lr, sr]) => { setListings(lr.data.listings || []); setStats(sr.data.stats); })
      .finally(() => setLoading(false));
  }, []);

  const toggleStatus = async (id) => {
    try {
      const { data } = await api.patch(`/owner/listings/${id}/toggle`);
      setListings(prev => prev.map(l => l._id === id ? { ...l, isActive: data.isActive } : l));
      toast.success(data.isActive ? 'Listing activated' : 'Listing deactivated');
    } catch { toast.error('Failed to update'); }
  };

  const deleteListing = async (id) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      await api.delete(`/listings/${id}`);
      setListings(prev => prev.filter(l => l._id !== id));
      toast.success('Listing deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const STAT_CARDS = stats ? [
    { label: 'Total Listings', value: stats.totalListings, icon: LayoutDashboard, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Views', value: stats.totalViews?.toLocaleString(), icon: Eye, color: 'bg-purple-50 text-purple-600' },
    { label: 'Total Saves', value: stats.totalSaves, icon: Heart, color: 'bg-pink-50 text-pink-600' },
    { label: 'Avg Rating', value: stats.avgRating?.toFixed(1) || '–', icon: Star, color: 'bg-amber-50 text-amber-600' },
  ] : [];

  return (
    <div className="py-10">
      <div className="page-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-900">Owner Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, {user?.name?.split(' ')[0]} 👋</p>
          </div>
          <Link to="/dashboard/add" className="btn-primary flex items-center gap-2">
            <Plus size={18} /> Add New PG
          </Link>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {STAT_CARDS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="card p-5">
                  <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
                    <Icon size={18} />
                  </div>
                  <div className="font-display text-2xl font-bold text-gray-900">{s.value}</div>
                  <div className="text-sm text-gray-500 mt-0.5">{s.label}</div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Listings Table */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-display font-bold text-lg">My Listings</h2>
            <span className="text-sm text-gray-400">{listings.length} total</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={32} className="animate-spin text-brand-400" />
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-16">
              <LayoutDashboard size={40} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">You haven't listed any PGs yet.</p>
              <Link to="/dashboard/add" className="btn-primary text-sm">Add Your First PG</Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {listings.map(listing => (
                <div key={listing._id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <img
                    src={listing.images?.[0]?.url || 'https://placehold.co/80x60/f5f5f0/ccc?text=PG'}
                    alt={listing.title}
                    className="w-16 h-12 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800 truncate">{listing.title}</div>
                    <div className="text-sm text-gray-500">{listing.locality}, {listing.city} · ₹{listing.monthlyRent?.toLocaleString()}/mo</div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500 hidden sm:flex">
                    <Eye size={13} /> {listing.viewCount || 0}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500 hidden sm:flex">
                    <Heart size={13} /> {listing.savedCount || 0}
                  </div>
                  <button onClick={() => toggleStatus(listing._id)} className="flex-shrink-0">
                    {listing.isActive
                      ? <ToggleRight size={24} className="text-green-500" />
                      : <ToggleLeft size={24} className="text-gray-300" />
                    }
                  </button>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Link to={`/dashboard/edit/${listing._id}`}
                      className="p-2 rounded-lg hover:bg-brand-50 text-gray-500 hover:text-brand-500 transition-colors">
                      <Pencil size={15} />
                    </Link>
                    <button onClick={() => deleteListing(listing._id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
