import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Filter,
  Download,
  Calendar as CalendarIcon,
  MoreVertical,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  AlertCircle,
  GripVertical,
  Check,
  X
} from 'lucide-react';
import { 
  DndContext, 
  DragOverlay, 
  useDraggable, 
  useDroppable,
  DragStartEvent,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { useAuth } from '../../lib/AuthContext';
import { useData } from '../../lib/DataContext';
import { UserRole, Schedule } from '../../data';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const TIME_SLOTS = [
  '08:00 - 10:00',
  '10:15 - 12:15',
  '13:30 - 15:30',
  '15:45 - 17:45'
];

interface DraggableScheduleProps {
  schedule: Schedule;
  isMySlot: boolean;
  subjectName: string;
  teacherName: string;
  roomName: string;
  onClick?: () => void;
}

const DraggableSchedule: React.FC<DraggableScheduleProps> = ({ schedule, isMySlot, subjectName, teacherName, roomName, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: schedule.id,
    disabled: !isMySlot || schedule.status === 'pending',
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 100,
  } : undefined;

  return (
    <motion.div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(isMySlot ? listeners : {})}
      onClick={isMySlot && schedule.status === 'pending' ? onClick : undefined}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: isDragging ? 0.5 : 1, scale: 1 }}
      className={`h-full p-4 rounded-2xl border flex flex-col justify-between transition-all cursor-default ${
        isDragging ? 'shadow-2xl ring-2 ring-primary' : ''
      } ${
        isMySlot 
          ? schedule.status === 'pending'
            ? 'bg-orange-50 border-orange-200 hover:border-orange-300 cursor-pointer group/card'
            : 'bg-primary/5 border-primary/20 ring-2 ring-primary/20'
          : 'bg-bg-light border-border grayscale opacity-50 cursor-not-allowed'
      }`}
    >
      <div className={!isMySlot ? 'pointer-events-none' : ''}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {isMySlot && !isDragging && schedule.status !== 'pending' && (
              <GripVertical size={14} className="text-primary/40 cursor-grab active:cursor-grabbing" />
            )}
            <h4 className={`text-sm font-bold leading-tight ${!isMySlot ? 'text-text-muted' : 'text-text-dark'}`}>
              {subjectName}
            </h4>
          </div>
          {schedule.status === 'validated' ? (
            <CheckCircle2 size={14} className={`${!isMySlot ? 'text-text-muted' : 'text-emerald-600'} shrink-0`} />
          ) : (
            <div className="flex flex-col items-end">
              <AlertCircle size={14} className="text-orange-500 shrink-0 animate-pulse" />
              {isMySlot && (
                <span className="text-[8px] font-bold text-orange-400 opacity-0 group-hover/card:opacity-100 transition-opacity whitespace-nowrap">Cliquer pour annuler</span>
              )}
            </div>
          )}
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-text-muted">
            <Users size={12} className={isMySlot ? 'text-accent' : 'text-text-muted'} />
            {teacherName}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-text-muted">
            <MapPin size={12} className={isMySlot ? 'text-accent' : 'text-text-muted'} />
            {roomName}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-black/5">
        <span className={`text-[9px] font-bold uppercase tracking-wider ${
          !isMySlot ? 'text-text-muted' : schedule.status === 'validated' ? 'text-emerald-700' : 'text-orange-700'
        }`}>
          {schedule.status === 'pending' ? 'En attente' : schedule.status}
        </span>
        {isMySlot && schedule.status === 'pending' && (
          <Clock size={12} className="text-orange-500" />
        )}
      </div>
    </motion.div>
  );
};

interface DroppableCellProps {
  day: number;
  timeIndex: number;
  isOccupied: boolean;
  children?: React.ReactNode;
}

const DroppableCell: React.FC<DroppableCellProps> = ({ day, timeIndex, isOccupied, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `cell-${day}-${timeIndex}`,
    data: { day, timeIndex },
    disabled: isOccupied
  });

  return (
    <div 
      ref={setNodeRef}
      className={`p-2 border-l border-border group relative transition-colors ${
        isOver 
          ? isOccupied 
            ? 'bg-red-50/50 ring-2 ring-inset ring-red-200 cursor-no-drop' 
            : 'bg-primary/5 ring-2 ring-inset ring-primary/20' 
          : 'hover:bg-bg-light/20'
      }`}
    >
      {children}
    </div>
  );
};

export const Schedules: React.FC = () => {
  const { user } = useAuth();
  const { schedules, classes, teachers, rooms, subjects, requestScheduleChange, cancelScheduleChange } = useData();
  const isAdmin = user?.role === UserRole.ADMIN;
  
  // Find the mock teacher ID for the logged user
  const teacherId = user?.role === UserRole.TEACHER ? teachers.find(t => t.email === user.email)?.id : null;
  
  // Filter classes where the teacher is assigned
  const teacherClasses = classes.filter(cls => 
    schedules.some(s => s.teacherId === teacherId && s.classId === cls.id)
  );

  const initialClassId = isAdmin ? classes[0]?.id : (teacherClasses[0]?.id || classes[0]?.id);
  const [selectedClassId, setSelectedClassId] = useState(initialClassId);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [pendingMove, setPendingMove] = useState<{ scheduleId: string, newDay: number, newTimeSlot: string } | null>(null);
  const [pendingCancel, setPendingCancel] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragId(null);
    const { active, over } = event;
    
    if (over && over.id.toString().startsWith('cell-')) {
      const scheduleId = active.id as string;
      const { day, timeIndex } = over.data.current as { day: number, timeIndex: number };
      const newTimeSlot = TIME_SLOTS[timeIndex].split(' - ')[0];

      // Check if slot is already occupied
      const existing = schedules.find(s => 
        s.classId === selectedClassId && 
        s.day === day && 
        s.startTime === newTimeSlot
      );

      if (!existing || existing.id === scheduleId) {
        setPendingMove({ scheduleId, newDay: day, newTimeSlot });
      }
    }
  };

  const confirmMove = () => {
    if (pendingMove) {
      const { scheduleId, newDay, newTimeSlot } = pendingMove;
      const endTime = TIME_SLOTS.find(ts => ts.startsWith(newTimeSlot))?.split(' - ')[1] || '';
      requestScheduleChange(scheduleId, newDay, newTimeSlot, endTime);
      setPendingMove(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-dark mb-2">Emplois du temps</h1>
          <p className="text-text-muted">
            {isAdmin ? 'Gérez et validez les plannings des classes.' : 'Consultez votre planning et proposez des changements.'}
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-bg-light border border-border text-text-dark px-4 py-3 rounded-2xl font-bold transition-all hover:bg-border/50 flex items-center gap-2">
            <Download size={18} />
            Exporter PDF
          </button>
          {isAdmin && (
            <button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
              <Plus size={20} />
              Nouvelle affectation
            </button>
          )}
        </div>
      </div>

      {/* Class Selector & Filters */}
      <div className="bg-white p-4 rounded-3xl border border-border shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 bg-bg-light p-2 rounded-2xl border border-border">
          {(isAdmin ? classes : teacherClasses).map(cls => (
            <button
              key={cls.id}
              onClick={() => setSelectedClassId(cls.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedClassId === cls.id 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-text-muted hover:text-text-dark'
              }`}
            >
              {cls.name} {cls.mention}
            </button>
          ))}
        </div>
        {teacherClasses.length === 0 && !isAdmin && (
          <p className="text-xs text-orange-500 font-medium">Vous n'êtes affecté à aucune classe.</p>
        )}
        <div className="h-8 w-[1px] bg-border hidden md:block" />
        <button className="flex items-center gap-2 px-4 py-2 bg-bg-light border border-border rounded-xl text-xs font-bold text-text-dark hover:bg-border/50 transition-colors">
          <Filter size={16} className="text-text-muted" />
          Filtres avancés
        </button>
      </div>

      {/* Schedule Grid */}
      <DndContext 
        sensors={sensors} 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm overflow-x-auto">
          <div className="min-w-[1000px]">
            {/* Grid Header */}
            <div className="grid grid-cols-[140px_repeat(6,1fr)] border-b border-border bg-bg-light">
              <div className="p-4"></div>
              {DAYS.map(day => (
                <div key={day} className="p-4 text-center font-bold text-text-dark text-sm border-l border-border">{day}</div>
              ))}
            </div>

            {/* Grid Body */}
            <div className="divide-y divide-border">
              {TIME_SLOTS.map((slot, sIdx) => (
                <div key={slot} className="grid grid-cols-[140px_repeat(6,1fr)] min-h-[140px]">
                  <div className="p-6 flex flex-col items-center justify-center border-r border-border bg-bg-light/30">
                    <Clock size={16} className="text-primary mb-2" />
                    <span className="text-sm font-bold text-text-dark text-center">{slot.split(' - ')[0]}</span>
                    <span className="text-xs font-medium text-text-muted text-center">{slot.split(' - ')[1]}</span>
                  </div>
                  {DAYS.map((_, dIdx) => {
                    const schedule = schedules.find(s => 
                      s.classId === selectedClassId && 
                      s.day === dIdx && 
                      s.startTime === slot.split(' - ')[0]
                    );

                    return (
                      <DroppableCell 
                        key={dIdx} 
                        day={dIdx} 
                        timeIndex={sIdx} 
                        isOccupied={!!schedule && schedule.id !== activeDragId}
                      >
                        {schedule ? (
                          <DraggableSchedule 
                            schedule={schedule}
                            isMySlot={schedule.teacherId === teacherId}
                            subjectName={subjects.find(s => s.id === schedule.subjectId)?.name || ''}
                            teacherName={teachers.find(t => t.id === schedule.teacherId)?.name || ''}
                            roomName={rooms.find(r => r.id === schedule.roomId)?.name || ''}
                            onClick={() => setPendingCancel(schedule.id)}
                          />
                        ) : isAdmin && (
                          <button className="absolute inset-2 border-2 border-dashed border-border rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:border-primary/30 hover:scale-[0.98]">
                            <Plus size={20} className="text-primary/40" />
                          </button>
                        )}
                      </DroppableCell>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeDragId ? (
            <div className="w-[180px] opacity-80 cursor-grabbing">
              {(() => {
                const schedule = schedules.find(s => s.id === activeDragId);
                if (!schedule) return null;
                return (
                  <div className="h-full p-4 rounded-2xl border bg-primary/10 border-primary/40 shadow-2xl ring-2 ring-primary">
                    <h4 className="text-sm font-bold text-text-dark mb-2">
                       {subjects.find(s => s.id === schedule.subjectId)?.name}
                    </h4>
                    <p className="text-[10px] text-text-muted">Glisser pour déplacer</p>
                  </div>
                );
              })()}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Confirmation Dialog Move */}
      <AnimatePresence>
        {pendingMove && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPendingMove(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[32px] p-8 shadow-2xl relative w-full max-w-md"
            >
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CalendarIcon size={32} />
              </div>
              <h3 className="text-2xl font-display font-bold text-text-dark text-center mb-2">Proposer un changement ?</h3>
              <p className="text-text-muted text-center mb-8">
                Vous allez proposer de déplacer ce cours au <span className="font-bold text-text-dark">{DAYS[pendingMove.newDay]}</span> à <span className="font-bold text-text-dark">{pendingMove.newTimeSlot}</span>. L'administrateur recevra une demande de validation.
              </p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setPendingMove(null)}
                  className="flex-1 px-6 py-4 rounded-2xl border border-border text-text-dark font-bold hover:bg-bg-light transition-all flex items-center justify-center gap-2"
                >
                  <X size={20} />
                  Annuler
                </button>
                <button 
                  onClick={confirmMove}
                  className="flex-1 px-6 py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  Confirmer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog Cancel */}
      <AnimatePresence>
        {pendingCancel && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPendingCancel(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[32px] p-8 shadow-2xl relative w-full max-w-md"
            >
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <X size={32} />
              </div>
              <h3 className="text-2xl font-display font-bold text-text-dark text-center mb-2">Annuler la demande ?</h3>
              <p className="text-text-muted text-center mb-8">
                Voulez-vous annuler votre demande de changement ? Le créneau reviendra à son emplacement d'origine.
              </p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setPendingCancel(null)}
                  className="flex-1 px-6 py-4 rounded-2xl border border-border text-text-dark font-bold hover:bg-bg-light transition-all flex items-center justify-center gap-2"
                >
                  Non, garder
                </button>
                <button 
                  onClick={() => {
                    cancelScheduleChange(pendingCancel);
                    setPendingCancel(null);
                  }}
                  className="flex-1 px-6 py-4 rounded-2xl bg-orange-500 text-white font-bold hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  Oui, annuler
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
