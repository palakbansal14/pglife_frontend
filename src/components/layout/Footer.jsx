import { Link } from 'react-router-dom';
import { Home, MapPin, Mail, Phone, Instagram, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  const cities = ['Noida', 'Delhi', 'Gurgaon', 'Bangalore'];

  return (
    <footer className="bg-gray-900 text-gray-300 pt-14 pb-8 mt-16">
      <div className="page-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center">
                <Home size={18} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                PG<span className="text-brand-400">Life</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              India's dedicated PG & 1RK accommodation finder. Trusted by thousands of students and professionals.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-gray-800 hover:bg-brand-500 rounded-lg flex items-center justify-center transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Cities */}
          <div>
            <h4 className="font-semibold text-white mb-4">Browse by City</h4>
            <ul className="space-y-2">
              {cities.map(city => (
                <li key={city}>
                  <Link to={`/listings?city=${city}`} className="flex items-center gap-2 text-sm hover:text-brand-400 transition-colors">
                    <MapPin size={13} /> {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/listings" className="hover:text-brand-400 transition-colors">All Listings</Link></li>
              <li><Link to="/listings?gender=Girls" className="hover:text-brand-400 transition-colors">Girls PG</Link></li>
              <li><Link to="/listings?gender=Boys" className="hover:text-brand-400 transition-colors">Boys PG</Link></li>
              <li><Link to="/listings?gender=Coliving" className="hover:text-brand-400 transition-colors">Coliving Spaces</Link></li>
              <li><Link to="/wishlist" className="hover:text-brand-400 transition-colors">Saved PGs</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-brand-400" />
                <a href="mailto:hello@pglife.in" className="hover:text-brand-400 transition-colors">hello@pglife.in</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-brand-400" />
                <span>+91 98765 43210</span>
              </li>
            </ul>
            <div className="mt-5 p-3 bg-gray-800 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">List your PG for free</p>
              <Link to="/dashboard" className="text-brand-400 text-sm font-semibold hover:underline">
                Become an Owner →
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© 2025 PG Life. All rights reserved. Built with ❤️ for India.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
