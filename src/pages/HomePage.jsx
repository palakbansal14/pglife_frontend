import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, Shield, Star, TrendingUp, ArrowRight, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import ListingCard from '../components/listings/ListingCard';

const CITIES = [
  { name: 'Noida', img: 'https://images.unsplash.com/photo-1651923279747-ac85c4ff0073?w=400&h=300&fit=crop', listings: '500+' },
  { name: 'Delhi', img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop', listings: '800+' },
  { name: 'Gurgaon', img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=300&fit=crop', listings: '600+' },
  { name: 'Bangalore', img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&h=300&fit=crop', listings: '900+' },
];

const STATS = [
  { icon: MapPin, label: 'PG Listings', value: '2800+' },
  { icon: Users, label: 'Happy Users', value: '15,000+' },
  { icon: Shield, label: 'Verified Owners', value: '400+' },
  { icon: Star, label: 'Avg Rating', value: '4.6★' },
];

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } })
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [featuredListings, setFeaturedListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/listings?sort=rating&limit=6').then(r => setFeaturedListings(r.data.listings || [])).catch(() => {});
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedCity) params.set('city', selectedCity);
    if (searchQuery) params.set('locality', searchQuery);
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-amber-50 overflow-hidden pt-10 pb-20">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-100 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-100 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/4" />

        <div className="page-container relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div variants={FADE_UP} initial="hidden" animate="show" custom={0}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 text-brand-700 rounded-full text-sm font-semibold mb-6">
              <TrendingUp size={14} /> Trusted by 15,000+ Students & Professionals
            </motion.div>

            <motion.h1 variants={FADE_UP} initial="hidden" animate="show" custom={1}
              className="font-display text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-5">
              Find Your Perfect <span className="text-brand-500">PG Home</span> Away from Home
            </motion.h1>

            <motion.p variants={FADE_UP} initial="hidden" animate="show" custom={2}
              className="text-lg text-gray-500 mb-10 max-w-xl mx-auto">
              Verified PG accommodations across Noida, Delhi, Gurgaon & Bangalore — filtered by your budget, gender, and preferences.
            </motion.p>

            {/* Search Bar */}
            <motion.div variants={FADE_UP} initial="hidden" animate="show" custom={3}
              className="bg-white rounded-2xl shadow-card-hover p-2 flex flex-col sm:flex-row gap-2">
              <select
                value={selectedCity} onChange={e => setSelectedCity(e.target.value)}
                className="input-field sm:w-44 border-0 bg-gray-50"
              >
                <option value="">All Cities</option>
                {CITIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
              <div className="h-px sm:h-auto sm:w-px bg-gray-200 mx-1" />
              <input
                type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Sector, Locality, or Landmark..."
                className="input-field flex-1 border-0 bg-transparent"
              />
              <button onClick={handleSearch} className="btn-primary flex items-center justify-center gap-2 sm:w-auto w-full">
                <Search size={18} /> Search PGs
              </button>
            </motion.div>

            {/* Popular searches */}
            <motion.div variants={FADE_UP} initial="hidden" animate="show" custom={4}
              className="flex flex-wrap justify-center gap-2 mt-5">
              {['Girls PG Noida', 'Boys PG Gurgaon', 'PG with Food', 'Coliving Bangalore', 'PG under ₹8000'].map(tag => (
                <button key={tag} onClick={() => navigate(`/listings?locality=${tag}`)}
                  className="text-xs px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-brand-400 hover:text-brand-500 transition-colors">
                  {tag}
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-brand-500 py-10">
        <div className="page-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map(({ icon: Icon, label, value }, i) => (
              <motion.div key={label} variants={FADE_UP} initial="hidden" whileInView="show" custom={i} viewport={{ once: true }}
                className="text-center text-white">
                <Icon size={24} className="mx-auto mb-2 opacity-75" />
                <div className="font-display text-3xl font-bold">{value}</div>
                <div className="text-white/75 text-sm mt-1">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BROWSE BY CITY ── */}
      <section className="py-16">
        <div className="page-container">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-brand-500 font-semibold text-sm uppercase tracking-wide mb-1">Explore Cities</p>
              <h2 className="section-title">Browse by City</h2>
            </div>
            <Link to="/listings" className="btn-ghost flex items-center gap-1 text-sm">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CITIES.map((city, i) => (
              <motion.div key={city.name} variants={FADE_UP} initial="hidden" whileInView="show" custom={i} viewport={{ once: true }}>
                <Link to={`/listings?city=${city.name}`}
                  className="group relative overflow-hidden rounded-2xl h-44 block">
                  <img src={city.img} alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <div className="font-display font-bold text-xl">{city.name}</div>
                    <div className="text-white/80 text-sm">{city.listings} PGs</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED LISTINGS ── */}
      {featuredListings.length > 0 && (
        <section className="py-10 bg-gray-50">
          <div className="page-container">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-brand-500 font-semibold text-sm uppercase tracking-wide mb-1">Top Rated</p>
                <h2 className="section-title">Featured PG Listings</h2>
              </div>
              <Link to="/listings?sort=rating" className="btn-ghost flex items-center gap-1 text-sm">
                See All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredListings.map((listing, i) => (
                <motion.div key={listing._id} variants={FADE_UP} initial="hidden" whileInView="show" custom={i % 3} viewport={{ once: true }}>
                  <ListingCard listing={listing} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── HOW IT WORKS ── */}
      <section className="py-16">
        <div className="page-container">
          <div className="text-center mb-12">
            <p className="text-brand-500 font-semibold text-sm uppercase tracking-wide mb-1">Simple Process</p>
            <h2 className="section-title">How PG Life Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Search & Filter', desc: 'Browse PGs by city, budget, gender & amenities. Use our smart filters to narrow down options.' },
              { step: '02', title: 'Explore Listings', desc: 'View photo galleries, read reviews, check amenities and see exact locations on Google Maps.' },
              { step: '03', title: 'Connect & Move In', desc: 'Save favourites to wishlist, contact owners directly and secure your new home.' },
            ].map((step, i) => (
              <motion.div key={step.step} variants={FADE_UP} initial="hidden" whileInView="show" custom={i} viewport={{ once: true }}
                className="text-center">
                <div className="w-16 h-16 bg-brand-50 text-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-4 font-display font-bold text-2xl">
                  {step.step}
                </div>
                <h3 className="font-display font-bold text-xl text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-14 bg-gradient-to-r from-brand-500 to-brand-600">
        <div className="page-container text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-3">Own a PG? List it for Free!</h2>
          <p className="text-white/80 mb-8 max-w-md mx-auto">Join 400+ verified owners reaching thousands of PG seekers every month. No broker fees, ever.</p>
          <Link to="/dashboard" className="inline-flex items-center gap-2 bg-white text-brand-600 font-bold px-8 py-3.5 rounded-xl hover:bg-orange-50 transition-colors shadow-lg">
            List Your PG <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
