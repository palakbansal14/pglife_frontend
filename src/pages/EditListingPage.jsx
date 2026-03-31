// ── EditListingPage.jsx ──
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

export function EditListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/listings/${id}`).then(r => setListing(r.data.listing)).finally(() => setLoading(false));
  }, [id]);

  const set = (k, v) => setListing(l => ({ ...l, [k]: v }));
  const toggleAmenity = (a) => setListing(l => ({ ...l, amenities: { ...l.amenities, [a]: !l.amenities?.[a] } }));

  const save = async () => {
    setSaving(true);
    try {
      await api.put(`/listings/${id}`, {
        title: listing.title, description: listing.description,
        monthlyRent: listing.monthlyRent, securityDeposit: listing.securityDeposit,
        availableRooms: listing.availableRooms, amenities: listing.amenities,
        genderPreference: listing.genderPreference,
      });
      toast.success('Listing updated!');
      navigate('/dashboard');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 size={32} className="animate-spin text-brand-400" /></div>;

  return (
    <div className="py-10">
      <div className="page-container max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-6">Edit Listing</h1>
        <div className="card p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Title</label>
            <input value={listing.title} onChange={e => set('title', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Description</label>
            <textarea value={listing.description} onChange={e => set('description', e.target.value)} rows={4} className="input-field resize-none" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Rent (₹/mo)</label>
              <input type="number" value={listing.monthlyRent} onChange={e => set('monthlyRent', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Deposit (₹)</label>
              <input type="number" value={listing.securityDeposit} onChange={e => set('securityDeposit', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Rooms Available</label>
              <input type="number" value={listing.availableRooms} onChange={e => set('availableRooms', e.target.value)} className="input-field" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Gender Preference</label>
            <select value={listing.genderPreference} onChange={e => set('genderPreference', e.target.value)} className="input-field">
              {['Boys', 'Girls', 'Coliving', 'Any'].map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => navigate('/dashboard')} className="btn-ghost flex-1">Cancel</button>
            <button onClick={save} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {saving ? <Loader2 size={16} className="animate-spin" /> : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditListingPage;
