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
import { UserRole, Schedule, Class, Room, Teacher, Subject } from '../../data';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const TIME_SLOTS = [
  '07:00 - 08:00',
  '08:00 - 09:00',
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '12:00 - 13:00',
  '13:00 - 14:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
  '17:00 - 18:00',
];

const timeToMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

const checkConflict = (s1: Partial<Schedule>, s2: Schedule) => {
  if (!s1.startTime || !s1.endTime || s1.day === undefined) return false;
  if (s1.id === s2.id) return false;
  if (s1.day !== s2.day) return false;

  const start1 = timeToMinutes(s1.startTime);
  const end1 = timeToMinutes(s1.endTime);
  const start2 = timeToMinutes(s2.startTime);
  const end2 = timeToMinutes(s2.endTime);

  const overlap = start1 < end2 && end1 > start2;
  if (!overlap) return false;

  const sameRoom = s1.roomId === s2.roomId;
  const sameTeacher = s1.teacherId === s2.teacherId;

  return sameRoom || sameTeacher;
};

interface DraggableScheduleProps {
  schedule: Schedule;
  isMySlot: boolean;
  subjectName: string;
  teacherName: string;
  roomName: string;
  isAdmin: boolean;
  onClick?: () => void;
  onEdit?: (s: Schedule) => void;
}

const DraggableSchedule: React.FC<DraggableScheduleProps> = ({ schedule, isMySlot, subjectName, teacherName, roomName, isAdmin, onClick, onEdit }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: schedule.id,
    disabled: !isMySlot || schedule.status === 'pending',
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 100,
  } : undefined;

  const startIdx = TIME_SLOTS.findIndex(s => s.startsWith(schedule.startTime));
  const endIdx = TIME_SLOTS.findIndex(s => s.endsWith(schedule.endTime));
  const rowSpan = endIdx !== -1 && startIdx !== -1 ? endIdx - startIdx + 1 : 1;

  return (
      <motion.div 
      ref={setNodeRef}
      style={{
        ...style,
        gridRow: `span ${rowSpan}`,
      }}
      {...attributes}
      {...(isMySlot ? listeners : {})}
      onClick={() => {
        if (isMySlot && schedule.status === 'pending') onClick?.();
        if (isAdmin) onEdit?.(schedule);
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: isDragging ? 0.5 : 1, scale: 1 }}
      className={`h-full p-2 rounded-lg border flex flex-col justify-between transition-all cursor-default relative overflow-hidden group/card ${
        isDragging ? 'shadow-lg ring-2 ring-primary z-50' : ''
      } ${
        isMySlot || isAdmin
          ? schedule.status === 'pending'
            ? 'bg-orange-50 border-orange-200 hover:border-orange-300 cursor-pointer'
            : 'bg-primary/5 border-primary/20 ring-1 ring-primary/10 hover:ring-primary/30'
          : 'bg-bg-light border-border grayscale opacity-50 cursor-not-allowed'
      }`}
    >
      <div className={!(isMySlot || isAdmin) ? 'pointer-events-none' : ''}>
        <div className="flex items-start justify-between mb-0.5">
          <div className="flex items-center gap-1 overflow-hidden">
            {(isMySlot || isAdmin) && !isDragging && schedule.status !== 'pending' && (
              <GripVertical size={10} className="text-primary/30 cursor-grab active:cursor-grabbing shrink-0" />
            )}
            <h4 className={`text-[11px] font-bold leading-tight truncate ${!(isMySlot || isAdmin) ? 'text-text-muted' : 'text-text-dark'}`}>
              {subjectName}
            </h4>
          </div>
          {schedule.status === 'validated' ? (
            <CheckCircle2 size={10} className={`${!(isMySlot || isAdmin) ? 'text-text-muted' : 'text-blue-600'} shrink-0`} />
          ) : (
            <div className="flex items-center gap-1">
              <AlertCircle size={10} className="text-orange-500 shrink-0 animate-pulse" />
            </div>
          )}
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 text-[9px] font-medium text-text-muted truncate">
            <Users size={9} className={isMySlot || isAdmin ? 'text-accent' : 'text-text-muted'} />
            {teacherName}
          </div>
          <div className="flex items-center gap-1 text-[9px] font-medium text-text-muted truncate">
            <MapPin size={9} className={isMySlot || isAdmin ? 'text-accent' : 'text-text-muted'} />
            {roomName}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-1 pt-1 border-t border-black/5">
        <span className={`text-[7px] font-bold uppercase tracking-wider ${
          !(isMySlot || isAdmin) ? 'text-text-muted' : schedule.status === 'validated' ? 'text-blue-700' : 'text-orange-700'
        }`}>
          {schedule.status === 'pending' ? 'Attente' : schedule.startTime}
        </span>
        {isAdmin && (
          <MoreVertical size={9} className="text-text-muted group-hover/card:text-primary transition-colors" />
        )}
      </div>
    </motion.div>
  );
};

const OfficialView: React.FC<{ 
  selectedClass: Class; 
  schedules: Schedule[]; 
  rooms: Room[]; 
  teachers: Teacher[]; 
  subjects: Subject[] 
}> = ({ selectedClass, schedules, rooms, teachers, subjects }) => {
  return (
    <div className="bg-white p-12 shadow-2xl border border-border min-w-[1000px] font-serif print:p-0 print:shadow-none print:border-none">
      {/* Header */}
      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-sm font-bold uppercase">Mention : {selectedClass.mention}</p>
            <p className="text-sm font-bold uppercase">Parcours : TRONC COMMUN</p>
            <p className="text-sm font-bold uppercase">Niveau : {selectedClass.name}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold">ANNÉE UNIVERSITAIRE : 2025 - 2026</p>
            <div className="mt-4 bg-[#001D4A] text-white px-4 py-2 font-bold text-sm inline-block">
              EMIT - {selectedClass.name}
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center underline tracking-[0.2em] mt-8">EMPLOI DU TEMPS</h2>
      </div>

      {/* Table */}
      <div className="border-[1.5px] border-black overflow-hidden bg-white">
        <div className="grid grid-cols-[150px_repeat(6,1fr)] bg-slate-50 border-b border-black">
          <div className="p-3 border-r border-black font-bold text-center text-xs uppercase font-sans">Horaires</div>
          {DAYS.map(day => (
            <div key={day} className="p-3 border-r border-black last:border-none font-bold text-center text-xs uppercase font-sans">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-[150px_repeat(6,1fr)] div-body relative">
          {/* Background Grid Lines & Time Labels */}
          {TIME_SLOTS.map((slot, sIdx) => (
            <React.Fragment key={slot}>
              <div 
                className="p-2 border-r border-b border-black bg-slate-50 flex items-center justify-center font-mono font-bold text-[11px] text-center tracking-tight"
                style={{ gridRow: sIdx + 1, gridColumn: 1 }}
              >
                {slot}
              </div>
              {/* Empty background cells to maintain border consistency */}
              {DAYS.map((_, dIdx) => (
                <div 
                  key={`empty-${sIdx}-${dIdx}`} 
                  className="border-r border-b border-black last:border-r-0"
                  style={{ gridRow: sIdx + 1, gridColumn: dIdx + 2 }}
                />
              ))}
            </React.Fragment>
          ))}

          {/* Actual Schedules placed on top */}
          {schedules
            .filter(s => s.classId === selectedClass.id)
            .map((schedule) => {
              const startIdx = TIME_SLOTS.findIndex(s => s.startsWith(schedule.startTime));
              const endIdx = TIME_SLOTS.findIndex(s => s.endsWith(schedule.endTime));
              const rowSpan = endIdx !== -1 && startIdx !== -1 ? endIdx - startIdx + 1 : 1;

              const colorClasses = [
                'bg-pink-100', 'bg-blue-100', 'bg-emerald-100', 'bg-orange-100', 
                'bg-purple-100', 'bg-yellow-100', 'bg-cyan-100'
              ];
              const colorIdx = subjects.findIndex(s => s.id === schedule.subjectId) % colorClasses.length;

              return (
                <div 
                  key={schedule.id} 
                  className={`border-r border-b border-black last:border-r-0 p-3 flex flex-col items-center justify-center text-center space-y-1 z-10 ${colorClasses[colorIdx]}`}
                  style={{ 
                    gridRow: `${startIdx + 1} / span ${rowSpan}`, 
                    gridColumn: schedule.day + 2 
                  }}
                >
                  <p className="font-bold text-xs uppercase leading-tight">
                    {subjects.find(s => s.id === schedule.subjectId)?.name}
                  </p>
                  <p className="text-[10px] font-medium italic">
                    {teachers.find(t => t.id === schedule.teacherId)?.name}
                  </p>
                  <p className="text-[8px] font-bold opacity-60">
                    Salle {rooms.find(r => r.id === schedule.roomId)?.name}
                  </p>
                </div>
              );
            })}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 flex justify-end pr-20">
        <div className="text-center">
          <p className="text-sm font-bold text-text-dark underline decoration-dotted mb-2">Signature Direction</p>
          <p className="text-sm font-medium text-text-muted">{new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>
    </div>
  );
};

const DroppableCell: React.FC<{ day: number, timeIndex: number, isOccupied: boolean, children: React.ReactNode }> = ({ day, timeIndex, isOccupied, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `cell-${day}-${timeIndex}`,
    data: { day, timeIndex },
    disabled: isOccupied,
  });

  return (
    <div 
      ref={setNodeRef}
      className={`min-h-[100px] border-l border-border relative group transition-colors ${
        isOver ? 'bg-primary/5' : ''
      }`}
    >
      <div className="absolute inset-0 p-1.5 flex flex-col gap-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export const Schedules: React.FC = () => {
  const { user } = useAuth();
  const { 
    schedules, classes, teachers, rooms, subjects, 
    requestScheduleChange, cancelScheduleChange, addSchedule, updateSchedule, deleteSchedule, validateSchedule 
  } = useData();
  const isAdmin = user?.role === UserRole.ADMIN;
  
  // Find the mock teacher ID for the logged user
  const teacherId = user?.role === UserRole.TEACHER ? teachers.find(t => t.email === user.email)?.id : null;
  
  const teacherClasses = classes.filter(cls => 
    schedules.some(s => s.teacherId === teacherId && s.classId === cls.id)
  );

  const [selectedClassId, setSelectedClassId] = useState(isAdmin ? classes[0]?.id : (teacherClasses[0]?.id || classes[0]?.id));
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [pendingMove, setPendingMove] = useState<{ scheduleId: string, newDay: number, newTimeSlot: string } | null>(null);
  const [pendingCancel, setPendingCancel] = useState<string | null>(null);
  const [showOfficialView, setShowOfficialView] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newAssignment, setNewAssignment] = useState<Partial<Schedule>>({
    classId: selectedClassId,
    day: 0,
    startTime: '08:00',
    endTime: '10:00',
    status: 'validated'
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
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
      const newStartTime = TIME_SLOTS[timeIndex].split(' - ')[0];
      
      const schedule = schedules.find(s => s.id === scheduleId);
      if (!schedule) return;

      const duration = timeToMinutes(schedule.endTime) - timeToMinutes(schedule.startTime);
      const newStartMin = timeToMinutes(newStartTime);
      const newEndMin = newStartMin + duration;
      const newEndTime = `${Math.floor(newEndMin / 60).toString().padStart(2, '0')}:${(newEndMin % 60).toString().padStart(2, '0')}`;

      const conflict = schedules.find(s => 
        s.id !== scheduleId && 
        checkConflict({ ...schedule, day, startTime: newStartTime, endTime: newEndTime }, s)
      );

      if (!conflict) {
        if (isAdmin) {
          updateSchedule(scheduleId, { day, startTime: newStartTime, endTime: newEndTime });
        } else {
          setPendingMove({ scheduleId, newDay: day, newTimeSlot: newStartTime });
        }
      }
    }
  };

  const confirmMove = () => {
    if (pendingMove) {
      requestScheduleChange(pendingMove.scheduleId, pendingMove.newDay, pendingMove.newTimeSlot);
      setPendingMove(null);
    }
  };

  const selectedClass = classes.find(c => c.id === selectedClassId);
  const classSchedules = schedules.filter(s => s.classId === selectedClassId);
  const hasNoPending = classSchedules.every(s => s.status === 'validated');

  const saveAssignment = () => {
    if (!newAssignment.subjectId || !newAssignment.teacherId || !newAssignment.roomId) return;
    
    const conflict = schedules.find(s => checkConflict(newAssignment, s));
    if (conflict) {
      alert(`Conflit détecté avec le cours de ${subjects.find(sub => sub.id === conflict.subjectId)?.name} (${conflict.startTime} - ${conflict.endTime})`);
      return;
    }

    if (editingSchedule) {
      updateSchedule(editingSchedule.id, newAssignment);
    } else {
      addSchedule({
        ...newAssignment as Schedule,
        id: `sch-${Date.now()}`,
        classId: selectedClassId as string
      });
    }
    setShowAddModal(false);
    setEditingSchedule(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-dark mb-1">Emplois du temps</h1>
          <p className="text-xs text-text-muted">
            {isAdmin ? 'Gérez et validez les plannings des classes.' : 'Consultez votre planning et proposez des changements.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {hasNoPending && !showOfficialView && (
            <button 
              onClick={() => setShowOfficialView(true)}
              className="bg-[#001D4A] hover:bg-[#00215E] text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-[#001D4A]/10 flex items-center gap-2"
            >
              <CheckCircle2 size={16} />
              Vue officielle
            </button>
          )}
          {showOfficialView && (
            <button 
              onClick={() => setShowOfficialView(false)}
              className="bg-primary hover:bg-primary-hover text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-primary/10 flex items-center gap-2"
            >
              <CalendarIcon size={16} />
              Vue planning
            </button>
          )}
          <button 
            onClick={() => window.print()}
            className="bg-bg-light border border-border text-text-dark px-3 py-2 rounded-xl text-xs font-bold transition-all hover:bg-border/50 flex items-center gap-2"
          >
            <Download size={16} />
            PDF
          </button>
          {isAdmin && (
            <button 
              onClick={() => {
                setEditingSchedule(null);
                setNewAssignment({
                  classId: selectedClassId,
                  day: 0,
                  startTime: '08:00',
                  endTime: '10:00',
                  status: 'validated'
                });
                setShowAddModal(true);
              }}
              className="bg-[#001D4A] hover:bg-[#00215E] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-[#001D4A]/10 flex items-center gap-2"
            >
              <Plus size={18} />
              Nouvelle
            </button>
          )}
        </div>
      </div>

      {!showOfficialView ? (
        <>
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
            <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm overflow-x-auto">
              <div className="min-w-[900px]">
                {/* Grid Header */}
                <div className="grid grid-cols-[100px_repeat(6,1fr)] border-b border-border bg-bg-light">
                  <div className="p-3"></div>
                  {DAYS.map(day => (
                    <div key={day} className="p-2.5 text-center font-bold text-text-dark text-xs border-l border-border">{day}</div>
                  ))}
                </div>

                {/* Grid Body */}
                <div className="grid grid-cols-[100px_repeat(6,1fr)] bg-white relative">
                  {/* Time Labels Column */}
                  {TIME_SLOTS.map((slot, sIdx) => (
                    <div 
                      key={`time-${sIdx}`}
                      className="p-3 flex flex-col items-center justify-center border-b border-r border-border bg-bg-light/30 min-h-[80px]"
                      style={{ gridRow: sIdx + 1, gridColumn: 1 }}
                    >
                      <span className="text-[10px] font-bold text-text-dark text-center leading-none mb-1">{slot.split(' - ')[0]}</span>
                      <span className="text-[9px] font-medium text-text-muted text-center italic">{slot.split(' - ')[1]}</span>
                    </div>
                  ))}

                  {/* Empty Background Droppable Cells */}
                  {TIME_SLOTS.map((slot, sIdx) => 
                    DAYS.map((_, dIdx) => {
                      const schedule = schedules.find(s => 
                        s.classId === selectedClassId && 
                        s.day === dIdx && 
                        s.startTime <= slot.split(' - ')[0] &&
                        s.endTime > slot.split(' - ')[0]
                      );

                      return (
                        <div 
                          key={`bg-${sIdx}-${dIdx}`}
                          style={{ gridRow: sIdx + 1, gridColumn: dIdx + 2 }}
                          className="border-b border-l border-border relative group"
                        >
                          <DroppableCell 
                            day={dIdx} 
                            timeIndex={sIdx} 
                            isOccupied={!!schedule && schedule.id !== activeDragId}
                          >
                            {!schedule && isAdmin && (
                              <button 
                                onClick={() => {
                                  setNewAssignment({
                                    classId: selectedClassId,
                                    day: dIdx,
                                    startTime: slot.split(' - ')[0],
                                    endTime: slot.split(' - ')[1],
                                    status: 'validated'
                                  });
                                  setShowAddModal(true);
                                }}
                                className="absolute inset-2 border-2 border-dashed border-border rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:border-primary/30 hover:scale-[0.98]"
                              >
                                <Plus size={20} className="text-primary/40" />
                              </button>
                            )}
                          </DroppableCell>
                        </div>
                      );
                    })
                  )}

                  {/* Actual Schedule Items */}
                  {schedules
                    .filter(s => s.classId === selectedClassId)
                    .map((schedule) => {
                      const startIdx = TIME_SLOTS.findIndex(s => s.startsWith(schedule.startTime));
                      const endIdx = TIME_SLOTS.findIndex(s => s.endsWith(schedule.endTime));
                      const rowSpan = endIdx !== -1 && startIdx !== -1 ? endIdx - startIdx + 1 : 1;

                      if (startIdx === -1) return null;

                      return (
                        <div 
                          key={schedule.id}
                          className="p-1.5 z-10"
                          style={{ 
                            gridRow: `${startIdx + 1} / span ${rowSpan}`, 
                            gridColumn: schedule.day + 2 
                          }}
                        >
                          <DraggableSchedule 
                            schedule={schedule}
                            isMySlot={schedule.teacherId === teacherId}
                            isAdmin={isAdmin}
                            subjectName={subjects.find(s => s.id === schedule.subjectId)?.name || ''}
                            teacherName={teachers.find(t => t.id === schedule.teacherId)?.name || ''}
                            roomName={rooms.find(r => r.id === schedule.roomId)?.name || ''}
                            onClick={() => setPendingCancel(schedule.id)}
                            onEdit={(s) => {
                              setEditingSchedule(s);
                              setNewAssignment({ ...s });
                              setShowAddModal(true);
                            }}
                          />
                        </div>
                      );
                    })}
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
        </>
      ) : (
        selectedClass && (
          <OfficialView 
            selectedClass={selectedClass}
            schedules={schedules}
            rooms={rooms}
            teachers={teachers}
            subjects={subjects}
          />
        )
      )}

      {/* Assignment Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[32px] p-8 shadow-2xl relative w-full max-w-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-display font-bold text-text-dark">
                  {editingSchedule ? 'Modifier l\'affectation' : 'Nouvelle affectation'}
                </h3>
                <button onClick={() => setShowAddModal(false)} className="p-1.5 hover:bg-bg-light rounded-lg transition-colors">
                  <X size={20} className="text-text-muted" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-dark ml-1 uppercase tracking-wider">Matière</label>
                  <select 
                    value={newAssignment.subjectId}
                    onChange={(e) => setNewAssignment({ ...newAssignment, subjectId: e.target.value })}
                    className="w-full bg-bg-light border border-border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Sélectionner une matière</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-dark ml-1 uppercase tracking-wider">Enseignant</label>
                  <select 
                    value={newAssignment.teacherId}
                    onChange={(e) => setNewAssignment({ ...newAssignment, teacherId: e.target.value })}
                    className="w-full bg-bg-light border border-border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Sélectionner un enseignant</option>
                    {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-dark ml-1 uppercase tracking-wider">Salle</label>
                  <select 
                    value={newAssignment.roomId}
                    onChange={(e) => setNewAssignment({ ...newAssignment, roomId: e.target.value })}
                    className="w-full bg-bg-light border border-border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Sélectionner une salle</option>
                    {rooms.map(r => <option key={r.id} value={r.id}>{r.name} ({r.type})</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-dark ml-1 uppercase tracking-wider">Jour</label>
                  <select 
                    value={newAssignment.day}
                    onChange={(e) => setNewAssignment({ ...newAssignment, day: parseInt(e.target.value) })}
                    className="w-full bg-bg-light border border-border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {DAYS.map((day, idx) => <option key={day} value={idx}>{day}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-dark ml-1 uppercase tracking-wider">Début</label>
                  <input 
                    type="time" 
                    step="900"
                    value={newAssignment.startTime}
                    onChange={(e) => setNewAssignment({ ...newAssignment, startTime: e.target.value })}
                    className="w-full bg-bg-light border border-border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-dark ml-1 uppercase tracking-wider">Fin</label>
                  <input 
                    type="time" 
                    step="900"
                    value={newAssignment.endTime}
                    onChange={(e) => setNewAssignment({ ...newAssignment, endTime: e.target.value })}
                    className="w-full bg-bg-light border border-border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                {editingSchedule && (
                  <button 
                    onClick={() => {
                      if (confirm('Supprimer ce cours ?')) {
                        deleteSchedule(editingSchedule.id);
                        setShowAddModal(false);
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl border border-error/20 text-error text-xs font-bold hover:bg-error/5 transition-all flex items-center justify-center gap-2"
                  >
                    Supprimer
                  </button>
                )}
                {editingSchedule && editingSchedule.status === 'pending' && (
                  <button 
                    onClick={() => {
                      validateSchedule(editingSchedule.id);
                      setShowAddModal(false);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#001D4A] text-white text-xs font-bold hover:bg-[#00215E] transition-all flex items-center justify-center gap-2"
                  >
                     Valider
                  </button>
                )}
                <div className="flex-grow" />
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-border text-text-dark text-xs font-bold hover:bg-bg-light transition-all"
                >
                  Annuler
                </button>
                <button 
                  onClick={saveAssignment}
                  className="px-6 py-2.5 rounded-xl bg-[#001D4A] text-white text-xs font-bold hover:bg-[#00215E] shadow-lg shadow-[#001D4A]/10 transition-all flex items-center justify-center gap-2"
                >
                  <Check size={16} />
                  Enregistrer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
