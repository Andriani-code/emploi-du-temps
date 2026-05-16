import React from 'react';
import { motion } from 'motion/react';
import { 
  Target, 
  Eye, 
  Heart, 
  Users, 
  BarChart, 
  Lightbulb 
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.6 }}
    className="p-8 bg-white border border-border rounded-2xl shadow-sm space-y-4"
  >
    <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center">
      <Icon size={24} />
    </div>
    <div className="space-y-2">
      <h3 className="text-xl font-bold text-text-dark">{title}</h3>
      <p className="text-sm text-text-muted leading-relaxed italic">
        {description}
      </p>
    </div>
  </motion.div>
);

export const About = () => {
  return (
    <div className="pt-24 pb-16 px-6 lg:px-12 space-y-16">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-text-dark leading-tight tracking-tight">
              À propos de <span className="text-primary">l’EMIT</span>
            </h1>
            <div className="space-y-4">
              <p className="text-base text-text-muted leading-relaxed">
                L'École de Management et d'Innovation Technologique (EMIT) est une institution publique majeure au sein de l'Université de Fianarantsoa.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                L'EMIT s'est engagée à fournir une éducation de haut niveau combinant management et technologie. Notre institution forme les futurs cadres et innovateurs capables de répondre aux défis du développement technologique.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-8">
              <div className="aspect-square bg-slate-100 rounded-3xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1523050353096-c8913b199ee9?q=80&w=2070" className="w-full h-full object-cover" />
              </div>
              <div className="h-32 bg-primary rounded-3xl flex flex-col items-center justify-center text-white text-center p-4">
                <span className="text-2xl font-bold">20+</span>
                <span className="text-[10px] uppercase font-medium tracking-widest opacity-80">Années d'excellence</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-52 bg-slate-900 rounded-3xl flex flex-col items-center justify-center text-blue-400 text-center p-4">
                <span className="text-2xl font-bold">1,500+</span>
                <span className="text-[10px] uppercase font-medium tracking-widest opacity-80">Étudiants actifs</span>
              </div>
              <div className="aspect-square bg-slate-100 rounded-3xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* Pillars */}
        <section className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold text-text-dark">Nos Piliers</h2>
            <p className="text-sm text-text-muted italic">Ce qui définit notre identité et guide nos actions.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={Target}
              title="Notre mission"
              description="Offrir une formation de qualité alliant théorie et pratique pour préparer les étudiants."
              delay={0.1}
            />
            <FeatureCard 
              icon={Eye}
              title="Notre vision"
              description="Être une référence en matière d'excellence académique et d'innovation technologique."
              delay={0.2}
            />
            <FeatureCard 
              icon={Heart}
              title="Nos valeurs"
              description="Excellence, Intégrité, Innovation et Esprit d'équipe sont au cœur de notre identité."
              delay={0.3}
            />
          </div>
        </section>

        {/* Wide Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative h-[350px] rounded-[40px] overflow-hidden shadow-xl"
        >
          <img 
            src="https://images.unsplash.com/photo-1498243639359-2cee3e35403d?q=80&w=2070" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-transparent flex items-center px-10">
            <div className="max-w-md text-white space-y-4">
              <h3 className="text-3xl font-bold leading-tight">Un avenir brillant à l'EMIT</h3>
              <p className="text-base opacity-90 leading-relaxed italic font-medium">Rejoignez une communauté dynamique qui façonne l'avenir de la technologie.</p>
              <button className="bg-white text-primary px-6 py-3 rounded-lg font-bold hover:scale-105 transition-transform shadow-md text-sm">En savoir plus</button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
