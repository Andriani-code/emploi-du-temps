import React, { useState } from 'react';
import { 
  DoorOpen, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Users, 
  MapPin,
  Edit2,
  Trash2,
  CheckCircle2,
  X
} from 'lucide-react';
import { motion } from 'motion/react';
import { Room } from '../../data';
import { useData } from '../../lib/DataContext';
import { AnimatePresence } from 'motion/react';

export const Rooms: React.FC = () => {
  const { rooms, addRoom, updateRoom, deleteRoom } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState<Partial<Room>>({
    name: '',
    capacity: 40,
    type: 'TD'
  });

  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (room?: Room) => {
    if (room) {
      setEditingRoom(room);
      setFormData(room);
    } else {
      setEditingRoom(null);
      setFormData({ name: '', capacity: 40, type: 'TD' });
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingRoom) {
      updateRoom(editingRoom.id, formData);
    } else {
      addRoom({
        ...formData as Room,
        id: `room-${Date.now()}`
      });
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer cette salle ?')) {
      deleteRoom(id);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-dark mb-2">Gestion des Salles</h1>
          <p className="text-text-muted">Consultez et gérez les salles de l'EMIT.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#001D4A] hover:bg-[#00215E] text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-[#001D4A]/20 flex items-center gap-2 w-fit"
        >
          <Plus size={20} />
          Ajouter une salle
        </button>
      </div>

      {/* Filters/Search */}
      <div className="bg-white p-4 rounded-3xl border border-border shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-[#001D4A]" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher une salle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-bg-light border border-border rounded-2xl py-3 pl-12 pr-4 outline-none transition-all focus:border-[#001D4A] focus:ring-4 focus:ring-[#001D4A]/5 text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-3 bg-bg-light border border-border rounded-2xl text-sm font-bold text-text-dark hover:bg-border/50 transition-colors">
            <Filter size={18} className="text-text-muted" />
            Type
          </button>
          <button className="flex items-center gap-2 px-4 py-3 bg-bg-light border border-border rounded-2xl text-sm font-bold text-text-dark hover:bg-border/50 transition-colors">
            Capacité
          </button>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-bg-light border-b border-border">
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Nom</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Capacité</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRooms.map((room, i) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={room.id} 
                  className="hover:bg-bg-light/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#001D4A]/5 text-[#001D4A] rounded-xl flex items-center justify-center">
                        < DoorOpen size={20} />
                      </div>
                      <span className="font-bold text-text-dark">{room.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-text-muted text-sm font-medium">
                      <Users size={14} className="text-accent" />
                      {room.capacity} places
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider ${
                      room.type === 'Amphi' ? 'bg-purple-50 text-purple-600' :
                      room.type === 'TP' ? 'bg-blue-50 text-blue-600' :
                      'bg-emerald-50 text-emerald-600'
                    }`}>
                      {room.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(room)}
                        className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-border text-text-muted hover:text-[#001D4A] transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(room.id)}
                        className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-border text-text-muted hover:text-error transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredRooms.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-bg-light rounded-full flex items-center justify-center mx-auto mb-4 text-text-muted">
              <Search size={24} />
            </div>
            <h3 className="text-lg font-bold text-text-dark mb-1">Aucune salle trouvée</h3>
            <p className="text-text-muted text-sm">Essayez de modifier vos critères de recherche.</p>
          </div>
        )}
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
                  {editingRoom ? 'Modifier la salle' : 'Nouvelle salle'}
                </h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-bg-light rounded-xl transition-colors text-text-muted">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-dark ml-1">Nom de la salle</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ex: B101, AMPHI..."
                    required
                    className="w-full bg-bg-light border border-border rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#001D4A]/20 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-dark ml-1">Capacité</label>
                    <input 
                      type="number" 
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                      required
                      className="w-full bg-bg-light border border-border rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#001D4A]/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-dark ml-1">Type</label>
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full bg-bg-light border border-border rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#001D4A]/20 transition-all"
                    >
                      <option value="TD">TD</option>
                      <option value="TP">TP</option>
                      <option value="Amphi">Amphi</option>
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
                    <CheckCircle2 size={20} />
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
