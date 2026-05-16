import React, { useState } from 'react';
import { 
  School, 
  Plus, 
  Search, 
  Edit2,
  Trash2,
  GraduationCap
} from 'lucide-react';
import { motion } from 'motion/react';
import { MOCK_CLASSES, Class } from '../../data';

export const Classes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [classes] = useState<Class[]>(MOCK_CLASSES);

  const filtered = classes.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.mention.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-dark mb-2">Gestion des Classes</h1>
          <p className="text-text-muted">Gérez les parcours et mentions.</p>
        </div>
        <button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2 w-fit">
          <Plus size={20} />
          Ajouter une classe
        </button>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-border shadow-sm">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-primary" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par niveau ou mention..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-bg-light border border-border rounded-2xl py-3 pl-12 pr-4 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/5 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((c, i) => (
          <motion.div 
            key={c.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-3xl border border-border p-6 shadow-sm hover:shadow-md transition-all border-l-4 border-l-primary"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-primary/5 text-primary rounded-xl">
                <GraduationCap size={24} />
              </div>
              <div className="flex gap-1">
                <button className="p-2 hover:bg-bg-light rounded-lg text-text-muted hover:text-primary transition-all">
                  <Edit2 size={16} />
                </button>
                <button className="p-2 hover:bg-bg-light rounded-lg text-text-muted hover:text-error transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <h3 className="text-xl font-bold text-text-dark">{c.name} {c.mention}</h3>
            <p className="text-sm font-medium text-text-muted mt-1">{c.level}</p>
            
            <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Effectif: 45</span>
              <button className="text-xs font-bold text-primary hover:underline">Détails</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
