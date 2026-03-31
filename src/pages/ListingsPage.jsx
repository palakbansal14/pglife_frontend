import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, Map, Loader2, SearchX } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import ListingCard from '../components/listings/ListingCard';
import FilterPanel from '../components/listings/FilterPanel';

export default function ListingsPage() {
  const [params] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');

  const fetchListings = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const query = new URLSearchParams(params);
      query.set('page', page);
      query.set('limit', 12);
      const { data } = await api.get(`/listings?${query.toString()}`);
      setListings(data.listings || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
      setCurrentPage(data.currentPage || 1);
    } catch { setListings([]); }
    finally { setLoading(false); }
  }, [params.toString()]);

  useEffect(() => { fetchListings(1); }, [params.toString()]);

  const city = params.get('city');
  const gender = params.get('gender');

  return (
    <div className="py-8">
      <div className="page-container">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-gray-900">
            {city ? `PG Listings in ${city}` : 'Browse All PGs'}
            {gender ? ` — ${gender}` : ''}
          </h1>
          <p className="text-gray-500 mt-1">
            {loading ? 'Searching...' : `${total.toLocaleString()} PG${total !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <FilterPanel />
        </div>

        {/* View toggle */}
        <div className="flex items-center justify-between mb-5">
          <div className="text-sm text-gray-500 font-medium">
            Showing {listings.length} of {total} results
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-brand-500' : 'text-gray-500 hover:text-gray-700'}`}>
              <Grid size={16} />
            </button>
            <button onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'map' ? 'bg-white shadow-sm text-brand-500' : 'text-gray-500 hover:text-gray-700'}`}>
              <Map size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <Loader2 size={36} className="animate-spin text-brand-400 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Finding the best PGs for you...</p>
            </div>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20">
            <SearchX size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold text-gray-700 mb-2">No PGs Found</h3>
            <p className="text-gray-400 text-sm">Try adjusting your filters or search in a different city.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {listings.map((listing, i) => (
                <motion.div
                  key={listing._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <ListingCard listing={listing} />
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button onClick={() => fetchListings(currentPage - 1)} disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-40 hover:border-brand-400 hover:text-brand-500 transition-colors">
                  ← Previous
                </button>
                {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => fetchListings(p)}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${p === currentPage ? 'bg-brand-500 text-white shadow-brand' : 'border border-gray-200 text-gray-600 hover:border-brand-400 hover:text-brand-500'}`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => fetchListings(currentPage + 1)} disabled={currentPage === pages}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-40 hover:border-brand-400 hover:text-brand-500 transition-colors">
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
