import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, ChevronDown } from 'lucide-react';

const CITIES = ['Noida', 'Delhi', 'Gurgaon', 'Bangalore'];
const GENDERS = ['Any', 'Boys', 'Girls', 'Coliving'];
const AMENITIES = [
  { key: 'wifi', label: 'WiFi' }, { key: 'ac', label: 'AC' }, { key: 'food', label: 'Food' },
  { key: 'laundry', label: 'Laundry' }, { key: 'parking', label: 'Parking' },
  { key: 'gym', label: 'Gym' }, { key: 'cctv', label: 'CCTV' },
];

export default function FilterPanel({ onFilter }) {
  const [params, setParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    city: params.get('city') || '',
    gender: params.get('gender') || '',
    minBudget: params.get('minBudget') || '',
    maxBudget: params.get('maxBudget') || '',
    locality: params.get('locality') || '',
    amenities: params.get('amenities') || '',
    sort: params.get('sort') || 'newest',
  });
  const [selectedAmenities, setSelectedAmenities] = useState(
    params.get('amenities') ? params.get('amenities').split(',') : []
  );

  const set = (key, val) => setFilters(f => ({ ...f, [key]: val }));
  const toggleAmenity = (a) => setSelectedAmenities(prev =>
    prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]
  );

  const apply = () => {
    const f = { ...filters, amenities: selectedAmenities.join(',') };
    Object.entries(f).forEach(([k, v]) => { if (v) params.set(k, v); else params.delete(k); });
    params.delete('page');
    setParams(params);
    onFilter?.(f);
    setOpen(false);
  };

  const clear = () => {
    setFilters({ city: '', gender: '', minBudget: '', maxBudget: '', locality: '', amenities: '', sort: 'newest' });
    setSelectedAmenities([]);
    setParams({});
    onFilter?.({});
  };

  const activeCount = [filters.city, filters.gender, filters.minBudget || filters.maxBudget, filters.locality, selectedAmenities.length > 0]
    .filter(Boolean).length;

  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100">
      {/* Filter trigger bar */}
      <div className="flex items-center gap-3 p-4 flex-wrap">
        {/* City pills */}
        <div className="flex gap-2 flex-wrap">
          {CITIES.map(c => (
            <button
              key={c}
              onClick={() => { set('city', filters.city === c ? '' : c); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                filters.city === c ? 'bg-brand-500 text-white shadow-brand' : 'bg-gray-100 text-gray-600 hover:bg-brand-50 hover:text-brand-600'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="h-5 w-px bg-gray-200 hidden sm:block" />

        {/* Gender pills */}
        <div className="flex gap-2 flex-wrap">
          {GENDERS.map(g => (
            <button key={g} onClick={() => set('gender', filters.gender === g ? '' : g)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                filters.gender === g ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-brand-50 hover:text-brand-600'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {activeCount > 0 && (
            <button onClick={clear} className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors">
              <X size={14} /> Clear
            </button>
          )}
          <button
            onClick={() => setOpen(!open)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              open ? 'bg-brand-500 text-white border-brand-500' : 'border-gray-200 text-gray-600 hover:border-brand-400 hover:text-brand-500'
            }`}
          >
            <Filter size={14} />
            More Filters {activeCount > 0 && <span className="bg-white text-brand-500 rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold">{activeCount}</span>}
            <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Expanded filters */}
      {open && (
        <div className="border-t border-gray-100 p-4 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Budget */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Min Budget (₹)</label>
              <input type="number" value={filters.minBudget} onChange={e => set('minBudget', e.target.value)} placeholder="e.g. 5000" className="input-field" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Max Budget (₹)</label>
              <input type="number" value={filters.maxBudget} onChange={e => set('maxBudget', e.target.value)} placeholder="e.g. 15000" className="input-field" />
            </div>
            {/* Locality */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Locality / Sector</label>
              <input type="text" value={filters.locality} onChange={e => set('locality', e.target.value)} placeholder="e.g. Sector 18" className="input-field" />
            </div>
            {/* Sort */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Sort By</label>
              <select value={filters.sort} onChange={e => set('sort', e.target.value)} className="input-field">
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map(a => (
                <button
                  key={a.key}
                  onClick={() => toggleAmenity(a.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                    selectedAmenities.includes(a.key)
                      ? 'bg-brand-500 text-white border-brand-500'
                      : 'border-gray-200 text-gray-600 hover:border-brand-400 hover:text-brand-500 bg-white'
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={clear} className="btn-ghost text-sm">Reset</button>
            <button onClick={apply} className="btn-primary text-sm py-2 px-6">Apply Filters</button>
          </div>
        </div>
      )}
    </div>
  );
}
