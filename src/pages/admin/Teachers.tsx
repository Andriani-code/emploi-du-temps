import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit2,
  Trash2,
  Mail,
  Briefcase,
  X,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Teacher } from '../../data';
import { useData } from '../../lib/DataContext';

export const Teachers: React.FC = () => {
  const { teachers, addTeacher, updateTeacher, deleteTeacher } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState<Partial<Teacher>>({
    name: '',
    email: '',
    password: '',
    department: 'Informatique'
  });

  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (teacher?: Teacher) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setFormData({ ...teacher, password: teacher.password || 'password123' });
    } else {
      setEditingTeacher(null);
      setFormData({ name: '', email: '', password: 'password123', department: 'Informatique' });
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingTeacher) {
      updateTeacher(editingTeacher.id, formData);
    } else {
      addTeacher({
        ...formData as Teacher,
        id: `teacher-${Date.now()}`
      });
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer cet enseignant ?')) {
      deleteTeacher(id);
    }
  };

  const departments = Array.from(new Set(teachers.map(t => t.department)));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-dark mb-2">Gestion des Enseignants</h1>
          <p className="text-text-muted">Gérez le corps enseignant de l'EMIT.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#001D4A] hover:bg-[#00215E] text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-[#001D4A]/20 flex items-center gap-2 w-fit"
        >
          <Plus size={20} />
          Ajouter un enseignant
        </button>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-border shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-[#001D4A]" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou département..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-bg-light border border-border rounded-2xl py-3 pl-12 pr-4 outline-none transition-all focus:border-[#001D4A] focus:ring-4 focus:ring-[#001D4A]/5 text-sm"
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-3 bg-bg-light border border-border rounded-2xl">
          <Filter size={18} className="text-text-muted" />
          <select className="bg-transparent text-sm font-bold text-text-dark outline-none cursor-pointer">
            <option value="">Tous les départements</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher, i) => (
          <motion.div 
            key={teacher.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-[2rem] border border-border p-6 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#001D4A]/5 text-[#001D4A] rounded-2xl flex items-center justify-center font-bold text-xl">
                  {teacher.name.charAt(teacher.name.startsWith('M') ? 3 : teacher.name.startsWith('D') ? 3 : 0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-dark leading-tight">{teacher.name}</h3>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mt-1">{teacher.department}</p>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleOpenModal(teacher)}
                  className="p-3 hover:bg-bg-light rounded-xl text-text-muted hover:text-[#001D4A] transition-all"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(teacher.id)}
                  className="p-3 hover:bg-bg-light rounded-xl text-text-muted hover:text-error transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-border">
              <div className="flex items-center gap-3 text-sm text-text-muted">
                <Mail size={16} className="text-[#001D4A]/60" />
                {teacher.email}
              </div>
              <div className="flex items-center gap-3 text-sm text-text-muted">
                <Briefcase size={16} className="text-[#001D4A]/60" />
                Dép: {teacher.department}
              </div>
            </div>

            <button className="w-full mt-6 py-4 bg-bg-light hover:bg-[#001D4A]/5 rounded-2xl text-xs font-bold text-text-dark hover:text-[#001D4A] transition-all">
              Gérer son emploi du temps
            </button>
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
                  {editingTeacher ? 'Modifier l\'enseignant' : 'Nouvel enseignant'}
                </h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-bg-light rounded-xl transition-colors text-text-muted">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-dark ml-1">Nom Complet (avec Titre ex: Dr, Mr)</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ex: Dr Jacques Aimé, Mme Josée..."
                    required
                    className="w-full bg-bg-light border border-border rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#001D4A]/20 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-dark ml-1">Email (Identifiant)</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@emit.mg"
                      required
                      className="w-full bg-bg-light border border-border rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#001D4A]/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-dark ml-1">Mot de passe</label>
                    <input 
                      type="text" 
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Mot de passe"
                      required
                      className="w-full bg-bg-light border border-border rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#001D4A]/20 transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-dark ml-1">Département</label>
                  <select 
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-bg-light border border-border rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#001D4A]/20 transition-all"
                  >
                    <option value="Informatique">Informatique</option>
                    <option value="Management">Management</option>
                    <option value="Langues">Langues</option>
                    <option value="Mathématiques">Mathématiques</option>
                  </select>
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
