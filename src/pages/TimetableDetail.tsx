import React, { useRef } from 'react';
import { motion } from 'motion/react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { 
  ArrowLeft, 
  Download, 
  Clock, 
  MapPin, 
  User,
  Calendar as CalendarIcon,
  Loader2
} from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import { MOCK_CLASSES } from './Timetable';

const CourseBlock = React.memo(({ subject, teacher, room, color }: any) => {
  const getBgColor = (c: string) => {
    switch(c) {
      case 'blue': return 'bg-[#eff6ff] border-[#bfdbfe] text-[#1d4ed8]';
      case 'purple': return 'bg-[#faf5ff] border-[#e9d5ff] text-[#7e22ce]';
      case 'orange': return 'bg-[#fff7ed] border-[#fed7aa] text-[#c2410c]';
      case 'indigo': return 'bg-[#eef2ff] border-[#c7d2fe] text-[#4338ca]';
      case 'rose': return 'bg-[#fff1f2] border-[#fecdd3] text-[#be123c]';
      default: return 'bg-[#f8fafc] border-[#e2e8f0] text-[#334155]';
    }
  };

  return (
    <div className={`p-4 border-l-4 rounded-r-xl h-full flex flex-col justify-between ${getBgColor(color)}`}>
      <div className="space-y-1">
        <h5 className="font-bold text-sm leading-tight">{subject}</h5>
        <div className="flex items-center gap-1.5 text-[11px] opacity-80">
          <User size={12} />
          {teacher}
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-[11px] opacity-90 font-medium">
        <MapPin size={12} />
        {room}
      </div>
    </div>
  );
});

const TimeSlot = React.memo(({ time }: any) => (
  <div className="h-40 border-b border-[#E5E7EB] flex items-center justify-center bg-[#F8FAFC]/50">
    <div className="flex flex-col items-center gap-1 text-[#6B7280]">
      <Clock size={16} />
      <span className="text-xs font-bold">{time}</span>
    </div>
  </div>
));

// MOCK DATA - Prêt pour le backend
export const MOCK_SCHEDULES: Record<number, any[]> = {
  // L1 Informatique DAII
  1: [
    { id: 101, dayIdx: 0, slotIdx: 0, subject: "Intro Informatique", teacher: "Rabe T.", room: "Amphi A", color: "blue" },
    { id: 102, dayIdx: 1, slotIdx: 2, subject: "Algorithmique I", teacher: "Rakotomalala R.", room: "Salle 1", color: "blue" },
    { id: 103, dayIdx: 2, slotIdx: 1, subject: "Anglais Professionnel", teacher: "Smith J.", room: "Labo 1", color: "orange" },
    { id: 104, dayIdx: 4, slotIdx: 0, subject: "Mathématiques", teacher: "Laza M.", room: "Amphi B", color: "rose" },
  ],
  // L2 Informatique DAII
  2: [
    { id: 201, dayIdx: 0, slotIdx: 0, subject: "Algorithmique II", teacher: "Rakotomalala R.", room: "Salle 203", color: "blue" },
    { id: 202, dayIdx: 0, slotIdx: 2, subject: "Programmation C++", teacher: "Randrianarivo D.", room: "Info 102", color: "purple" },
    { id: 203, dayIdx: 1, slotIdx: 0, subject: "Base de données", teacher: "Ranivo M.", room: "Salle 101", color: "rose" },
    { id: 204, dayIdx: 2, slotIdx: 0, subject: "Système d'Exploitation", teacher: "Rakotonavalona", room: "Salle 201", color: "purple" },
    { id: 205, dayIdx: 2, slotIdx: 3, subject: "Réseaux I", teacher: "Andriamihaja H.", room: "Salle 102", color: "indigo" },
  ],
  // L3 Informatique DAII
  3: [
    { id: 301, dayIdx: 0, slotIdx: 1, subject: "Génie Logiciel", teacher: "Andry L.", room: "Info 202", color: "blue" },
    { id: 302, dayIdx: 1, slotIdx: 2, subject: "Web Avancé", teacher: "Faly T.", room: "Labo 3", color: "blue" },
    { id: 303, dayIdx: 3, slotIdx: 3, subject: "Sécurité Info", teacher: "Jean P.", room: "Salle 5", color: "indigo" },
    { id: 304, dayIdx: 4, slotIdx: 0, subject: "Projet Fin d'Étude", teacher: "Equipe DAII", room: "Foyer", color: "purple" },
  ],
  // L1 Management AES
  4: [
    { id: 401, dayIdx: 0, slotIdx: 0, subject: "Comptabilité", teacher: "Volona S.", room: "Salle 301", color: "rose" },
    { id: 402, dayIdx: 1, slotIdx: 2, subject: "Économie", teacher: "Ando R.", room: "Amphi C", color: "rose" },
    { id: 403, dayIdx: 2, slotIdx: 1, subject: "Anglais", teacher: "Perline R.", room: "Salle 302", color: "orange" },
  ],
  // L2 Management AES
  5: [
    { id: 501, dayIdx: 1, slotIdx: 1, subject: "Gestion RH", teacher: "Tina K.", room: "Salle 305", color: "purple" },
    { id: 502, dayIdx: 3, slotIdx: 2, subject: "Marketing", teacher: "Liva H.", room: "Salle 301", color: "blue" },
    { id: 503, dayIdx: 4, slotIdx: 0, subject: "Droit", teacher: "Rakotomalala", room: "Amphi A", color: "rose" },
  ],
  // L3 Management AES
  6: [
    { id: 601, dayIdx: 0, slotIdx: 2, subject: "Management Strat.", teacher: "Mamy R.", room: "Salle 401", color: "orange" },
    { id: 602, dayIdx: 2, slotIdx: 0, subject: "Contrôle de gestion", teacher: "Sitraka N.", room: "Salle 402", color: "rose" },
  ],
  // L1 IC
  7: [
    { id: 701, dayIdx: 0, slotIdx: 1, subject: "Théorie Comm.", teacher: "Bodo A.", room: "Labo 5", color: "blue" },
    { id: 702, dayIdx: 1, slotIdx: 0, subject: "Infographie", teacher: "Faly J.", room: "Info 3", color: "purple" },
  ],
  // L2 IC
  8: [
    { id: 801, dayIdx: 1, slotIdx: 0, subject: "Journalisme", teacher: "Alain G.", room: "Salle 11", color: "indigo" },
    { id: 802, dayIdx: 3, slotIdx: 1, subject: "Audiovisuel", teacher: "Nivo M.", room: "Studio", color: "rose" },
  ],
  // L3 IC
  9: [
    { id: 901, dayIdx: 0, slotIdx: 0, subject: "Manager Médias", teacher: "Tahina V.", room: "Salle 12", color: "blue" },
    { id: 902, dayIdx: 2, slotIdx: 2, subject: "Publicité", teacher: "Rindra K.", room: "Amphi B", color: "purple" },
  ],
  // M1 Management MD
  10: [
    { id: 1001, dayIdx: 0, slotIdx: 1, subject: "Decision Making", teacher: "Dr Malala", room: "Master B", color: "blue" },
    { id: 1002, dayIdx: 2, slotIdx: 0, subject: "Stratégie Avancée", teacher: "Prof Hery", room: "Master A", color: "rose" },
  ],
  // M2 Management MD
  11: [
    { id: 1101, dayIdx: 1, slotIdx: 1, subject: "Innovation", teacher: "Dr Laza", room: "Amphi Master", color: "purple" },
    { id: 1102, dayIdx: 4, slotIdx: 2, subject: "Thèse Professionnelle", teacher: "Directeur EMIT", room: "Bureau", color: "indigo" },
  ],
};

export const TimetableDetail = () => {
  const [searchParams] = useSearchParams();
  const timetableRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const classId = Number(searchParams.get('id')) || 1;

  const downloadPDF = async () => {
    if (!timetableRef.current) return;
    setIsDownloading(true);
    
    try {
      if (timetableRef.current) {
        timetableRef.current.classList.add('exporting');
      }
      // Small delay to ensure any animations are finished
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const canvas = await html2canvas(timetableRef.current, {
        scale: 2, // Better quality
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        onclone: (doc) => {
          // Fix for html2canvas oklab/oklch parsing issues in Tailwind 4
          const style = doc.createElement('style');
          style.innerHTML = `
            :root {
              --color-primary: #0073e6 !important;
              --color-secondary: #162449 !important;
              --color-blue-50: #eff6ff !important;
              --color-blue-100: #dbeafe !important;
              --color-blue-200: #bfdbfe !important;
              --color-blue-500: #3b82f6 !important;
              --color-blue-600: #2563eb !important;
              --color-blue-700: #1d4ed8 !important;
              --color-rose-50: #fff1f2 !important;
              --color-rose-100: #ffe4e6 !important;
              --color-rose-200: #fecdd3 !important;
              --color-rose-500: #f43f5e !important;
              --color-rose-600: #e11d48 !important;
              --color-rose-700: #be123c !important;
              --color-orange-50: #fff7ed !important;
              --color-orange-100: #ffedd5 !important;
              --color-orange-200: #fed7aa !important;
              --color-orange-500: #f97316 !important;
              --color-orange-600: #ea580c !important;
              --color-orange-700: #c2410c !important;
              --color-indigo-50: #eef2ff !important;
              --color-indigo-100: #e0e7ff !important;
              --color-indigo-200: #c7d2fe !important;
              --color-indigo-500: #6366f1 !important;
              --color-indigo-600: #4f46e5 !important;
              --color-indigo-700: #4338ca !important;
              --color-purple-50: #faf5ff !important;
              --color-purple-100: #f3e8ff !important;
              --color-purple-200: #e9d5ff !important;
              --color-purple-500: #a855f7 !important;
              --color-purple-600: #9333ea !important;
              --color-purple-700: #7e22ce !important;
              --color-slate-50: #f8fafc !important;
              --color-slate-100: #f1f5f9 !important;
              --color-slate-200: #e2e8f0 !important;
              --color-slate-500: #64748b !important;
              --color-slate-700: #334155 !important;
              --color-border: #E5E7EB !important;
              --color-bg-light: #F8FAFC !important;
              --color-text-dark: #111827 !important;
              --color-text-muted: #6B7280 !important;
            }
            * { 
              color-scheme: light !important;
              transition: none !important;
              animation: none !important;
              backdrop-filter: none !important;
              box-shadow: none !important;
            }
            /* Explicitly override common Tailwind 4 oklch utilities if they leaked */
            .bg-blue-50 { background-color: #eff6ff !important; }
            .bg-blue-100 { background-color: #dbeafe !important; }
            .bg-blue-200 { background-color: #bfdbfe !important; }
            .text-blue-700 { color: #1d4ed8 !important; }
            .border-blue-200 { border-color: #bfdbfe !important; }
            .border-blue-500 { border-color: #3b82f6 !important; }

            .bg-purple-50 { background-color: #faf5ff !important; }
            .bg-purple-100 { background-color: #f3e8ff !important; }
            .bg-purple-200 { background-color: #e9d5ff !important; }
            .text-purple-700 { color: #7e22ce !important; }
            .border-purple-200 { border-color: #e9d5ff !important; }
            .border-purple-500 { border-color: #a855f7 !important; }

            .bg-orange-50 { background-color: #fff7ed !important; }
            .bg-orange-100 { background-color: #ffedd5 !important; }
            .bg-orange-200 { background-color: #fed7aa !important; }
            .text-orange-700 { color: #c2410c !important; }
            .border-orange-200 { border-color: #fed7aa !important; }
            .border-orange-500 { border-color: #f97316 !important; }

            .bg-indigo-50 { background-color: #eef2ff !important; }
            .bg-indigo-100 { background-color: #e0e7ff !important; }
            .bg-indigo-200 { background-color: #c7d2fe !important; }
            .text-indigo-700 { color: #4338ca !important; }
            .border-indigo-200 { border-color: #c7d2fe !important; }
            .border-indigo-500 { border-color: #6366f1 !important; }

            .bg-rose-50 { background-color: #fff1f2 !important; }
            .bg-rose-100 { background-color: #ffe4e6 !important; }
            .bg-rose-200 { background-color: #fecdd3 !important; }
            .text-rose-700 { color: #be123c !important; }
            .border-rose-200 { border-color: #fecdd3 !important; }
            .border-rose-500 { border-color: #f43f5e !important; }

            .bg-slate-50 { background-color: #f8fafc !important; }
            .border-slate-200 { border-color: #e2e8f0 !important; }
            .text-slate-700 { color: #334155 !important; }
            
            .text-primary { color: #0073e6 !important; }
            .bg-primary { background-color: #0073e6 !important; }
            .border-primary { border-color: #0073e6 !important; }
          `;
          doc.head.appendChild(style);
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      if (timetableRef.current) {
        timetableRef.current.classList.remove('exporting');
      }
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Emploi_du_temps_${classInfo.level}_${classInfo.mention}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const days = React.useMemo(() => ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'], []);
  const times = React.useMemo(() => ['08:00 - 10:00', '10:15 - 12:15', '13:30 - 15:30', '15:45 - 17:45'], []);

  const classInfo = React.useMemo(() => 
    MOCK_CLASSES.find(c => c.id === classId) || MOCK_CLASSES[0], 
    [classId]
  );
  
  const schedule = React.useMemo(() => 
    MOCK_SCHEDULES[classId] || [], 
    [classId]
  );

  const getCourseAt = React.useCallback((dIdx: number, tIdx: number) => {
    return schedule.find(c => c.dayIdx === dIdx && c.slotIdx === tIdx);
  }, [schedule]);

  return (
    <div className="pt-20 pb-12 px-6 lg:px-12 space-y-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="space-y-1.5">
            <Link to="/timetable" className="inline-flex items-center gap-2 text-[10px] font-bold text-primary hover:gap-3 transition-all mb-0.5">
              <ArrowLeft size={12} />
              Retour
            </Link>
            <h1 className="text-xl font-bold text-text-dark tracking-tight">{classInfo.level} - {classInfo.mention}</h1>
            <div className="flex items-center gap-3 text-text-muted">
              <div className="flex items-center gap-1.5 text-[10px]">
                <CalendarIcon size={12} />
                {classInfo.parcours}
              </div>
              <div className="w-1 h-1 bg-border rounded-full"></div>
              <div className="text-[10px] font-medium">{classInfo.year}</div>
            </div>
          </div>
          
          <button 
            onClick={downloadPDF}
            disabled={isDownloading}
            className="group relative bg-primary text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/10 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
          >
            {isDownloading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <Download size={16} className="group-hover:-translate-y-0.5 transition-transform" />
                Télécharger PDF
              </>
            )}
            {isDownloading && (
              <motion.div 
                className="absolute bottom-0 left-0 h-1 bg-white/30"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: "linear" }}
              />
            )}
          </button>
        </div>

        <div 
          ref={timetableRef}
          className="bg-[#ffffff] border border-[#E5E7EB] rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 overflow-x-auto p-4 no-scrollbar"
        >
          <div className="min-w-[1000px] bg-[#ffffff] text-[#111827]">
            {/* Header for PDF */}
            <div className="hidden show-on-export mb-8 p-4 border-b-2 border-primary flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold text-[#111827]">{classInfo.level} {classInfo.mention}</h2>
                <p className="text-sm text-[#6B7280]">{classInfo.parcours} — {classInfo.year}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-primary uppercase tracking-widest leading-none">EMIT</p>
                <p className="text-[10px] text-[#6B7280] mt-1">Généré le {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div className="timetable-grid border-b border-[#E5E7EB] bg-[#F8FAFC]/50">
              <div className="p-5"></div>
              {days.map(day => (
                <div key={day} className="p-5 text-center text-xs font-bold text-[#6B7280] uppercase tracking-widest border-l border-[#E5E7EB]">
                  {day}
                </div>
              ))}
            </div>

            <div className="timetable-grid">
              <div className="flex flex-col">
                {times.map(t => <TimeSlot key={t} time={t} />)}
              </div>

              {days.map((day, dIdx) => (
                <div key={day} className="flex flex-col border-l border-[#E5E7EB]">
                  {times.map((time, tIdx) => {
                    const course = getCourseAt(dIdx, tIdx);
                    return (
                      <div key={time} className="h-40 border-b border-[#E5E7EB] p-2">
                        {course && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="h-full"
                          >
                            <CourseBlock 
                              subject={course.subject}
                              teacher={course.teacher}
                              room={course.room}
                              color={course.color}
                            />
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Legend for PDF */}
            <div className="hidden show-on-export mt-8 p-6 bg-[#F8FAFC]/30 border border-[#E5E7EB]/50 rounded-2xl flex flex-wrap gap-8 justify-center">
              {[
                { label: 'Informatique', color: 'bg-[#bfdbfe]' },
                { label: 'Gestion', color: 'bg-[#fecdd3]' },
                { label: 'Anglais', color: 'bg-[#fed7aa]' },
                { label: 'Réseaux', color: 'bg-[#c7d2fe]' },
                { label: 'Projets', color: 'bg-[#e9d5ff]' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-bg-light border border-border rounded-xl flex flex-wrap gap-8 justify-center">
          {[
            { label: 'Informatique', color: 'bg-[#bfdbfe]' },
            { label: 'Gestion', color: 'bg-[#fecdd3]' },
            { label: 'Anglais', color: 'bg-[#fed7aa]' },
            { label: 'Réseaux', color: 'bg-[#c7d2fe]' },
            { label: 'Projets', color: 'bg-[#e9d5ff]' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${item.color}`}></div>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
