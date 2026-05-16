import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Search,
  X,
  ArrowRight,
  User,
  Clock,
  MapPin,
  Calendar as CalendarIcon,
  ChevronDown,
  GraduationCap
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { MOCK_SCHEDULES } from './TimetableDetail';

const SelectField = ({ label, options, value, onChange }: any) => (
  <div className="flex-1 space-y-1.5">
    <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider ml-1">{label}</label>
    <div className="relative group">
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-border rounded-xl py-2.5 px-4 pr-10 text-sm font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer"
      >
        <option value="Tous">Tous</option>
        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none group-hover:text-primary transition-colors" />
    </div>
  </div>
);

export const ClassCard = ({ id, level, mention, year, selected, onClick, onNavigate }: any) => (
  <motion.button
    layout
    onClick={() => {
      onClick && onClick(id);
      onNavigate && onNavigate(id);
    }}
    whileHover={{ y: -4 }}
    className={`p-5 border-2 rounded-xl flex flex-col items-start text-left transition-all space-y-3 w-full ${
      selected 
        ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' 
        : 'border-border bg-white hover:border-primary/30 hover:shadow-xl hover:shadow-slate-200/50'
    }`}
  >
    <div className={`p-2 rounded-lg ${selected ? 'bg-primary text-white' : 'bg-bg-light text-primary'}`}>
      <GraduationCap size={18} />
    </div>
    <div className="space-y-0.5">
      <div className="text-[9px] font-bold text-primary uppercase tracking-widest leading-none">{level}</div>
      <h3 className="text-base font-bold text-text-dark leading-tight">{mention}</h3>
    </div>
    <p className="text-[11px] text-text-muted">{year}</p>
    <div className="pt-1 flex items-center gap-2 text-[10px] font-bold text-primary">
      Voir l'emploi du temps
      <ArrowRight size={12} />
    </div>
  </motion.button>
);

const SessionCard = ({ session, days, times }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="group"
  >
    <Link 
      to={`/timetable/detail?id=${session.classId}`}
      className="block p-4 bg-white border border-border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all space-y-3"
    >
      <div className="flex justify-between items-start">
        <div className="space-y-0.5">
          <span className="text-[9px] font-bold text-primary uppercase tracking-widest">{session.className}</span>
          <h3 className="font-bold text-text-dark group-hover:text-primary transition-colors text-xs">{session.subject}</h3>
        </div>
        <div className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase ${
          session.color === 'blue' ? 'bg-blue-50 text-blue-600' :
          session.color === 'purple' ? 'bg-purple-50 text-purple-600' :
          session.color === 'rose' ? 'bg-rose-50 text-rose-600' :
          'bg-indigo-50 text-indigo-600'
        }`}>
          {session.teacher}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-50">
        <div className="flex items-center gap-1.5 text-text-muted text-[10px]">
          <CalendarIcon size={10} className="text-primary" />
          {days[session.dayIdx]}
        </div>
        <div className="flex items-center gap-1.5 text-text-muted text-[10px]">
          <Clock size={10} className="text-primary" />
          {times[session.slotIdx]}
        </div>
        <div className="flex items-center gap-1.5 text-text-muted text-[10px] col-span-2">
          <MapPin size={10} className="text-primary" />
          {session.room}
        </div>
      </div>
    </Link>
  </motion.div>
);

// MOCK DATA - Facile à remplacer par un appel API
export const MOCK_CLASSES = [
  {
    id: 1,
    level: "L1",
    mention: "Informatique",
    parcours: "DAII",
    year: "Licence 1ère année",
  },
  {
    id: 2,
    level: "L2",
    mention: "Informatique",
    parcours: "DAII",
    year: "Licence 2ème année",
  },
  {
    id: 3,
    level: "L3",
    mention: "Informatique",
    parcours: "DAII",
    year: "Licence 3ème année",
  },
  {
    id: 4,
    level: "L1",
    mention: "Management",
    parcours: "AES",
    year: "Licence 1ère année",
  },
  {
    id: 5,
    level: "L2",
    mention: "Management",
    parcours: "AES",
    year: "Licence 2ème année",
  },
  {
    id: 6,
    level: "L3",
    mention: "Management",
    parcours: "AES",
    year: "Licence 3ème année",
  },
  {
    id: 7,
    level: "L1",
    mention: "Information, Communication et Multimédia",
    parcours: "IC",
    year: "Licence 1ère année",
  },
  {
    id: 8,
    level: "L2",
    mention: "Information, Communication et Multimédia",
    parcours: "IC",
    year: "Licence 2ème année",
  },
  {
    id: 9,
    level: "L3",
    mention: "Information, Communication et Multimédia",
    parcours: "IC",
    year: "Licence 3ème année",
  },
  {
    id: 10,
    level: "M1",
    mention: "Management",
    parcours: "MD",
    year: "Master 1ère année",
  },
  {
    id: 11,
    level: "M2",
    mention: "Management",
    parcours: "MD",
    year: "Master 2ème année",
  },
];

export const Timetable = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'classes' | 'sessions'>('classes');
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    mention: 'Tous',
    parcours: 'Tous',
    level: 'Tous'
  });

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const times = ['08:00 - 10:00', '10:15 - 12:15', '13:30 - 15:30', '15:45 - 17:45'];

  const handleNavigate = (id: number) => {
    navigate(`/timetable/detail?id=${id}`);
  };

  const filteredClasses = MOCK_CLASSES.filter(cls => {
    const matchesFilters = (filters.mention === 'Tous' || cls.mention === filters.mention) &&
           (filters.parcours === 'Tous' || cls.parcours === filters.parcours) &&
           (filters.level === 'Tous' || cls.level === filters.level);
    
    const query = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      cls.mention.toLowerCase().includes(query) || 
      cls.parcours.toLowerCase().includes(query) || 
      cls.level.toLowerCase().includes(query) ||
      cls.year.toLowerCase().includes(query);

    return matchesFilters && matchesSearch;
  });

  const filteredSessions: any[] = [];
  const query = searchQuery.toLowerCase();
  
  if (searchQuery) {
    Object.entries(MOCK_SCHEDULES).forEach(([classId, sessions]) => {
      const cls = MOCK_CLASSES.find(c => c.id === Number(classId));
      sessions.forEach(session => {
        if (
          session.teacher.toLowerCase().includes(query) ||
          session.subject.toLowerCase().includes(query) ||
          session.room.toLowerCase().includes(query)
        ) {
          filteredSessions.push({
            ...session,
            classId: Number(classId),
            className: cls ? `${cls.level} ${cls.mention}` : 'Inconnue'
          });
        }
      });
    });
  }

  const mentions = ['Informatique', 'Management', 'Information, Communication et Multimédia'];
  const parcours = ['DAII', 'AES', 'IC', 'MD'];
  const levels = ['L1', 'L2', 'L3', 'M1', 'M2'];

  return (
    <div className="pt-20 pb-12 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-5">
          <div className="space-y-1.5 flex-grow">
            <h1 className="text-2xl font-bold text-text-dark tracking-tight">Emplois du temps</h1>
            <p className="text-xs text-text-muted max-w-2xl leading-relaxed">
              Filtrez par mention ou parcours pour trouver votre classe.
            </p>
          </div>
          
          <div className="relative group w-full md:w-64">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${searchQuery ? 'text-primary' : 'text-text-muted'}`} size={14} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-full bg-white border border-border rounded-xl py-2 pl-9 pr-9 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm group-hover:border-primary/30"
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-text-muted hover:bg-slate-100 hover:text-primary transition-all"
                >
                  <X size={16} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 bg-bg-light border border-border rounded-2xl flex flex-col lg:flex-row items-end gap-4 shadow-sm">
          <SelectField 
            label="Mention" 
            options={mentions} 
            value={filters.mention}
            onChange={(val: string) => setFilters({...filters, mention: val})}
          />
          <SelectField 
            label="Parcours" 
            options={parcours} 
            value={filters.parcours}
            onChange={(val: string) => setFilters({...filters, parcours: val})}
          />
          <SelectField 
            label="Niveau" 
            options={levels} 
            value={filters.level}
            onChange={(val: string) => setFilters({...filters, level: val})}
          />
        </div>

        {/* Tabs for Results */}
        <div className="space-y-6">
          <div className="flex items-center gap-6 border-b border-border pb-1 overflow-x-auto whitespace-nowrap">
            <button 
              onClick={() => setActiveTab('classes')}
              className={`relative py-2.5 px-4 text-xs font-bold transition-all ${activeTab === 'classes' ? 'text-primary' : 'text-text-muted hover:text-text-dark'}`}
            >
              Classes trouvées ({filteredClasses.length})
              {activeTab === 'classes' && (
                <motion.div layoutId="active-tab-indicator" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
              )}
            </button>
            {searchQuery && (
              <button 
                onClick={() => setActiveTab('sessions')}
                className={`relative py-2.5 px-4 text-xs font-bold transition-all ${activeTab === 'sessions' ? 'text-primary' : 'text-text-muted hover:text-text-dark'}`}
              >
                Séances prof ({filteredSessions.length})
                {activeTab === 'sessions' && (
                  <motion.div layoutId="active-tab-indicator" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
                )}
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'classes' ? (
              <motion.div 
                key="classes-grid"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {filteredClasses.length > 0 ? (
                  filteredClasses.map((cls) => (
                    <motion.div
                      key={cls.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ClassCard 
                        {...cls}
                        selected={selectedClass === cls.id}
                        onClick={setSelectedClass}
                        onNavigate={handleNavigate}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto">
                      <GraduationCap size={32} />
                    </div>
                    <div>
                      <p className="text-text-dark font-bold">Aucune classe trouvée</p>
                      <p className="text-sm text-text-muted">Essayez de modifier vos filtres ou votre recherche.</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="sessions-grid"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredSessions.length > 0 ? (
                  filteredSessions.map((session, idx) => (
                    <SessionCard 
                      key={`${session.id}-${idx}`} 
                      session={session} 
                      days={days} 
                      times={times} 
                    />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto">
                      <User size={32} />
                    </div>
                    <div>
                      <p className="text-text-dark font-bold">Aucune séance trouvée</p>
                      <p className="text-sm text-text-muted">Aucun enseignant ou matière correspondant à "{searchQuery}".</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
