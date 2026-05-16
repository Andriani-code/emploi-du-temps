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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-dark mb-1">Gestion des Matières</h1>
          <p className="text-xs text-text-muted">Gérez les unités d'enseignement de l'EMIT.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#001D4A] hover:bg-[#00215E] active:scale-95 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-[#001D4A]/10 flex items-center gap-2 w-fit focus-visible:ring-2 focus-visible:ring-[#001D4A] focus-visible:outline-none"
        >
          <Plus size={18} />
          Ajouter une matière
        </button>
      </div>

      <div className="bg-white p-3 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-grow group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-[#001D4A]" size={16} />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-bg-light border border-border rounded-xl py-2 pl-10 pr-4 outline-none transition-all focus:border-[#001D4A] focus:ring-4 focus:ring-[#001D4A]/5 text-xs focus-visible:ring-2 focus-visible:ring-[#001D4A] focus-visible:outline-none"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-border text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-bg-light rounded-full flex items-center justify-center mx-auto mb-4 text-text-muted">
            <Search size={24} />
          </div>
          <h3 className="text-lg font-bold text-text-dark mb-1">Aucune matière trouvée</h3>
          <p className="text-text-muted text-sm max-w-sm mb-6">Il n'y a aucune matière correspondant à votre recherche. Modifiez vos critères ou ajoutez une nouvelle matière.</p>
          <button 
            onClick={() => { setSearchTerm(''); handleOpenModal(); }}
            className="bg-[#001D4A] hover:bg-[#00215E] active:scale-95 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-[#001D4A]/10 flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <Plus size={18} />
            Ajouter une matière
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((s, i) => (
            <motion.div 
              key={s.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-border p-4 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                  <BookOpen size={20} />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleOpenModal(s)}
                    className="p-1.5 hover:bg-bg-light rounded-lg text-text-muted hover:text-[#001D4A] active:scale-95 focus-visible:ring-2 focus-visible:ring-[#001D4A] focus-visible:outline-none"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(s.id)}
                    className="p-1.5 hover:bg-bg-light rounded-lg text-text-muted hover:text-error active:scale-95 focus-visible:ring-2 focus-visible:ring-error focus-visible:outline-none"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <h3 className="text-sm font-bold text-text-dark mb-1 leading-tight">{s.name}</h3>
              <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted">
                <Code size={12} className="text-[#001D4A]/60" />
                {s.code}
              </div>
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Actif</span>
                </div>
                <span className="text-[9px] font-bold text-text-dark bg-bg-light px-1.5 py-0.5 rounded">UE</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

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
              className="bg-white rounded-[12px] p-6 shadow-2xl relative w-full max-w-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-display font-bold text-text-dark">
                  {editingSubject ? 'Modifier la matière' : 'Nouvelle matière'}
                </h3>
                <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-bg-light rounded-lg transition-colors text-text-muted active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-dark ml-1 uppercase tracking-wider">Nom de la matière</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ex: Mathématiques, Algorithmique..."
                    required
                    className="w-full bg-bg-light border border-border rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#001D4A]/20 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-dark ml-1 uppercase tracking-wider">Code de la matière</label>
                  <input 
                    type="text" 
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="ex: MATH101, INF202..."
                    required
                    className="w-full bg-bg-light border border-border rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#001D4A]/20 transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-border text-text-dark text-xs font-bold hover:bg-bg-light transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-[#001D4A] text-white text-xs font-bold hover:bg-[#00215E] shadow-lg shadow-[#001D4A]/10 transition-all flex items-center justify-center gap-2 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#001D4A] focus-visible:outline-none"
                  >
                    <Check size={16} />
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
