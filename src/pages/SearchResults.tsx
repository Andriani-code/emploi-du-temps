import React from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ArrowLeft, User, Clock, MapPin, Calendar } from 'lucide-react';
import { MOCK_CLASSES, ClassCard } from './Timetable';
import { MOCK_SCHEDULES } from './TimetableDetail';

export const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q')?.toLowerCase() || '';

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const times = ['08:00 - 10:00', '10:15 - 12:15', '13:30 - 15:30', '15:45 - 17:45'];

  // Filter classes
  const classResults = MOCK_CLASSES.filter(cls => 
    cls.level.toLowerCase().includes(query) ||
    cls.mention.toLowerCase().includes(query) ||
    cls.parcours.toLowerCase().includes(query) ||
    cls.year.toLowerCase().includes(query)
  );

  // Filter teachers/sessions
  const sessionResults: any[] = [];
  Object.entries(MOCK_SCHEDULES).forEach(([classId, sessions]) => {
    const cls = MOCK_CLASSES.find(c => c.id === Number(classId));
    sessions.forEach(session => {
      if (
        session.teacher.toLowerCase().includes(query) ||
        session.subject.toLowerCase().includes(query) ||
        session.room.toLowerCase().includes(query)
      ) {
        sessionResults.push({
          ...session,
          classId: Number(classId),
          className: cls ? `${cls.level} ${cls.mention}` : 'Inconnue'
        });
      }
    });
  });

  const handleNavigate = (id: number) => {
    navigate(`/timetable/detail?id=${id}`);
  };

  const hasResults = classResults.length > 0 || sessionResults.length > 0;

  return (
    <div className="pt-32 pb-24 px-12">
      <div className="max-w-[1440px] mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-4">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all"
            >
              <ArrowLeft size={16} />
              Retour
            </button>
            <h1 className="text-4xl font-bold text-text-dark tracking-tight">
              {query ? `Résultats pour "${query}"` : 'Tous les résultats'}
            </h1>
            <p className="text-text-muted">
              {classResults.length + sessionResults.length} résultats trouvés.
            </p>
          </div>
        </div>

        {/* Classes Section */}
        {classResults.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-text-dark flex items-center gap-2">
              <div className="w-2 h-8 bg-primary rounded-full"></div>
              Classes correspondantes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {classResults.map((cls) => (
                  <motion.div
                    key={`class-${cls.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ClassCard 
                      {...cls}
                      onNavigate={handleNavigate}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Teachers / Sessions Section */}
        {sessionResults.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-text-dark flex items-center gap-2">
              <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
              Sessions / Enseignants
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {sessionResults.map((session, idx) => (
                  <motion.div
                    key={`session-${session.id}-${idx}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group"
                  >
                    <Link 
                      to={`/timetable/detail?id=${session.classId}`}
                      className="block p-6 bg-white border border-border rounded-2xl hover:border-primary/50 hover:shadow-lg transition-all space-y-4"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{session.className}</span>
                          <h3 className="font-bold text-text-dark group-hover:text-primary transition-colors">{session.subject}</h3>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          session.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                          session.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                          session.color === 'rose' ? 'bg-rose-50 text-rose-600' :
                          'bg-emerald-50 text-emerald-600'
                        }`}>
                          {session.teacher}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50">
                        <div className="flex items-center gap-2 text-text-muted text-xs">
                          <Calendar size={14} className="text-primary" />
                          {days[session.dayIdx]}
                        </div>
                        <div className="flex items-center gap-2 text-text-muted text-xs">
                          <Clock size={14} className="text-primary" />
                          {times[session.slotIdx]}
                        </div>
                        <div className="flex items-center gap-2 text-text-muted text-xs col-span-2">
                          <MapPin size={14} className="text-primary" />
                          {session.room}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {!hasResults && (
          <div className="py-32 text-center space-y-6">
            <div className="w-20 h-20 bg-bg-light text-text-muted rounded-full flex items-center justify-center mx-auto">
              <Search size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-text-dark">Aucun résultat trouvé</h2>
              <p className="text-text-muted max-w-sm mx-auto">
                Nous n'avons trouvé aucune classe, aucun enseignant ou matière correspondant à "{query}".
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
