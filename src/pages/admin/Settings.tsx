import React from 'react';
import { 
  User as UserIcon, 
  Lock, 
  Bell, 
  Shield, 
  LogOut,
  ChevronRight,
  Mail,
  Smartphone
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../lib/AuthContext';
import { UserRole } from '../../data';

export const Settings: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const isAdmin = user.role === UserRole.ADMIN;

  const sections = [
    {
      title: 'Mon Compte',
      show: isAdmin,
      items: [
        { icon: UserIcon, label: 'Profile', value: user.name, color: 'bg-blue-50 text-blue-600' },
        { icon: Mail, label: 'Email', value: user.email, color: 'bg-purple-50 text-purple-600' },
        { icon: Smartphone, label: 'Téléphone', value: '+261 34 00 000 00', color: 'bg-blue-50 text-blue-600' },
      ]
    },
    {
      title: 'Sécurité',
      show: isAdmin,
      items: [
        { icon: Lock, label: 'Changer le mot de passe', color: 'bg-blue-50 text-blue-600' },
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
                    className="w-full px-8 py-4 flex items-center justify-between hover:bg-bg-light transition-colors text-left"
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
                    ) : (
                      <ChevronRight size={18} className="text-text-muted" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
