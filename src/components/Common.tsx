import React from 'react';
import { 
  GraduationCap, 
  Search, 
  X,
  Menu,
  Facebook, 
  Instagram, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import logo from '../assets/logo.png';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setIsMenuOpen(false); // Close menu on route change
  }, [location.pathname]);

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) {
      setSearchQuery(q);
    } else if (location.pathname !== '/search') {
      setSearchQuery('');
    }
  }, [location.pathname, location.search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value)}`, { replace: true });
    } else if (location.pathname === '/search') {
      navigate('/timetable'); // Or somewhere neutral
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (location.pathname === '/search') {
      navigate('/timetable');
    }
  };
  
  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Emplois du temps', path: '/timetable' },
    { name: 'À propos', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border h-16">
      <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img src={logo} alt="EMIT Logo" className="h-8 w-auto transition-transform group-hover:scale-105" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = link.path === '/' 
              ? location.pathname === '/' 
              : location.pathname.startsWith(link.path);
            
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative py-2 text-xs font-semibold transition-colors hover:text-primary ${
                  isActive ? 'text-primary' : 'text-text-muted'
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative group w-72 hidden lg:block">
          <div className="relative flex items-center">
            <Search className={`absolute left-3.5 transition-colors ${searchQuery ? 'text-primary' : 'text-text-muted'}`} size={14} />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Rechercher..."
              className="w-full bg-bg-light border border-border rounded-full py-2 pl-9 pr-9 text-xs focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={clearSearch}
                  className="absolute right-3 p-1 rounded-full text-text-muted hover:bg-slate-200 hover:text-primary transition-all"
                >
                  <X size={14} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 text-text-dark hover:bg-bg-light rounded-xl transition-colors"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu Overlay */}
       <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 top-16 z-40 bg-black/70 backdrop-blur-md lg:hidden"
              />

              {/* Drawer */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{
                  type: 'spring',
                  damping: 25,
                  stiffness: 200
                }}
                className="
                  fixed top-16 right-0
                  z-50
                  h-[calc(100vh-4rem)]
                  w-full
                  max-w-[300px]
                  overflow-y-auto
                  border-l border-border
                  bg-white
                  p-6
                  shadow-2xl
                  lg:hidden
                "
              >
                <div className="flex min-h-full flex-col justify-between">
                  
                  {/* Top Content */}
                  <div className="space-y-8">

                    {/* Mobile Search */}
                    <div className="relative">
                      <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                      />

                      <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Rechercher..."
                        className="w-full rounded-2xl border border-border bg-bg-light py-3 pl-10 pr-4 text-xs transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                      />
                    </div>

                    {/* Navigation */}
                    <div className="space-y-2">
                      {navLinks.map((link) => {
                        const isActive =
                          link.path === '/'
                            ? location.pathname === '/'
                            : location.pathname.startsWith(link.path);

                        return (
                          <Link
                            key={link.name}
                            to={link.path}
                            className={`flex items-center justify-between rounded-2xl p-4 transition-all ${
                              isActive
                                ? 'bg-primary font-bold text-white shadow-lg shadow-primary/20'
                                : 'font-medium text-text-muted hover:bg-bg-light hover:text-text-dark'
                            }`}
                          >
                            {link.name}

                            <ChevronRight
                              size={18}
                              className={
                                isActive
                                  ? 'opacity-100'
                                  : 'opacity-30'
                              }
                            />
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bottom Contact */}
                  <div className="space-y-4 border-t border-border pt-6">
                    <p className="px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
                      Contact Info
                    </p>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-xs text-text-muted">
                        <Phone
                          size={14}
                          className="text-primary/60"
                        />
                        +261 33 70 470 00
                      </div>

                      <div className="flex items-center gap-3 text-xs text-text-muted">
                        <Mail
                          size={14}
                          className="text-primary/60"
                        />
                        renseignement@emit.mg
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-secondary text-white pt-12 pb-8">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Column 1 */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <img src={logo} alt="EMIT Logo" className="h-8 w-auto brightness-0 invert" />
          </div>
          <p className="text-blue-100 text-xs leading-relaxed max-w-xs">
            École de Management et d’Innovation Technologique. Former des leaders compétents et innovants.
          </p>
          <div className="flex gap-3">
            <a href="https://www.facebook.com/emitfianarantsoa" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-blue-400/30 flex items-center justify-center hover:bg-white hover:text-primary transition-all">
              <Facebook size={16} />
            </a>
            <a href="#" className="w-9 h-9 rounded-full border border-blue-400/30 flex items-center justify-center hover:bg-white hover:text-primary transition-all">
              <Instagram size={16} />
            </a>
            <a href="#" className="w-9 h-9 rounded-full border border-blue-400/30 flex items-center justify-center hover:bg-white hover:text-primary transition-all">
              <Twitter size={16} />
            </a>
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-5">
          <h4 className="text-base font-bold">Liens utiles</h4>
          <ul className="space-y-2.5">
            {['Accueil', 'Emplois du temps', 'À propos', 'Contact'].map(item => (
              <li key={item}>
                <a href="#" className="text-blue-100 text-xs hover:text-white flex items-center gap-2 group">
                  <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3 */}
        <div className="space-y-5">
          <h4 className="text-base font-bold">Informations</h4>
          <div className="space-y-3.5">
            <div className="flex gap-2.5 items-start">
              <MapPin size={16} className="text-blue-300 shrink-0 mt-0.5" />
              <p className="text-blue-100 text-xs">Campus Andrainjato, B.P. 1500, Fianarantsoa 301</p>
            </div>
            <div className="flex gap-2.5 items-center">
              <Phone size={16} className="text-blue-300 shrink-0" />
              <p className="text-blue-100 text-xs">+261 33 70 470 00</p>
            </div>
            <div className="flex gap-2.5 items-center">
              <Mail size={16} className="text-blue-300 shrink-0" />
              <p className="text-blue-100 text-xs">renseignement@emit.mg</p>
            </div>
          </div>
        </div>

        {/* Column 4 */}
        <div className="space-y-5">
          <h4 className="text-base font-bold">Horaires</h4>
          <div className="space-y-3.5">
            <div className="flex gap-2.5 items-start">
              <Clock size={16} className="text-blue-300 shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-100 text-xs font-medium">Réception</p>
                <p className="text-blue-200 text-[10px] mt-1">Lundi - Vendredi: 08:00 - 17:30</p>
              </div>
            </div>
            <div className="pt-3 border-t border-blue-400/30">
              <p className="text-[10px] text-blue-300">Version 1.0.0</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 mt-12 pt-6 border-t border-blue-400/30 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-blue-300">
        <p>© {new Date().getFullYear()} EMIT. Tous droits réservés.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white">Mentions légales</a>
          <a href="#" className="hover:text-white">Confidentialité</a>
        </div>
      </div>
    </footer>
  );
};
