import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import logo from '../assets/logo.png';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden font-sans">
      {/* Left Decoration Panel (Visible on Desktop) */}
      <div className="hidden lg:flex w-[48%] bg-[#001D4A] relative flex-col justify-between p-16 overflow-hidden">
        {/* Wave/Curve Decoration */}
        <div 
          className="absolute top-0 bottom-0 -right-24 w-60 bg-white" 
          style={{ 
            clipPath: 'ellipse(25% 65% at 100% 50%)',
            boxShadow: '-20px 0 50px rgba(0,0,0,0.1)'
          }}
        ></div>
        
        {/* Top Branding */}
        <div className="relative z-10">
          <div className="flex items-center gap-5 mb-32">
            <div className="p-1 bg-white/10 rounded-2xl backdrop-blur-md">
              <img src={logo} alt="EMIT" className="w-16 h-16 object-contain brightness-0 invert" />
            </div>
            <div className="text-white">
              <h2 className="text-3xl font-display font-bold tracking-tight">EMIT</h2>
              <p className="text-[11px] font-medium opacity-70 leading-tight max-w-[220px]">
                École de Management et d'Innovation Technologique
              </p>
            </div>
          </div>

          <div className="space-y-8 max-w-lg">
            <h1 className="text-5xl font-display font-medium text-white leading-[1.1] tracking-tight">
              Gestion des Salles<br />et des Emplois du Temps
            </h1>
            <p className="text-xl text-blue-100 opacity-80 font-normal leading-relaxed max-w-md">
              Une solution efficace pour organiser les cours, les salles et les plannings à l'EMIT.
            </p>
          </div>
        </div>

        {/* Bottom Silhouette (Abstract Building) */}
        <div className="relative z-10 opacity-10 pointer-events-none mb-4">
          <svg width="100%" height="200" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
            <path d="M0 200V120H40V140H80V100H120V140H160V80H200V140H240V100H280V140H320V120H360V140H400V200H0Z" fill="white" fillOpacity="0.5"/>
            <rect x="180" y="50" width="40" height="90" fill="white" fillOpacity="0.5"/>
            <path d="M180 50L200 30L220 50H180Z" fill="white" fillOpacity="0.5"/>
          </svg>
        </div>
      </div>

      {/* Right Login Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-24 relative">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo mobile version */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-12">
            <img src={logo} alt="EMIT" className="w-12 h-12 object-contain" />
            <div className="text-text-dark text-left">
              <h2 className="text-2xl font-bold tracking-tight">EMIT</h2>
              <p className="text-[9px] font-medium opacity-60 uppercase">École de Management</p>
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-4xl font-display font-bold text-[#00215E] mb-2">Connexion</h1>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-error/10 border border-error/20 rounded-2xl flex items-center gap-3 text-error text-sm font-medium"
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2.5">
              <label className="text-sm font-bold text-[#00215E] ml-1">Email</label>
              <div className="relative group">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Entrez votre email"
                  className="w-full bg-white border border-slate-200 rounded-xl py-4 px-5 outline-none transition-all focus:border-[#00215E] focus:ring-4 focus:ring-[#00215E]/5 text-text-dark placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-sm font-bold text-[#00215E] ml-1">Mot de passe</label>
              <div className="relative group">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Entrez votre mot de passe"
                  className="w-full bg-white border border-slate-200 rounded-xl py-4 px-5 pr-14 outline-none transition-all focus:border-[#00215E] focus:ring-4 focus:ring-[#00215E]/5 text-text-dark placeholder:text-slate-400"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#00215E] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="text-right">
                <button type="button" className="text-sm font-medium text-[#00215E] hover:underline">Mot de passe oublié ?</button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#001D4A] hover:bg-[#00215E] text-white py-4.5 rounded-xl font-bold transition-all shadow-xl shadow-[#001D4A]/10 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <div className="mt-20 lg:mt-32 text-center">
            <p className="text-xs text-slate-400 font-medium tracking-tight">
              © {new Date().getFullYear()} EMIT - Tous droits réservés
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
