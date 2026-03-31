import { useState } from 'react';
import { User, Phone, Mail, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/auth/profile', { name, email });
      await refreshUser();
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update'); }
    finally { setSaving(false); }
  };

  return (
    <div className="py-10">
      <div className="page-container max-w-xl">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
        <div className="card p-6 space-y-5">
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
            <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center">
              <span className="font-display text-2xl font-bold text-brand-600">{user?.name?.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <div className="font-display font-bold text-xl text-gray-900">{user?.name}</div>
              <div className="text-sm text-gray-500 capitalize">{user?.role}</div>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block flex items-center gap-1"><Phone size={11} /> Phone</label>
            <input value={user?.phone} disabled className="input-field bg-gray-50 text-gray-500 cursor-not-allowed" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block flex items-center gap-1"><User size={11} /> Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block flex items-center gap-1"><Mail size={11} /> Email (optional)</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="input-field" />
          </div>
          <button onClick={save} disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Save Profile</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
