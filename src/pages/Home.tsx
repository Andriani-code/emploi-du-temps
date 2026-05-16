import React from 'react';
import { motion } from 'motion/react';
import { 
  Info, 
  LayoutGrid, 
  Users, 
  MapPin, 
  Search,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import emit from '../assets/emit.png';

const QuickAccessCard = ({ icon: Icon, title, subtitle, path, delay = 0 }) => (
  <Link to={path}>
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -8 }}
      className="group p-8 bg-white border border-border rounded-2xl shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all flex flex-col items-center text-center space-y-6"
    >
      <div className="w-16 h-16 bg-bg-light rounded-2xl flex items-center justify-center text-primary transition-colors group-hover:bg-primary group-hover:text-white shadow-inner">
        <Icon size={32} />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-text-dark">{title}</h3>
        <p className="text-sm text-text-muted leading-relaxed max-w-[200px]">
          {subtitle}
        </p>
      </div>
    </motion.div>
  </Link>
);

export const Home = () => {
  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="space-y-5">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-text-dark tracking-tight">
                Consultez les emplois <br />
                du temps de toutes <br />
                <span className="text-primary">les classes</span>
              </h1>
              <p className="text-base text-text-muted max-w-lg leading-relaxed">
                Accédez facilement aux plannings des cours par mention, parcours ou classe en un clic. Votre réussite commence par une bonne organisation.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link 
                to="/timetable" 
                className="bg-primary text-white px-6 py-3.5 rounded-xl font-semibold shadow-lg shadow-primary/10 hover:bg-primary-hover transition-all flex items-center gap-2"
              >
                Voir les emplois du temps
                <ArrowRight size={18} />
              </Link>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="p-5 bg-white border border-border rounded-xl shadow-sm max-w-sm flex gap-3 items-start"
            >
              <div className="p-2 bg-blue-50 text-primary rounded-lg shrink-0">
                <Info size={18} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-text-dark">Informations importantes</h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  Les emplois du temps peuvent être modifiés. Consultez-les régulièrement pour rester informé.
                </p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative aspect-[4/3] rounded-[70%_0%_0%_26%/_100%_10%_10%_0%] overflow-hidden shadow-2xl shadow-slate-200"
          >
            <img
              src={emit}
              alt="emit bg"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          </motion.div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-16 px-6 lg:px-12 bg-bg-light">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-text-dark tracking-tight">Accès rapide</h2>
            <div className="h-1 w-16 bg-primary rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickAccessCard 
              icon={LayoutGrid}
              title="Par mention"
              subtitle="Voir les emplois du temps par mention (Licence, Master)"
              path="/mentions"
              delay={0.1}
            />
            <QuickAccessCard 
              icon={Users}
              title="Par parcours"
              subtitle="Consulter les plannings par parcours spécifique"
              path="/timetable"
              delay={0.2}
            />
            <QuickAccessCard 
              icon={MapPin}
              title="Par classe"
              subtitle="Accéder aux emplois du temps de chaque classe et salle"
              path="/timetable"
              delay={0.3}
            />
            <QuickAccessCard 
              icon={Search}
              title="Rechercher"
              subtitle="Trouver rapidement une matière ou enseignant"
              path="/timetable"
              delay={0.4}
            />
          </div>
        </div>
      </section>
    </div>
  );
};
