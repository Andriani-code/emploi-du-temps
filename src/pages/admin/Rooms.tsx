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
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import { MOCK_ROOMS, Room } from '../../data';

export const Rooms: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);

  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-dark mb-2">Gestion des Salles</h1>
          <p className="text-text-muted">Consultez et gérez les salles de l'établissement.</p>
        </div>
        <button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2 w-fit">
          <Plus size={20} />
          Ajouter une salle
        </button>
      </div>

      {/* Filters/Search */}
      <div className="bg-white p-4 rounded-3xl border border-border shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-primary" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher une salle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-bg-light border border-border rounded-2xl py-3 pl-12 pr-4 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/5 text-sm"
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
                      <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center">
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
                      <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-border text-text-muted hover:text-primary transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-border text-text-muted hover:text-error transition-all">
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
    </div>
  );
};
