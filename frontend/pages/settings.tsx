import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { User, Shield, Bell, Moon, Save, CheckCircle2 } from 'lucide-react';
import AppShell from '../components/AppShell';

export default function SettingsPage() {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [displayName, setDisplayName] = useState('Admin User');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [defaultDomain, setDefaultDomain] = useState('Engineering_Aptitude');

  useEffect(() => {
    if (!localStorage.getItem('setu_token')) router.push('/login');
  }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 mb-1">Settings</h1>
        <p className="text-sm text-gray-500 mb-8">Manage your account preferences and defaults.</p>

        <div className="space-y-6">
          {/* Profile */}
          <div className="card-elevated p-6">
            <div className="flex items-center space-x-3 mb-5">
              <User className="w-5 h-5 text-brand-500" />
              <h2 className="font-bold text-gray-900">Profile</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Display Name</label>
                <input type="text" className="input-field" value={displayName} onChange={e => setDisplayName(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Account Type</label>
                <div className="flex items-center space-x-2">
                  <span className="badge bg-brand-50 text-brand-700 border border-brand-200">Free Plan</span>
                  <span className="text-xs text-gray-400">5 evaluations / month</span>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="card-elevated p-6">
            <div className="flex items-center space-x-3 mb-5">
              <Shield className="w-5 h-5 text-violet-500" />
              <h2 className="font-bold text-gray-900">Evaluation Preferences</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Default Exam Domain</label>
                <select className="input-field" value={defaultDomain} onChange={e => setDefaultDomain(e.target.value)}>
                  <option value="Engineering_Aptitude">Engineering & Technical (GATE / JEE)</option>
                  <option value="Civil_Service_Admin">Administrative Studies (UPSC / PSC)</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-3 border-t border-gray-50">
                <div>
                  <p className="font-semibold text-sm text-gray-900">Email Notifications</p>
                  <p className="text-xs text-gray-400">Get notified when evaluations complete</p>
                </div>
                <button
                  onClick={() => setEmailNotifs(!emailNotifs)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${emailNotifs ? 'bg-brand-600' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${emailNotifs ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="flex items-center justify-between">
            <div>
              {saved && (
                <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center space-x-1.5 text-emerald-600 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" /><span>Settings saved</span>
                </motion.span>
              )}
            </div>
            <button onClick={handleSave} className="btn-primary text-sm">
              <Save className="w-4 h-4 mr-1.5" /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
