import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter,
  Edit2,
  Trash2,
  Code,
  X,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Subject } from '../../data';
import { useData } from '../../lib/DataContext';

export const Subjects: React.FC = () => {
  const { subjects, addSubject, updateSubject, deleteSubject } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState<Partial<Subject>>({
    name: '',
    code: ''
  });

  const filtered = subjects.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (subject?: Subject) => {
    if (subject) {
      setEditingSubject(subject);
      setFormData(subject);
    } else {
      setEditingSubject(null);
      setFormData({ name: '', code: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    if (editingSubject) {
      updateSubject(editingSubject.id, formData);
    } else {
      addSubject({
        ...formData as Subject,
        id: `subject-${Date.now()}`
      });
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer cette matière ?')) {
      deleteSubject(id);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-dark mb-2">Gestion des Matières</h1>
          <p className="text-text-muted">Gérez les unités d'enseignement de l'EMIT.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#001D4A] hover:bg-[#00215E] text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-[#001D4A]/20 flex items-center gap-2 w-fit"
        >
          <Plus size={20} />
          Ajouter une matière
        </button>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-border shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-[#001D4A]" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-bg-light border border-border rounded-2xl py-3 pl-12 pr-4 outline-none transition-all focus:border-[#001D4A] focus:ring-4 focus:ring-[#001D4A]/5 text-sm"
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
            className="bg-white rounded-3xl border border-border p-6 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                <BookOpen size={24} />
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleOpenModal(s)}
                  className="p-2 hover:bg-bg-light rounded-lg text-text-muted hover:text-[#001D4A]"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(s.id)}
                  className="p-2 hover:bg-bg-light rounded-lg text-text-muted hover:text-error"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-bold text-text-dark mb-1 leading-tight">{s.name}</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-text-muted">
              <Code size={14} className="text-[#001D4A]/60" />
              {s.code}
            </div>
            <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Matière Actif</span>
              </div>
              <span className="text-[10px] font-bold text-text-dark bg-bg-light px-2 py-1 rounded">UE</span>
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
                  {editingSubject ? 'Modifier la matière' : 'Nouvelle matière'}
                </h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-bg-light rounded-xl transition-colors text-text-muted">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-dark ml-1">Nom de la matière</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ex: Mathématiques, Algorithmique..."
                    required
                    className="w-full bg-bg-light border border-border rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#001D4A]/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-dark ml-1">Code de la matière</label>
                  <input 
                    type="text" 
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="ex: MATH101, INF202..."
                    required
                    className="w-full bg-bg-light border border-border rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#001D4A]/20 transition-all"
                  />
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
