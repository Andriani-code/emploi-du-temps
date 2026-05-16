import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter,
  Edit2,
  Trash2,
  Code
} from 'lucide-react';
import { motion } from 'motion/react';
import { MOCK_SUBJECTS, Subject } from '../../data';

export const Subjects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [subjects] = useState<Subject[]>(MOCK_SUBJECTS);

  const filtered = subjects.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-dark mb-2">Gestion des Matières</h1>
          <p className="text-text-muted">Gérez les unités d'enseignement.</p>
        </div>
        <button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2 w-fit">
          <Plus size={20} />
          Ajouter une matière
        </button>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-border shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-primary" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-bg-light border border-border rounded-2xl py-3 pl-12 pr-4 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/5 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((s, i) => (
          <motion.div 
            key={s.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-3xl border border-border p-5 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                <BookOpen size={20} />
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 hover:bg-bg-light rounded-lg text-text-muted hover:text-primary">
                  <Edit2 size={14} />
                </button>
              </div>
            </div>
            <h3 className="text-base font-bold text-text-dark mb-1">{s.name}</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-text-muted">
              <Code size={12} className="text-accent" />
              {s.code}
            </div>
            <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] font-bold text-text-muted uppercase">Actif</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
