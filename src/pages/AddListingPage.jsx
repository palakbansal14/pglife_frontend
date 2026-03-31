import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Upload, X, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const CITIES = ['Noida', 'Delhi', 'Gurgaon', 'Bangalore'];
const AMENITIES = ['wifi', 'ac', 'food', 'laundry', 'parking', 'gym', 'cctv', 'housekeeping', 'powerBackup', 'hotWater', 'tv', 'fridge'];
const AMENITY_LABELS = { wifi:'WiFi', ac:'AC', food:'Food', laundry:'Laundry', parking:'Parking', gym:'Gym', cctv:'CCTV', housekeeping:'Housekeeping', powerBackup:'Power Backup', hotWater:'Hot Water', tv:'TV', fridge:'Fridge' };

export default function AddListingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [rule, setRule] = useState('');
  const [form, setForm] = useState({
    title: '', description: '', city: '', locality: '', address: '',
    monthlyRent: '', securityDeposit: '', pgType: 'PG',
    genderPreference: 'Boys', availableRooms: '',
    amenities: {}, houseRules: [],
    sharingType: [],
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleAmenity = (a) => setForm(f => ({ ...f, amenities: { ...f.amenities, [a]: !f.amenities[a] } }));
  const toggleSharing = (s) => setForm(f => ({
    ...f, sharingType: f.sharingType.includes(s) ? f.sharingType.filter(x => x !== s) : [...f.sharingType, s]
  }));

  const handleImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 10);
    setImages(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };
  const removeImage = (i) => {
    setImages(prev => prev.filter((_, idx) => idx !== i));
    setPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const addRule = () => { if (rule.trim()) { set('houseRules', [...form.houseRules, rule.trim()]); setRule(''); } };

  const submit = async () => {
    if (!form.title || !form.city || !form.monthlyRent || !form.genderPreference) {
      return toast.error('Fill all required fields');
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'amenities') fd.append(k, JSON.stringify(v));
        else if (k === 'houseRules' || k === 'sharingType') fd.append(k, JSON.stringify(v));
        else fd.append(k, v);
      });
      images.forEach(img => fd.append('images', img));
      await api.post('/listings', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('PG Listed successfully! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create listing');
    } finally { setLoading(false); }
  };

  return (
    <div className="py-10">
      <div className="page-container max-w-3xl">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900">List Your PG</h1>
          <p className="text-gray-500 mt-1">Fill in the details to list your property. Fields marked * are required.</p>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="card p-6 space-y-4">
            <h3 className="font-display font-bold text-lg">Basic Information</h3>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">PG Title *</label>
              <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Sunshine PG for Girls in Sector 62" className="input-field" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Description *</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)}
                placeholder="Describe your PG — facilities, nearby landmarks, etc." rows={4} className="input-field resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">PG Type</label>
                <select value={form.pgType} onChange={e => set('pgType', e.target.value)} className="input-field">
                  {['PG', '1RK', 'Flat', 'Hostel'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Gender Preference *</label>
                <select value={form.genderPreference} onChange={e => set('genderPreference', e.target.value)} className="input-field">
                  {['Boys', 'Girls', 'Coliving', 'Any'].map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Room Sharing</label>
              <div className="flex gap-3">
                {['Single', 'Double', 'Triple'].map(s => (
                  <button key={s} type="button" onClick={() => toggleSharing(s)}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${form.sharingType.includes(s) ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-gray-200 text-gray-600'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="card p-6 space-y-4">
            <h3 className="font-display font-bold text-lg">Location</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">City *</label>
                <select value={form.city} onChange={e => set('city', e.target.value)} className="input-field">
                  <option value="">Select City</option>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Locality / Sector *</label>
                <input value={form.locality} onChange={e => set('locality', e.target.value)} placeholder="e.g. Sector 18" className="input-field" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Full Address</label>
              <input value={form.address} onChange={e => set('address', e.target.value)} placeholder="House no, Street, Area" className="input-field" />
            </div>
          </div>

          {/* Pricing */}
          <div className="card p-6 space-y-4">
            <h3 className="font-display font-bold text-lg">Pricing</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Monthly Rent (₹) *</label>
                <input type="number" value={form.monthlyRent} onChange={e => set('monthlyRent', e.target.value)} placeholder="8000" className="input-field" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Security Deposit (₹)</label>
                <input type="number" value={form.securityDeposit} onChange={e => set('securityDeposit', e.target.value)} placeholder="16000" className="input-field" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Available Rooms</label>
                <input type="number" value={form.availableRooms} onChange={e => set('availableRooms', e.target.value)} placeholder="3" className="input-field" />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="card p-6">
            <h3 className="font-display font-bold text-lg mb-4">Amenities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AMENITIES.map(a => (
                <button key={a} type="button" onClick={() => toggleAmenity(a)}
                  className={`px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all text-left ${form.amenities[a] ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-gray-200 text-gray-600'}`}>
                  {form.amenities[a] ? '✓ ' : ''}{AMENITY_LABELS[a]}
                </button>
              ))}
            </div>
          </div>

          {/* House Rules */}
          <div className="card p-6">
            <h3 className="font-display font-bold text-lg mb-4">House Rules</h3>
            <div className="flex gap-2 mb-3">
              <input value={rule} onChange={e => setRule(e.target.value)} onKeyDown={e => e.key === 'Enter' && addRule()}
                placeholder="e.g. No smoking on premises" className="input-field flex-1" />
              <button onClick={addRule} className="btn-outline py-2 px-4"><Plus size={16} /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.houseRules.map((r, i) => (
                <span key={i} className="flex items-center gap-1.5 bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-sm">
                  {r}
                  <button onClick={() => set('houseRules', form.houseRules.filter((_, idx) => idx !== i))}><X size={12} /></button>
                </span>
              ))}
            </div>
          </div>

          {/* Photos */}
          <div className="card p-6">
            <h3 className="font-display font-bold text-lg mb-4">Photos</h3>
            <label className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-brand-400 hover:bg-brand-50 transition-all">
              <Upload size={28} className="text-gray-400" />
              <div className="text-center">
                <p className="font-medium text-gray-700">Upload PG Photos</p>
                <p className="text-sm text-gray-400">Up to 10 images · JPG, PNG, WebP</p>
              </div>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImages} />
            </label>
            {previews.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mt-4">
                {previews.map((src, i) => (
                  <div key={i} className="relative group">
                    <img src={src} alt="" className="w-full h-20 object-cover rounded-xl" />
                    <button onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs hidden group-hover:flex items-center justify-center">
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button onClick={() => navigate('/dashboard')} className="btn-ghost flex-1">Cancel</button>
            <button onClick={submit} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Publish Listing 🚀'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
