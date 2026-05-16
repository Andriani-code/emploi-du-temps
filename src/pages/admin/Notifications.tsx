import React, { useState } from 'react';
import { 
  Bell, 
  Trash2, 
  CheckCheck, 
  Clock, 
  Info, 
  AlertTriangle, 
  AlertCircle,
  X,
  Square,
  CheckSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../../lib/DataContext';
import { useAuth } from '../../lib/AuthContext';
import { UserRole } from '../../data';

export const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const { notifications, clearNotification, clearNotifications, markAllAsRead } = useData();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  if (!user) return null;

  // Filter based on user role/id (as in DashboardLayout)
  const relevantNotifications = notifications.filter(n => {
    if (user.role === UserRole.ADMIN) {
      return !n.targetRole || n.targetRole === UserRole.ADMIN || n.targetUserId === user.id;
    }
    return n.targetUserId === user.id;
  });

  const allSelected = relevantNotifications.length > 0 && selectedIds.length === relevantNotifications.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(relevantNotifications.map(n => n.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (confirm(`Voulez-vous supprimer les ${selectedIds.length} notifications sélectionnées ?`)) {
      clearNotifications(selectedIds);
      setSelectedIds([]);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertCircle className="text-error" size={20} />;
      case 'warning': return <AlertTriangle className="text-orange-500" size={20} />;
      case 'success': return <AlertCircle className="text-blue-500" size={20} />;
      default: return <Info className="text-blue-500" size={20} />;
    }
  };

  const getBorderColor = (type: string, read: boolean) => {
    if (read) return 'border-transparent';
    switch (type) {
      case 'error': return 'border-error';
      case 'warning': return 'border-orange-500';
      case 'success': return 'border-blue-500';
      default: return 'border-[#001D4A]';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-dark mb-2">Centre de Notifications</h1>
          <p className="text-text-muted">Consultez l'historique de vos alertes et messages système.</p>
        </div>
        <div className="flex gap-4">
          {selectedIds.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              className="flex items-center gap-2 text-sm font-bold text-error hover:underline transition-all"
            >
              <Trash2 size={16} />
              Supprimer ({selectedIds.length})
            </button>
          )}
          <button 
            onClick={markAllAsRead}
            className="flex items-center gap-2 text-sm font-bold text-[#001D4A] hover:underline transition-all"
          >
            <CheckCheck size={16} />
            Tout marquer comme lu
          </button>
        </div>
      </div>

      <div className="bg-white border-t border-border">
        {relevantNotifications.length === 0 ? (
          <div className="py-20 text-center text-text-muted">
            <div className="w-20 h-20 bg-bg-light rounded-full flex items-center justify-center mx-auto mb-4 opacity-20">
              <Bell size={40} />
            </div>
            <h3 className="text-lg font-bold text-text-dark">Aucune notification</h3>
            <p className="text-sm">Vous n'avez pas d'alertes pour le moment.</p>
          </div>
        ) : (
          <div>
            <div className="px-6 py-4 bg-bg-light/30 border-b border-border flex items-center gap-4">
              <button 
                onClick={toggleSelectAll}
                className="text-text-muted hover:text-[#001D4A] transition-colors"
                title={allSelected ? "Désélectionner tout" : "Sélectionner tout"}
              >
                {allSelected ? <CheckSquare size={20} className="text-[#001D4A]" /> : <Square size={20} />}
              </button>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                {selectedIds.length > 0 ? `${selectedIds.length} notification(s) sélectionnée(s)` : 'Sélectionner tout'}
              </span>
            </div>
            <div className="divide-y divide-border">
              <AnimatePresence initial={false}>
                {relevantNotifications.map((n) => (
                  <motion.div 
                    key={n.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`p-6 flex items-start group relative transition-colors border-l-4 ${getBorderColor(n.type, n.read)} ${!n.read ? 'bg-[#001D4A]/5' : 'hover:bg-bg-light'}`}
                  >
                    <div className="flex items-start gap-4 flex-grow">
                      <button 
                        onClick={() => toggleSelect(n.id)}
                        className={`mt-1 transition-colors ${selectedIds.includes(n.id) ? 'text-[#001D4A]' : 'text-text-muted group-hover:text-[#001D4A]/50'}`}
                      >
                        {selectedIds.includes(n.id) ? <CheckSquare size={20} /> : <Square size={20} />}
                      </button>
                      <div className="mt-1">
                        {getIcon(n.type)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h4 className={`font-bold ${!n.read ? 'text-[#001D4A]' : 'text-text-dark'}`}>{n.title}</h4>
                          {!n.read && (
                            <div className="w-1.5 h-1.5 bg-[#001D4A] rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-text-muted leading-relaxed max-w-2xl">{n.message}</p>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-wider mt-2">
                          <Clock size={12} />
                          {n.time}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => clearNotification(n.id)}
                      className="p-2 opacity-0 group-hover:opacity-100 transition-all text-text-muted hover:text-error"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {relevantNotifications.length > 0 && (
        <div className="text-center">
          <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
            {relevantNotifications.filter(n => !n.read).length} non lues — {relevantNotifications.length} historiques
          </p>
        </div>
      )}
    </div>
  );
};
