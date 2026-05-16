import React from 'react';
import { motion } from 'motion/react';
import { 
  DoorOpen, 
  Users, 
  School, 
  BookOpen, 
  Calendar, 
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MapPin,
  Settings,
  Bell
} from 'lucide-react';
import { MOCK_ROOMS, MOCK_TEACHERS, MOCK_CLASSES, MOCK_SUBJECTS, MOCK_SCHEDULES, UserRole } from '../../data';
import { useAuth } from '../../lib/AuthContext';
import { useData } from '../../lib/DataContext';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { schedules, rooms, teachers, classes, subjects } = useData();
  const isAdmin = user?.role === UserRole.ADMIN;

  const teacherId = user?.role === UserRole.TEACHER ? teachers.find(t => t.email === user.email)?.id : null;

  const stats = isAdmin ? [
    { label: 'Salles', value: rooms.length, icon: DoorOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Enseignants', value: teachers.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Classes', value: classes.length, icon: School, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Cours', value: subjects.length, icon: BookOpen, color: 'text-orange-600', bg: 'bg-orange-50' },
  ] : [
    { label: 'Mes Cours', value: schedules.filter(s => s.teacherId === teacherId).length, icon: BookOpen, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Heures / Semaine', value: schedules.filter(s => s.teacherId === teacherId).length * 2, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Salles occupées', value: rooms.length, icon: DoorOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Notifications', value: 2, icon: Bell, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const notifications = [
    { id: 1, text: isAdmin ? 'Changement salle - L2' : 'Nouvelle affectation - Algorithmique', type: 'warning', time: 'Il y a 5 min' },
    { id: 2, text: isAdmin ? 'Annulation cours - M1' : 'Cours validé par l\'admin', type: 'success', time: 'Il y a 15 min' },
    { id: 3, text: isAdmin ? 'Nouveau planning - L3' : 'Rappel : Réunion département', type: 'warning', time: 'Il y a 1h' },
  ];

  const filteredSchedules = isAdmin 
    ? schedules.slice(0, 5) 
    : schedules.filter(s => s.teacherId === teacherId).slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-text-dark mb-2">Tableau de bord</h1>
        <p className="text-text-muted">
          {isAdmin ? 'Bienvenue dans votre espace d\'administration.' : `Bienvenue, ${user?.name}. Voici votre planning d'aujourd'hui.`}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-border shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-text-muted text-sm font-medium mb-1">{stat.label}</p>
                <h3 className="text-3xl font-display font-bold text-text-dark">{stat.value}</h3>
              </div>
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 w-fit px-2 py-1 rounded-lg">
              <TrendingUp size={12} />
              +2 cette semaine
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daily Planning */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-text-dark">Planning du jour</h2>
            <button className="text-primary text-sm font-bold flex items-center gap-2 hover:underline">
              Voir tout
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
            <div className="divide-y divide-border">
              {filteredSchedules.map((sch) => (
                <div key={sch.id} className="p-6 flex items-center gap-6 hover:bg-bg-light transition-colors group">
                  <div className="flex flex-col items-center justify-center p-3 sm:px-6 border-r border-border min-w-[120px]">
                    <span className="text-lg font-bold text-text-dark">{sch.startTime}</span>
                    <span className="text-xs font-medium text-text-muted">{sch.endTime}</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-lg uppercase tracking-wider">
                        {classes.find(c => c.id === sch.classId)?.name}
                      </span>
                      <h4 className="text-base font-bold text-text-dark">
                        {subjects.find(s => s.id === sch.subjectId)?.name}
                      </h4>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-text-muted">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-accent" />
                        {rooms.find(r => r.id === sch.roomId)?.name}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users size={14} className="text-accent" />
                        {teachers.find(t => t.id === sch.teacherId)?.name}
                      </div>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-white rounded-lg border border-border text-text-muted hover:text-primary transition-all">
                      <Settings size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-text-dark">Notifications</h2>
            <button className="text-primary text-sm font-bold flex items-center gap-2 hover:underline">
              Tout lire
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm flex flex-col h-full min-h-[400px]">
            <div className="flex-grow divide-y divide-border">
              {notifications.map((notif) => (
                <div key={notif.id} className="p-6 flex items-start gap-4 hover:bg-bg-light transition-colors">
                  <div className={`mt-1 p-2 rounded-xl border ${
                    notif.type === 'success' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                    notif.type === 'warning' ? 'bg-orange-50 border-orange-100 text-orange-600' :
                    'bg-error/5 border-error/10 text-error'
                  }`}>
                    {notif.type === 'success' ? <CheckCircle2 size={16} /> :
                     notif.type === 'warning' ? <AlertCircle size={16} /> :
                     <AlertCircle size={16} />}
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-semibold text-text-dark mb-1">{notif.text}</p>
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <Clock size={12} />
                      {notif.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="p-4 text-center text-sm font-bold text-primary hover:bg-bg-light transition-colors border-t border-border">
              Voir tout l'historique
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
