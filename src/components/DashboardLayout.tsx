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
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { useData } from '../lib/DataContext';
import { UserRole } from '../data';

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
  { name: 'Notifications', path: '/admin/notifications', icon: Bell, roles: [UserRole.ADMIN, UserRole.TEACHER] },
  { name: 'Paramètres', path: '/admin/settings', icon: Settings, roles: [UserRole.ADMIN, UserRole.TEACHER] },
];

import logo from '../assets/logo.png';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);

  // Handle window resize for sidebar
  React.useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { notifications, markAllAsRead, clearNotification } = useData();
  const [showNotifications, setShowNotifications] = useState(false);

  // Filter notifications based on user role and target user ID
  const relevantNotifications = notifications.filter(n => {
    // If Admin, show everything targeting Admin role or having no specific target
    if (user.role === UserRole.ADMIN) {
      return !n.targetRole || n.targetRole === UserRole.ADMIN || n.targetUserId === user.id;
    }
    // If Teacher, show notifications targeting them specifically
    return n.targetUserId === user.id;
  });

  const unreadCount = relevantNotifications.filter(n => !n.read).length;

  if (!user) {
    navigate('/login');
    return null;
  }

  const filteredItems = sidebarItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-bg-light flex relative">
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && window.innerWidth < 1024 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isSidebarOpen ? 280 : 80,
          x: isSidebarOpen || window.innerWidth >= 1024 ? 0 : -280
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`bg-secondary text-white flex flex-col fixed h-full z-[60] shadow-xl md:shadow-none lg:shadow-xl transition-all duration-300`}
      >
        <div className={`p-4 flex items-center transition-all duration-300 ${isSidebarOpen ? 'justify-start overflow-hidden' : 'justify-center'}`}>
          <img 
            src={logo} 
            alt="EMIT" 
            className={`w-8 h-8 object-contain brightness-0 invert transition-transform duration-300 ${isSidebarOpen ? 'scale-110' : 'scale-100'}`} 
          />
        </div>

        <nav className="flex-grow px-3 space-y-1 mt-4">
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) setIsSidebarOpen(false);
                }}
                className={`flex items-center gap-3 p-2.5 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-accent text-white shadow-md shadow-accent/20' 
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={18} />
                {(isSidebarOpen || window.innerWidth < 1024) && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-medium whitespace-nowrap text-sm"
                  >
                    {item.name}
                  </motion.span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 mt-auto">
          <button 
            onClick={logout}
            className="flex items-center gap-3 w-full p-2.5 rounded-lg text-white/60 hover:bg-error/10 hover:text-error transition-all text-sm"
          >
            <LogOut size={18} />
            {(isSidebarOpen || window.innerWidth < 1024) && <span className="font-medium">Déconnexion</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.main 
        initial={false}
        animate={{ 
          marginLeft: window.innerWidth >= 1024 ? (isSidebarOpen ? 280 : 80) : 0 
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="flex-grow min-h-screen relative w-full"
      >
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-border px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 hover:bg-bg-light rounded-lg transition-colors text-text-muted"
            >
              {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) markAllAsRead();
                }}
                className="relative p-1.5 text-text-muted hover:text-[#001D4A] transition-colors"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-error rounded-full border-2 border-white flex items-center justify-center text-[7px] font-bold text-white">
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
                      className="absolute right-0 mt-3 w-80 bg-white border border-border shadow-2xl rounded-3xl py-4 z-50 max-h-[440px] flex flex-col"
                    >
                      <div className="px-6 mb-4 flex items-center justify-between">
                        <h4 className="font-bold text-text-dark">Notifications non lues</h4>
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{unreadCount}</span>
                      </div>
                      
                      <div className="flex-grow overflow-y-auto px-2 space-y-1">
                        {unreadCount === 0 ? (
                          <div className="py-8 text-center text-text-muted">
                            <Bell size={32} className="mx-auto mb-2 opacity-20" />
                            <p className="text-xs font-medium">Aucune nouvelle alerte</p>
                          </div>
                        ) : (
                          relevantNotifications.filter(n => !n.read).map((n) => (
                            <div 
                              key={n.id}
                              className="p-3 rounded-2xl transition-colors relative group bg-[#001D4A]/5 hover:bg-[#001D4A]/10"
                            >
                              <div className="flex gap-3">
                                <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                                  n.type === 'error' ? 'bg-error' : 
                                  n.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                                }`} />
                                <div className="space-y-0.5">
                                  <p className="text-xs font-bold text-text-dark leading-tight">{n.title}</p>
                                  <p className="text-[10px] text-text-muted leading-relaxed line-clamp-2">{n.message}</p>
                                  <p className="text-[9px] font-medium text-text-muted mt-1">{n.time}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="mt-4 px-4 pt-4 border-t border-border">
                        <button 
                          onClick={() => {
                            setShowNotifications(false);
                            navigate('/admin/notifications');
                          }}
                          className="w-full py-3 bg-bg-light hover:bg-[#001D4A]/5 rounded-2xl text-xs font-bold text-[#001D4A] transition-all"
                        >
                          Voir tout l'historique
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-text-dark">{user.name}</p>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{user.role}</p>
              </div>
              <div className="w-9 h-9 bg-bg-light rounded-full border border-border flex items-center justify-center text-primary overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={18} />
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 pb-12">
          {children}
        </div>
      </motion.main>
    </div>
  );
};
