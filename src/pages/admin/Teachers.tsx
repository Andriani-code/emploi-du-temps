import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit2,
  Trash2,
  Mail,
  Briefcase
} from 'lucide-react';
import { motion } from 'motion/react';
import { MOCK_TEACHERS, Teacher } from '../../data';

export const Teachers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [teachers, setTeachers] = useState<Teacher[]>(MOCK_TEACHERS);

  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-dark mb-2">Gestion des Enseignants</h1>
          <p className="text-text-muted">Consultez et gérez le corps enseignant.</p>
        </div>
        <button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2 w-fit">
          <Plus size={20} />
          Ajouter un enseignant
        </button>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-border shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-primary" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou département..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-bg-light border border-border rounded-2xl py-3 pl-12 pr-4 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/5 text-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 bg-bg-light border border-border rounded-2xl text-sm font-bold text-text-dark hover:bg-border/50 transition-colors">
          <Filter size={18} className="text-text-muted" />
          Département
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher, i) => (
          <motion.div 
            key={teacher.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-3xl border border-border p-6 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold text-xl">
                  {teacher.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-dark leading-tight">{teacher.name}</h3>
                  <p className="text-xs font-bold text-text-muted uppercase tracking-wider mt-1">{teacher.department}</p>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 hover:bg-bg-light rounded-lg text-text-muted hover:text-primary transition-all">
                  <Edit2 size={16} />
                </button>
                <button className="p-2 hover:bg-bg-light rounded-lg text-text-muted hover:text-error transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-border">
              <div className="flex items-center gap-3 text-sm text-text-muted">
                <Mail size={16} className="text-accent" />
                {teacher.email}
              </div>
              <div className="flex items-center gap-3 text-sm text-text-muted">
                <Briefcase size={16} className="text-accent" />
                Dép: {teacher.department}
              </div>
            </div>

            <button className="w-full mt-6 py-3 bg-bg-light hover:bg-border/50 rounded-2xl text-xs font-bold text-text-dark transition-all">
              Voir l'emploi du temps
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
