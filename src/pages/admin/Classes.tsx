import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2,
  Trash2,
  GraduationCap,
  X,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Class, Level } from '../../data';
import { useData } from '../../lib/DataContext';

export const Classes: React.FC = () => {
  const { classes, addClass, updateClass, deleteClass } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [formData, setFormData] = useState<Partial<Class>>({
    name: '',
    mention: '',
    level: Level.LICENCE
  });

  const filtered = classes.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.mention.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (cls?: Class) => {
    if (cls) {
      setEditingClass(cls);
      setFormData(cls);
    } else {
      setEditingClass(null);
      setFormData({ name: '', mention: '', level: Level.LICENCE });
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mention) return;

    if (editingClass) {
      updateClass(editingClass.id, formData);
    } else {
      addClass({
        ...formData as Class,
        id: `class-${Date.now()}`
      });
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer cette classe ?')) {
      deleteClass(id);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-dark mb-2">Gestion des Classes</h1>
          <p className="text-text-muted">Gérez les parcours et mentions de l'EMIT.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#001D4A] hover:bg-[#00215E] text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-[#001D4A]/20 flex items-center gap-2 w-fit"
        >
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
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-[2rem] border border-border p-6 shadow-sm hover:shadow-md transition-all border-l-8 border-l-primary flex flex-col"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="p-4 bg-primary/5 text-primary rounded-2xl">
                <GraduationCap size={28} />
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => handleOpenModal(c)}
                  className="p-3 hover:bg-bg-light rounded-xl text-text-muted hover:text-primary transition-all"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(c.id)}
                  className="p-3 hover:bg-bg-light rounded-xl text-text-muted hover:text-error transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-text-dark leading-tight mb-1">{c.mention}</h3>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#001D4A]/5 text-[#001D4A] rounded text-[10px] font-bold uppercase tracking-wider">{c.name}</span>
                <span className="text-xs font-medium text-text-muted">{c.level}</span>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Effectif Estimé</span>
                <span className="text-sm font-bold text-text-dark">45 Étudiants</span>
              </div>
              <button className="bg-bg-light hover:bg-border/30 p-2.5 rounded-xl transition-colors">
                <Plus size={16} className="text-primary" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[32px] p-8 shadow-2xl relative w-full max-w-lg"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-display font-bold text-text-dark">
                  {editingClass ? 'Modifier la classe' : 'Nouvelle classe'}
                </h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-bg-light rounded-xl transition-colors text-text-muted">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-dark ml-1">Mention</label>
                  <input 
                    type="text" 
                    value={formData.mention}
                    onChange={(e) => setFormData({ ...formData, mention: e.target.value })}
                    placeholder="ex: Informatique, Gestion..."
                    required
                    className="w-full bg-bg-light border border-border rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-dark ml-1">Niveau (Court)</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="ex: L1, L2, M1..."
                      required
                      className="w-full bg-bg-light border border-border rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-dark ml-1">Cycle</label>
                    <select 
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value as Level })}
                      className="w-full bg-bg-light border border-border rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    >
                      <option value={Level.LICENCE}>Licence</option>
                      <option value={Level.MASTER}>Master</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-4 rounded-2xl border border-border text-text-dark font-bold hover:bg-bg-light transition-all"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-4 rounded-2xl bg-[#001D4A] text-white font-bold hover:bg-[#00215E] shadow-lg shadow-[#001D4A]/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Check size={20} />
                    Enregistrer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
