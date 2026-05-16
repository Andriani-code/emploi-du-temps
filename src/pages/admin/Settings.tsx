import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Lock, 
  Bell, 
  Shield, 
  LogOut,
  ChevronRight,
  Mail,
  X,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../lib/AuthContext';
import { UserRole } from '../../data';

export const Settings: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  if (!user) return null;

  const isAdmin = user.role === UserRole.ADMIN;

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser({ email: newEmail });
      setStatus({ type: 'success', message: 'Email mis à jour avec succès.' });
      setShowEmailModal(false);
      setNewEmail('');
    } catch (error) {
      setStatus({ type: 'error', message: 'Erreur lors de la mise à jour.' });
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: 'Les mots de passe ne correspondent pas.' });
      return;
    }
    try {
      await updateUser({ password: newPassword });
      setStatus({ type: 'success', message: 'Mot de passe mis à jour avec succès.' });
      setShowPasswordModal(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setStatus({ type: 'error', message: 'Erreur lors de la mise à jour.' });
    }
  };

  const sections = [
    {
      title: 'Mon Compte',
      show: isAdmin,
      items: [
        { icon: UserIcon, label: 'Profile', value: user.name, color: 'bg-blue-50 text-blue-600' },
        { 
          icon: Mail, 
          label: 'Changer l\'Email', 
          value: user.email, 
          color: 'bg-purple-50 text-purple-600',
          onClick: () => {
            setNewEmail(user.email);
            setShowEmailModal(true);
          }
        },
      ]
    },
    {
      title: 'Sécurité',
      show: isAdmin,
      items: [
        { 
          icon: Lock, 
          label: 'Changer le mot de passe', 
          color: 'bg-blue-50 text-blue-600',
          onClick: () => setShowPasswordModal(true)
        },
        { icon: Shield, label: 'Authentification à deux facteurs', color: 'bg-blue-50 text-blue-600' },
      ]
    },
    {
      title: 'Préférences',
      show: true,
      items: [
        { icon: Bell, label: 'Notifications par email', color: 'bg-blue-50 text-blue-600', toggle: true },
        { icon: Bell, label: 'Notifications push', color: 'bg-blue-50 text-blue-600', toggle: true },
      ]
    }
  ].filter(s => s.show);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-text-dark mb-2">Paramètres</h1>
        <p className="text-text-muted">Gérez vos informations personnelles et vos préférences.</p>
      </div>

      {status && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl flex items-center gap-3 ${
            status.type === 'success' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-error/10 text-error border border-error/20'
          }`}
        >
          {status.type === 'success' ? <CheckCircle2 size={20} /> : <X size={20} />}
          <p className="text-sm font-bold">{status.message}</p>
          <button onClick={() => setStatus(null)} className="ml-auto">
            <X size={16} />
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white rounded-[32px] p-8 border border-border shadow-sm flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-bg-light rounded-full border-4 border-white shadow-xl flex items-center justify-center text-[#001D4A] mb-4">
              <UserIcon size={48} />
            </div>
            <h3 className="text-xl font-bold text-text-dark leading-tight mb-1">{user.name}</h3>
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest">{user.role}</p>
            
            <div className="w-full mt-8 pt-8 border-t border-border">
              <button 
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-error/10 text-error font-bold hover:bg-error/20 transition-all"
              >
                <LogOut size={18} />
                Se déconnecter
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          {sections.map((section, idx) => (
            <motion.div 
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[32px] border border-border shadow-sm overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-border bg-slate-50/50">
                <h4 className="font-bold text-text-dark">{section.title}</h4>
              </div>
              <div className="divide-y divide-border">
                {section.items.map((item, i) => (
                  <button 
                    key={i}
                    onClick={item.onClick}
                    disabled={!item.onClick && !item.toggle}
                    className={`w-full px-8 py-4 flex items-center justify-between transition-colors text-left ${item.onClick ? 'hover:bg-bg-light' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center`}>
                        <item.icon size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text-dark">{item.label}</p>
                        {item.value && <p className="text-xs text-text-muted">{item.value}</p>}
                      </div>
                    </div>
                    {item.toggle ? (
                      <div className="w-10 h-6 bg-[#001D4A] rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                      </div>
                    ) : item.onClick ? (
                      <ChevronRight size={18} className="text-text-muted" />
                    ) : null}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showEmailModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEmailModal(false)}
              className="absolute inset-0 bg-[#001D4A]/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl p-8 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-display font-bold text-text-dark">Modifier l'Email</h3>
                <button 
                  onClick={() => setShowEmailModal(false)}
                  className="p-2 hover:bg-bg-light rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleUpdateEmail} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Nouvel Email</label>
                  <input 
                    type="email" 
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                    className="w-full px-6 py-4 bg-bg-light rounded-2xl border-none focus:ring-2 focus:ring-[#001D4A] transition-all font-medium"
                    placeholder="nouvel@email.mg"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-[#001D4A] text-white font-bold rounded-2xl hover:bg-[#00215E] transition-all"
                >
                  Mettre à jour
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {showPasswordModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPasswordModal(false)}
              className="absolute inset-0 bg-[#001D4A]/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl p-8 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-display font-bold text-text-dark">Modifier le Mot de Passe</h3>
                <button 
                  onClick={() => setShowPasswordModal(false)}
                  className="p-2 hover:bg-bg-light rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Nouveau Mot de Passe</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-6 py-4 bg-bg-light rounded-2xl border-none focus:ring-2 focus:ring-[#001D4A] transition-all font-medium"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Confirmer le Mot de Passe</label>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-6 py-4 bg-bg-light rounded-2xl border-none focus:ring-2 focus:ring-[#001D4A] transition-all font-medium"
                    placeholder="••••••••"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-[#001D4A] text-white font-bold rounded-2xl hover:bg-[#00215E] transition-all"
                >
                  Mettre à jour
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
