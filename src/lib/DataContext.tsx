import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Schedule, 
  Room, 
  Teacher, 
  Class, 
  Subject,
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
  updateSchedule: (id: string, updates: Partial<Schedule>) => void;
  addSchedule: (schedule: Schedule) => void;
  requestScheduleChange: (scheduleId: string, newDay: number, newStartTime: string, newEndTime: string) => void;
  cancelScheduleChange: (scheduleId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [schedules, setSchedules] = useState<Schedule[]>(() => {
    const saved = localStorage.getItem('schedules');
    return saved ? JSON.parse(saved) : MOCK_SCHEDULES;
  });

  const [rooms] = useState<Room[]>(MOCK_ROOMS);
  const [teachers] = useState<Teacher[]>(MOCK_TEACHERS);
  const [classes] = useState<Class[]>(MOCK_CLASSES);
  const [subjects] = useState<Subject[]>(MOCK_SUBJECTS);

  useEffect(() => {
    localStorage.setItem('schedules', JSON.stringify(schedules));
  }, [schedules]);

  const updateSchedule = (id: string, updates: Partial<Schedule>) => {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const addSchedule = (schedule: Schedule) => {
    setSchedules(prev => [...prev, schedule]);
  };

  const requestScheduleChange = (scheduleId: string, newDay: number, newStartTime: string, newEndTime: string) => {
    const current = schedules.find(s => s.id === scheduleId);
    if (!current) return;

    // In a real app, this might create a "ChangeRequest" entity.
    setSchedules(prev => prev.map(s => s.id === scheduleId ? { 
      ...s, 
      day: newDay,
      startTime: newStartTime,
      endTime: newEndTime,
      status: 'pending',
      // Only set original if not already pending
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
          status: 'validated', // Revert to validated
          originalDay: undefined,
          originalStartTime: undefined,
          originalEndTime: undefined,
        };
      }
      return s;
    }));
  };

  return (
    <DataContext.Provider value={{ 
      schedules, 
      rooms, 
      teachers, 
      classes, 
      subjects, 
      updateSchedule, 
      addSchedule,
      requestScheduleChange,
      cancelScheduleChange
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
