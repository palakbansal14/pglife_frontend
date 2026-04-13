import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coins, CheckCircle2, Loader2, Zap, Star, Crown, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const PACKAGES = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 20,
    price: 99,
    icon: Zap,
    color: 'blue',
    perks: ['Unlock 10 contact details', 'Valid for seekers & owners'],
    popular: false,
  },
  {
    id: 'popular',
    name: 'Popular',
    credits: 50,
    price: 199,
    icon: Star,
    color: 'brand',
    perks: ['Unlock 25 contact details', 'Post 3 listings (owners)', 'Best value'],
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 120,
    price: 399,
    icon: Crown,
    color: 'purple',
    perks: ['Unlock 60 contact details', 'Post 8 listings (owners)', 'Maximum savings'],
    popular: false,
  },
];

const COLOR_MAP = {
  blue:   { border: 'border-blue-400',   bg: 'bg-blue-500',   light: 'bg-blue-50',   text: 'text-blue-600',   badge: 'bg-blue-100 text-blue-700' },
  brand:  { border: 'border-brand-500',  bg: 'bg-brand-500',  light: 'bg-brand-50',  text: 'text-brand-600',  badge: 'bg-brand-100 text-brand-700' },
  purple: { border: 'border-purple-400', bg: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-600', badge: 'bg-purple-100 text-purple-700' },
};

export default function BuyCreditsPage() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [selected, setSelected] = useState('popular');
  const [loading, setLoading] = useState(false);

  const selectedPkg = PACKAGES.find(p => p.id === selected);

  const handleBuy = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/credits/purchase', { package: selected });
      await refreshUser();
      toast.success(`${data.credits_added} credits added to your account!`);
      navigate(-1); // go back to where they came from
    } catch (err) {
      toast.error(err.response?.data?.message || 'Purchase failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10">
      <div className="page-container max-w-3xl">

        {/* Back button */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-500 mb-6 transition-colors">
          <ArrowLeft size={15} /> Go back
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-2xl mb-4">
            <Coins size={32} className="text-amber-500" />
          </div>
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Buy Credits</h1>
          <p className="text-gray-500 max-w-md mx-auto">
            Credits let you unlock PG contact details and post listings. Choose a pack that works for you.
          </p>
          {user && (
            <div className="inline-flex items-center gap-2 mt-3 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 text-sm text-amber-700 font-medium">
              <Coins size={14} className="text-amber-500" /> Current balance: <strong>{user.credits ?? 0} credits</strong>
            </div>
          )}
        </div>

        {/* How credits work */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {[
            { label: 'Unlock contact details', cost: '2 credits' },
            { label: 'Post a PG listing', cost: '15 credits' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 text-sm">
              <span className="text-gray-600">{item.label}</span>
              <span className="font-semibold text-gray-800 flex items-center gap-1"><Coins size={13} className="text-amber-400" /> {item.cost}</span>
            </div>
          ))}
        </div>

        {/* Packages */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {PACKAGES.map((pkg) => {
            const c = COLOR_MAP[pkg.color];
            const Icon = pkg.icon;
            const isSelected = selected === pkg.id;
            return (
              <motion.button
                key={pkg.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelected(pkg.id)}
                className={`relative text-left rounded-2xl border-2 p-5 transition-all ${
                  isSelected ? `${c.border} ${c.light}` : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}

                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${isSelected ? c.bg : 'bg-gray-100'}`}>
                  <Icon size={18} className={isSelected ? 'text-white' : 'text-gray-500'} />
                </div>

                <div className="font-display font-bold text-lg text-gray-900 mb-0.5">{pkg.name}</div>
                <div className={`text-2xl font-bold mb-1 ${c.text}`}>
                  <Coins size={18} className="inline mb-1" /> {pkg.credits}
                  <span className="text-sm font-normal text-gray-400 ml-1">credits</span>
                </div>
                <div className="text-xl font-bold text-gray-800 mb-3">₹{pkg.price}</div>

                <ul className="space-y-1.5">
                  {pkg.perks.map(perk => (
                    <li key={perk} className="flex items-center gap-1.5 text-xs text-gray-600">
                      <CheckCircle2 size={12} className={isSelected ? c.text : 'text-gray-400'} />
                      {perk}
                    </li>
                  ))}
                </ul>
              </motion.button>
            );
          })}
        </div>

        {/* Purchase button */}
        <div className="card p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-sm text-gray-500 mb-0.5">You selected</div>
            <div className="font-bold text-gray-900 text-lg">
              {selectedPkg?.name} — {selectedPkg?.credits} Credits
            </div>
            <div className="text-sm text-gray-500">₹{selectedPkg?.price} one-time payment</div>
          </div>
          <button
            onClick={handleBuy}
            disabled={loading}
            className="btn-primary flex items-center gap-2 px-8 py-3 whitespace-nowrap disabled:opacity-60"
          >
            {loading
              ? <Loader2 size={18} className="animate-spin" />
              : <><Coins size={16} /> Pay ₹{selectedPkg?.price}</>
            }
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Secure payment · Credits are added instantly after payment
        </p>

      </div>
    </div>
  );
}
