import { useState, useEffect } from 'react';
import { X, Phone, Shield, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const COUNTRY_CODES = [
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+1',  country: 'US', flag: '🇺🇸' },
  { code: '+44', country: 'GB', flag: '🇬🇧' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+971', country: 'AE', flag: '🇦🇪' },
  { code: '+65', country: 'SG', flag: '🇸🇬' },
  { code: '+60', country: 'MY', flag: '🇲🇾' },
];

export default function AuthModal({ open, onClose, defaultRole = null }) {
  // Steps: 1=phone, 2=signup(new user), 3=otp, 4=done
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState(defaultRole || 'seeker');
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [slowNetwork, setSlowNetwork] = useState(false);
  const { login } = useAuth();

  // Sync role when modal opens with a defaultRole (e.g. "List Your PG" button)
  useEffect(() => {
    if (open) setRole(defaultRole || 'seeker');
  }, [open, defaultRole]);

  const phoneError = phone.length > 0 && phone.length !== 10
    ? phone.length < 10 ? 'Number too short (10 digits required)' : 'Number too long (10 digits required)'
    : null;

  const reset = () => { setStep(1); setPhone(''); setCountryCode('+91'); setOtp(''); setName(''); setRole(defaultRole || 'seeker'); setIsNewUser(false); setSlowNetwork(false); };
  const close = () => { reset(); onClose(); };

  // Step 1: Check if user exists
  const checkUser = async () => {
    if (!/^\d{10}$/.test(phone)) return toast.error('Enter valid 10-digit number');
    setLoading(true);
    setSlowNetwork(false);
    const slowTimer = setTimeout(() => setSlowNetwork(true), 4000);
    try {
      const { data } = await api.post('/auth/check-user', { phone });
      setIsNewUser(data.isNewUser);
      if (data.isNewUser) {
        setStep(2); // Show signup form first
      } else {
        await sendOTP(); // Existing user → send OTP directly
      }
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        toast.error('Server took too long. Please try again.');
      } else {
        toast.error(err.response?.data?.message || 'Something went wrong');
      }
    } finally {
      clearTimeout(slowTimer);
      setSlowNetwork(false);
      setLoading(false);
    }
  };

  // Send OTP
  const sendOTP = async () => {
    setLoading(true);
    try {
      await api.post('/auth/send-otp', { phone, countryCode });
      toast.success('OTP sent to your mobile number');
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  // Step 2: New user fills name+role, then send OTP
  const proceedSignup = async () => {
    if (!name.trim()) return toast.error('Please enter your name');
    await sendOTP();
  };

  // Step 3: Verify OTP
  const verifyOTP = async () => {
    if (otp.length !== 6) return toast.error('Enter 6-digit OTP');
    setLoading(true);
    try {
      const payload = { phone, otp, countryCode, name: isNewUser ? name : undefined, role };
      const { data } = await api.post('/auth/verify-otp', payload);
      login(data.token, data.user);
      toast.success(`Welcome${isNewUser ? '' : ' back'}, ${data.user.name}!`);
      close();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally { setLoading(false); }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-brand-500 to-brand-600 px-8 pt-8 pb-10">
            <button onClick={close} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors">
              <X size={16} />
            </button>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
              {step === 1 ? <Phone size={22} className="text-white" /> : <Shield size={22} className="text-white" />}
            </div>
            <h2 className="font-display text-2xl font-bold text-white mb-1">
              {step === 1 ? 'Welcome to PG Life' : step === 2 ? 'Create Your Account' : 'Verify Your Number'}
            </h2>
            <p className="text-white/75 text-sm">
              {step === 1 ? 'Enter your mobile number to continue' :
               step === 2 ? 'Tell us a little about yourself' :
               `OTP sent to ${countryCode} ${phone}`}
            </p>
          </div>

          {/* Body */}
          <div className="px-8 py-7 -mt-4 bg-white rounded-t-3xl">

            {/* Step 1: Phone number */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Mobile Number</label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={e => setCountryCode(e.target.value)}
                      className="px-2 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 cursor-pointer focus:outline-none focus:border-brand-400"
                    >
                      {COUNTRY_CODES.map(c => (
                        <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                      ))}
                    </select>
                    <input
                      type="tel" maxLength={10} value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                      onKeyDown={e => e.key === 'Enter' && checkUser()}
                      placeholder="9876543210"
                      className={`input-field flex-1 ${phoneError ? 'border-red-400 focus:border-red-400' : ''}`}
                      autoFocus
                    />
                  </div>
                  {phoneError && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <span>⚠</span> {phoneError}
                    </p>
                  )}
                </div>
                <button onClick={checkUser} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      {slowNetwork ? 'Server waking up, please wait...' : 'Please wait...'}
                    </span>
                  ) : <>Continue <ChevronRight size={16} /></>}
                </button>
                <p className="text-xs text-center text-gray-400">By continuing, you agree to our Terms & Privacy Policy</p>
              </div>
            )}

            {/* Step 2: New user signup form */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-xl text-sm text-blue-700 font-medium text-center">
                  New here! Let's create your account
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Your Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && proceedSignup()}
                    placeholder="Full Name" className="input-field" autoFocus />
                </div>
                {!defaultRole && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">I am a</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { val: 'seeker', label: 'PG Seeker', sub: 'Looking for PG' },
                        { val: 'owner', label: 'PG Owner', sub: 'List my property' }
                      ].map(r => (
                        <button key={r.val} onClick={() => setRole(r.val)}
                          className={`p-3 rounded-xl border-2 text-left transition-all ${role === r.val ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}`}>
                          <div className="font-semibold text-sm text-gray-800">{r.label}</div>
                          <div className="text-xs text-gray-500">{r.sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {defaultRole === 'owner' && (
                  <div className="p-3 rounded-xl border-2 border-brand-500 bg-brand-50">
                    <div className="font-semibold text-sm text-gray-800">PG Owner</div>
                    <div className="text-xs text-gray-500">List your property</div>
                  </div>
                )}
                <button onClick={proceedSignup} disabled={loading || !name.trim()} className="btn-primary w-full flex items-center justify-center gap-2">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <>Get OTP <ChevronRight size={16} /></>}
                </button>
                <button onClick={() => setStep(1)} className="w-full text-sm text-gray-500 hover:text-brand-500 transition-colors">
                  ← Change number
                </button>
              </div>
            )}

            {/* Step 3: OTP */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Enter OTP</label>
                  <input
                    type="tel" maxLength={6} value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={e => e.key === 'Enter' && verifyOTP()}
                    placeholder="• • • • • •"
                    className="input-field text-2xl tracking-[1rem] text-center font-mono"
                    autoFocus
                  />
                </div>
                <button onClick={verifyOTP} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : isNewUser ? 'Create Account' : 'Verify & Login'}
                </button>
                <button onClick={() => setStep(isNewUser ? 2 : 1)} className="w-full text-sm text-gray-500 hover:text-brand-500 transition-colors">
                  ← Go back
                </button>
              </div>
            )}

          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
