import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Schedule, 
  Room, 
  Teacher, 
  Class, 
  Subject,
  AppNotification,
  UserRole,
  MOCK_SCHEDULES,
  MOCK_ROOMS,
  MOCK_TEACHERS,
  MOCK_CLASSES,
  MOCK_SUBJECTS
} from '../data';

interface DataContextType {
  schedules: Schedule[];
  rooms: Room[];
  teachers: Teacher[];
  classes: Class[];
  subjects: Subject[];
  notifications: AppNotification[];
  addRoom: (room: Room) => void;
  updateRoom: (id: string, updates: Partial<Room>) => void;
  deleteRoom: (id: string) => void;
  addClass: (cls: Class) => void;
  updateClass: (id: string, updates: Partial<Class>) => void;
  deleteClass: (id: string) => void;
  addTeacher: (teacher: Teacher) => void;
  updateTeacher: (id: string, updates: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  addSubject: (subject: Subject) => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  updateSchedule: (id: string, updates: Partial<Schedule>) => void;
  deleteSchedule: (id: string) => void;
  addSchedule: (schedule: Schedule) => void;
  requestScheduleChange: (scheduleId: string, newDay: number, newStartTime: string, newEndTime: string) => void;
  cancelScheduleChange: (scheduleId: string) => void;
  validateSchedule: (scheduleId: string) => void;
  clearNotification: (id: string) => void;
  clearNotifications: (ids: string[]) => void;
  markAllAsRead: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [schedules, setSchedules] = useState<Schedule[]>(() => {
    const saved = localStorage.getItem('schedules');
    return saved ? JSON.parse(saved) : MOCK_SCHEDULES;
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('rooms');
    return saved ? JSON.parse(saved) : MOCK_ROOMS;
  });
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('teachers');
    return saved ? JSON.parse(saved) : MOCK_TEACHERS;
  });
  const [classes, setClasses] = useState<Class[]>(() => {
    const saved = localStorage.getItem('classes');
    return saved ? JSON.parse(saved) : MOCK_CLASSES;
  });
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('subjects');
    return saved ? JSON.parse(saved) : MOCK_SUBJECTS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('schedules', JSON.stringify(schedules));
    checkAllConflicts();
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem('rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = useCallback((notif: Omit<AppNotification, 'id' | 'time' | 'read'>) => {
    setNotifications(prev => [
      {
        ...notif,
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        time: 'À l\'instant',
        read: false
      },
      ...prev
    ].slice(0, 50)); // Keep last 50
  }, []);

  const checkAllConflicts = useCallback(() => {
    const newNotifications: AppNotification[] = [];
    
    // Check for room conflicts
    schedules.forEach((s1, i) => {
      schedules.forEach((s2, j) => {
        if (i >= j) return;
        if (s1.day !== s2.day) return;
        
        // Simple overlap check (HH:mm)
        const s1Start = s1.startTime;
        const s1End = s1.endTime;
        const s2Start = s2.startTime;
        const s2End = s2.endTime;

        const isOverlapping = (s1Start < s2End && s1End > s2Start);

        if (isOverlapping) {
          if (s1.roomId === s2.roomId) {
            const room = rooms.find(r => r.id === s1.roomId);
            newNotifications.push({
              id: `conflict-room-${s1.id}-${s2.id}`,
              type: 'error',
              title: 'Conflit de salle',
              message: `La salle ${room?.name} est occupée par deux cours en même temps.`,
              time: 'Système',
              read: false,
              relatedId: s1.id,
              targetRole: UserRole.ADMIN
            });
          }
          if (s1.teacherId === s2.teacherId) {
            const teacher = teachers.find(t => t.id === s1.teacherId);
            newNotifications.push({
              id: `conflict-teacher-${s1.id}-${s2.id}`,
              type: 'error',
              title: 'Conflit d\'enseignant',
              message: `${teacher?.name} a deux cours programmés simultanément.`,
              time: 'Système',
              read: false,
              relatedId: s1.id,
              targetRole: UserRole.ADMIN
            });
          }
        }
      });
    });

    // We don't want to spam notifications that are already there.
    // In a real app we'd be more careful. For this mock, we'll append only new ones by title/message uniqueness
    setNotifications(prev => {
      const existingMessages = new Set(prev.map(p => p.message));
      const filteredNew = newNotifications.filter(n => !existingMessages.has(n.message));
      if (filteredNew.length === 0) return prev;
      return [...filteredNew, ...prev].slice(0, 50);
    });
  }, [schedules, rooms, teachers]);

  const addRoom = (room: Room) => {
    setRooms(prev => [...prev, room]);
  };

  const updateRoom = (id: string, updates: Partial<Room>) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteRoom = (id: string) => {
    setRooms(prev => prev.filter(r => r.id !== id));
  };

  const addClass = (cls: Class) => {
    setClasses(prev => [...prev, cls]);
  };

  const updateClass = (id: string, updates: Partial<Class>) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteClass = (id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
  };

  const addTeacher = (teacher: Teacher) => {
    setTeachers(prev => [...prev, teacher]);
  };

  const updateTeacher = (id: string, updates: Partial<Teacher>) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTeacher = (id: string) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
  };

  const addSubject = (subject: Subject) => {
    setSubjects(prev => [...prev, subject]);
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  const updateSchedule = (id: string, updates: Partial<Schedule>) => {
    const prev = schedules.find(s => s.id === id);
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    
    if (prev && updates.teacherId && updates.teacherId !== prev.teacherId) {
      const subject = subjects.find(s => s.id === prev.subjectId);
      addNotification({
        type: 'info',
        title: 'Nouvelle affectation',
        message: `Vous avez été affecté au cours de ${subject?.name}.`,
        targetUserId: updates.teacherId,
        relatedId: id
      });
    }
  };

  const deleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
  };

  const addSchedule = (schedule: Schedule) => {
    setSchedules(prev => [...prev, schedule]);
    
    const subject = subjects.find(s => s.id === schedule.subjectId);
    addNotification({
      type: 'info',
      title: 'Nouvelle affectation',
      message: `Vous avez été affecté au cours de ${subject?.name}.`,
      targetUserId: schedule.teacherId,
      relatedId: schedule.id
    });
  };

  const requestScheduleChange = (scheduleId: string, newDay: number, newStartTime: string, newEndTime: string) => {
    const current = schedules.find(s => s.id === scheduleId);
    if (!current) return;

    const cls = classes.find(c => c.id === current.classId);
    const teacher = teachers.find(t => t.id === current.teacherId);
    const subject = subjects.find(s => s.id === current.subjectId);

    addNotification({
      type: 'warning',
      title: 'Demande de modification',
      message: `${teacher?.name} a demandé un changement pour le cours de ${subject?.name} (${cls?.name} ${cls?.mention}).`,
      relatedId: scheduleId,
      targetRole: UserRole.ADMIN
    });

    setSchedules(prev => prev.map(s => s.id === scheduleId ? { 
      ...s, 
      day: newDay,
      startTime: newStartTime,
      endTime: newEndTime,
      status: 'pending',
      originalDay: s.status === 'pending' ? s.originalDay : s.day,
      originalStartTime: s.status === 'pending' ? s.originalStartTime : s.startTime,
      originalEndTime: s.status === 'pending' ? s.originalEndTime : s.endTime,
    } : s));
  };

  const cancelScheduleChange = (scheduleId: string) => {
    setSchedules(prev => prev.map(s => {
      if (s.id === scheduleId && s.status === 'pending') {
        return {
          ...s,
          day: s.originalDay ?? s.day,
          startTime: s.originalStartTime ?? s.startTime,
          endTime: s.originalEndTime ?? s.endTime,
          status: 'validated',
          originalDay: undefined,
          originalStartTime: undefined,
          originalEndTime: undefined,
        };
      }
      return s;
    }));
  };

  const validateSchedule = (scheduleId: string) => {
    const current = schedules.find(s => s.id === scheduleId);
    setSchedules(prev => prev.map(s => s.id === scheduleId ? { 
      ...s, 
      status: 'validated',
      originalDay: undefined,
      originalStartTime: undefined,
      originalEndTime: undefined,
    } : s));

    if (current) {
      addNotification({
        type: 'success',
        title: 'Changement validé',
        message: 'Un nouveau créneau a été approuvé par l\'administration.',
        relatedId: scheduleId,
        targetUserId: current.teacherId
      });
    }
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearNotifications = (ids: string[]) => {
    const idSet = new Set(ids);
    setNotifications(prev => prev.filter(n => !idSet.has(n.id)));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <DataContext.Provider value={{ 
      schedules, 
      rooms, 
      teachers, 
      classes, 
      subjects, 
      notifications,
      addRoom,
      updateRoom,
      deleteRoom,
      addClass,
      updateClass,
      deleteClass,
      addTeacher,
      updateTeacher,
      deleteTeacher,
      addSubject,
      updateSubject,
      deleteSubject,
      updateSchedule, 
      deleteSchedule,
      addSchedule,
      requestScheduleChange,
      cancelScheduleChange,
      validateSchedule,
      clearNotification,
      clearNotifications,
      markAllAsRead
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
