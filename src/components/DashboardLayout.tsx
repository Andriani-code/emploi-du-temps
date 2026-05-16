import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  DoorOpen, 
  Users, 
  School, 
  BookOpen, 
  Calendar, 
  Search, 
  Bell, 
  Settings, 
  LogOut, 
  ChevronDown,
  Menu,
  X,
  User as UserIcon,
  Filter
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { useData } from '../lib/DataContext';
import { UserRole, Level } from '../data';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const sidebarItems: SidebarItem[] = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.TEACHER] },
  { name: 'Salles', path: '/admin/rooms', icon: DoorOpen, roles: [UserRole.ADMIN] },
  { name: 'Enseignants', path: '/admin/teachers', icon: Users, roles: [UserRole.ADMIN] },
  { name: 'Classes', path: '/admin/classes', icon: School, roles: [UserRole.ADMIN] },
  { name: 'Matières', path: '/admin/subjects', icon: BookOpen, roles: [UserRole.ADMIN] },
  { name: 'Emplois du temps', path: '/admin/schedules', icon: Calendar, roles: [UserRole.ADMIN, UserRole.TEACHER] },
  { name: 'Paramètres', path: '/admin/settings', icon: Settings, roles: [UserRole.ADMIN, UserRole.TEACHER] },
];

import logo from '../assets/logo.png';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [level, setLevel] = useState<Level>(Level.LICENCE);

  const { notifications, markAllAsRead, clearNotification } = useData();
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  if (!user) {
    navigate('/login');
    return null;
  }

  const filteredItems = sidebarItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-bg-light flex">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        transition={{ type: 'spring', damping: 20, stiffness: 150 }}
        className="bg-secondary text-white flex flex-col fixed h-full z-50 shadow-xl"
      >
        <div className={`p-6 flex items-center transition-all duration-300 ${isSidebarOpen ? 'justify-start overflow-hidden' : 'justify-center'}`}>
          <img 
            src={logo} 
            alt="EMIT" 
            className={`w-10 h-10 object-contain brightness-0 invert transition-transform duration-300 ${isSidebarOpen ? 'scale-110' : 'scale-100'}`} 
          />
        </div>

        <nav className="flex-grow px-4 space-y-2 mt-4">
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                {isSidebarOpen && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-medium whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <button 
            onClick={logout}
            className="flex items-center gap-4 w-full p-3 rounded-xl text-white/60 hover:bg-error/10 hover:text-error transition-all"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Déconnexion</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.main 
        initial={false}
        animate={{ marginLeft: isSidebarOpen ? 280 : 80 }}
        transition={{ type: 'spring', damping: 20, stiffness: 150 }}
        className="flex-grow min-h-screen"
      >
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-border px-8 flex items-center justify-between sticky top-0 z-40 bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-bg-light rounded-lg transition-colors text-text-muted"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="relative group">
              <div className="flex items-center gap-3 bg-bg-light px-4 py-2 rounded-xl group-hover:bg-border/50 transition-colors cursor-pointer">
                <span className="text-sm font-semibold text-text-dark">Niveau : {level}</span>
                <ChevronDown size={16} className="text-text-muted" />
              </div>
              <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-50">
                {Object.values(Level).map((l) => (
                  <button 
                    key={l}
                    onClick={() => setLevel(l)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-bg-light text-text-dark font-medium"
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) markAllAsRead();
                }}
                className="relative p-2 text-text-muted hover:text-[#001D4A] transition-colors"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-error rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowNotifications(false)}
                    />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-80 bg-white border border-border shadow-2xl rounded-3xl py-4 z-50 max-h-[400px] flex flex-col"
                    >
                      <div className="px-6 mb-4 flex items-center justify-between">
                        <h4 className="font-bold text-text-dark">Notifications</h4>
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{notifications.length} au total</span>
                      </div>
                      
                      <div className="flex-grow overflow-y-auto px-2 space-y-1">
                        {notifications.length === 0 ? (
                          <div className="py-8 text-center text-text-muted">
                            <Bell size={32} className="mx-auto mb-2 opacity-20" />
                            <p className="text-xs font-medium">Aucune notification</p>
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div 
                              key={n.id}
                              className={`p-3 rounded-2xl transition-colors relative group ${
                                n.read ? 'hover:bg-bg-light' : 'bg-[#001D4A]/5 hover:bg-[#001D4A]/10'
                              }`}
                            >
                              <div className="flex gap-3">
                                <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                                  n.type === 'error' ? 'bg-error' : 
                                  n.type === 'warning' ? 'bg-orange-500' : 'bg-emerald-500'
                                }`} />
                                <div className="space-y-0.5">
                                  <p className="text-xs font-bold text-text-dark leading-tight">{n.title}</p>
                                  <p className="text-[10px] text-text-muted leading-relaxed line-clamp-2">{n.message}</p>
                                  <p className="text-[9px] font-medium text-text-muted mt-1">{n.time}</p>
                                </div>
                              </div>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  clearNotification(n.id);
                                }}
                                className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white rounded-lg text-text-muted hover:text-error"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-3 pl-6 border-l border-border">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-text-dark">{user.name}</p>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{user.role}</p>
              </div>
              <div className="w-10 h-10 bg-bg-light rounded-full border border-border flex items-center justify-center text-primary overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={20} />
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 pb-12">
          {children}
        </div>
      </motion.main>
    </div>
  );
};
