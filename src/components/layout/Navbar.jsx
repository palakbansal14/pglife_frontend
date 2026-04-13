import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Heart, User, LayoutDashboard, LogOut, ChevronDown, Home, Coins, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../auth/AuthModal';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authRole, setAuthRole] = useState(null);
  const [dropOpen, setDropOpen] = useState(false);
  const { user, logout, isOwner } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setDropOpen(false);
    navigate('/');
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
      }`}>
        <div className="page-container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center shadow-brand group-hover:scale-105 transition-transform">
                <Home size={18} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl text-gray-900">
                PG<span className="text-brand-500">Life</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              <Link to="/listings" className="btn-ghost text-sm">Browse PGs</Link>
              {['Noida', 'Delhi', 'Gurgaon', 'Bangalore'].map(city => (
                <Link
                  key={city}
                  to={`/listings?city=${city}`}
                  className="btn-ghost text-sm"
                >
                  {city}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  {isOwner && (
                    <Link to="/dashboard" className="btn-ghost text-sm flex items-center gap-1.5">
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                  )}
                  <Link to="/wishlist" className="btn-ghost text-sm flex items-center gap-1.5">
                    <Heart size={16} /> Saved
                  </Link>
                  <div className="relative">
                    <button
                      onClick={() => setDropOpen(!dropOpen)}
                      className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                        <span className="text-brand-600 font-semibold text-sm">
                          {user.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{user.name?.split(' ')[0]}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isOwner ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                        {isOwner ? 'Owner' : 'Seeker'}
                      </span>
                      <span className="flex items-center gap-0.5 text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
                        <Coins size={11} /> {user.credits ?? 0}
                      </span>
                      <ChevronDown size={14} className={`text-gray-500 transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {dropOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-card-hover border border-gray-100 py-1 z-50">
                        <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-500 transition-colors" onClick={() => setDropOpen(false)}>
                          <User size={15} /> My Profile
                        </Link>
                        <Link to="/wishlist" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-500 transition-colors" onClick={() => setDropOpen(false)}>
                          <Heart size={15} /> Saved PGs
                        </Link>
                        <Link to="/buy-credits" className="flex items-center justify-between px-4 py-2.5 text-sm text-amber-600 hover:bg-amber-50 transition-colors" onClick={() => setDropOpen(false)}>
                          <span className="flex items-center gap-2"><ShoppingCart size={15} /> Buy Credits</span>
                          <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full">{user.credits ?? 0} left</span>
                        </Link>
                        <hr className="my-1 border-gray-100" />
                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                          <LogOut size={15} /> Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <button onClick={() => { setAuthRole(null); setAuthOpen(true); }} className="btn-ghost text-sm">Login</button>
                  <button onClick={() => { setAuthRole('owner'); setAuthOpen(true); }} className="btn-primary text-sm py-2 px-5">
                    List Your PG
                  </button>
                </>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
            <Link to="/listings" className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-600">Browse PGs</Link>
            {['Noida', 'Delhi', 'Gurgaon', 'Bangalore'].map(city => (
              <Link key={city} to={`/listings?city=${city}`} className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-brand-50 hover:text-brand-600">{city}</Link>
            ))}
            {user ? (
              <>
                <Link to="/wishlist" className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-brand-50">Saved PGs</Link>
                {isOwner && <Link to="/dashboard" className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-brand-50">Dashboard</Link>}
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50">Logout</button>
              </>
            ) : (
              <button onClick={() => { setAuthOpen(true); setMobileOpen(false); }} className="w-full btn-primary text-sm mt-2">
                Login / Sign Up
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Spacer */}
      <div className="h-16" />

      <AuthModal open={authOpen} onClose={() => { setAuthOpen(false); setAuthRole(null); }} defaultRole={authRole} />
    </>
  );
}
