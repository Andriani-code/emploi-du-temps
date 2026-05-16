import React from 'react';
import { motion } from 'motion/react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  Linkedin,
  Facebook,
  Instagram
} from 'lucide-react';

const ContactInfoCard = ({ icon: Icon, title, content, detail }: any) => (
  <div className="flex gap-4 items-start p-6 bg-white border border-border rounded-2xl group hover:border-primary/50 transition-all shadow-sm">
    <div className="w-10 h-10 bg-bg-light text-primary rounded-xl flex items-center justify-center shrink-0 transition-colors group-hover:bg-primary group-hover:text-white">
      <Icon size={20} />
    </div>
    <div className="space-y-0.5">
      <h4 className="text-base font-bold text-text-dark tracking-tight">{title}</h4>
      <p className="text-sm text-text-dark font-medium">{content}</p>
      <p className="text-xs text-text-muted italic">{detail}</p>
    </div>
  </div>
);

export const Contact = () => {
  return (
    <div className="pt-24 pb-16 px-6 lg:px-12 space-y-16">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <h1 className="text-3xl font-bold text-text-dark tracking-tight">Contactez-nous</h1>
          <p className="text-sm text-text-muted leading-relaxed">
            Nous sommes à votre écoute pour toute question. N'hésitez pas à nous contacter directement ou via le formulaire.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side Info */}
          <div className="space-y-4">
            <ContactInfoCard 
              icon={MapPin}
              title="Adresse"
              content="Campus Andrainjato, B.P. 1500"
              detail="Fianarantsoa 301, Madagascar"
            />
            <ContactInfoCard 
              icon={Phone}
              title="Téléphone"
              content="+261 33 70 470 00"
              detail="Contact EMIT"
            />
            <ContactInfoCard 
              icon={Mail}
              title="Email"
              content="renseignement@emit.mg"
              detail="mailto:renseignement@emit.mg"
            />
            <ContactInfoCard 
              icon={Clock}
              title="Horaires"
              content="Lundi - Vendredi"
              detail="08:00 - 12:00 | 14:00 - 17:30"
            />

            <div className="pt-6 flex items-center gap-6">
              <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Suivez-nous</span>
              <div className="flex gap-3">
                <a href="https://www.facebook.com/emitfianarantsoa" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-bg-light text-text-muted flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm">
                  <Facebook size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-bg-light text-text-muted flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm">
                  <Linkedin size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-bg-light text-text-muted flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm">
                  <Instagram size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Right Side Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="p-8 bg-white border border-border rounded-3xl shadow-xl shadow-slate-200/50 space-y-8"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider ml-1">Nom complet</label>
                  <input type="text" placeholder="Votre nom" className="w-full bg-bg-light border border-border rounded-xl py-3 px-5 text-sm focus:ring-2 focus:ring-primary/10 focus:border-primary focus:outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider ml-1">Email</label>
                  <input type="email" placeholder="votre.email@exemple.com" className="w-full bg-bg-light border border-border rounded-xl py-3 px-5 text-sm focus:ring-2 focus:ring-primary/10 focus:border-primary focus:outline-none transition-all" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider ml-1">Sujet</label>
                <input type="text" placeholder="Comment pouvons-nous vous aider ?" className="w-full bg-bg-light border border-border rounded-xl py-3 px-5 text-sm focus:ring-2 focus:ring-primary/10 focus:border-primary focus:outline-none transition-all" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider ml-1">Message</label>
                <textarea rows={4} placeholder="Écrivez votre message ici..." className="w-full bg-bg-light border border-border rounded-xl py-3 px-5 text-sm focus:ring-2 focus:ring-primary/10 focus:border-primary focus:outline-none transition-all resize-none"></textarea>
              </div>
            </div>

            <button className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/10 hover:bg-primary-hover transition-all flex items-center justify-center gap-2 active:scale-[0.99]">
              Envoyer le message
              <Send size={18} />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Map Placeholder - Updated for Fianarantsoa */}
      <div className="max-w-6xl mx-auto h-[350px] rounded-[40px] overflow-hidden bg-slate-100 shadow-inner">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3681.442!2d47.1099472!3d-21.463788!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x21e7bf3a518ca787:0x60d947c35b7c1085!2sEMIT%20(Ecole%20de%20Management%20et%20d'Innovation%20Technologique)!5e0!3m2!1sfr!2smg!4v1715781234567!5m2!1sfr!2smg" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy"
          className="grayscale hover:grayscale-0 transition-all duration-1000"
        ></iframe>
      </div>
    </div>
  );
};
