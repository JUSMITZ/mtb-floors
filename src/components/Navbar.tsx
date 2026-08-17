import React, { useState } from 'react';
import { ShieldCheck, Cpu, Calculator, Sparkles, Layers, Menu, X, Truck, FileCheck, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenLeadModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenLeadModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navItems: { id: string; label: string; icon: any; badge?: string; highlight?: boolean }[] = [
    { id: 'inicio', label: t.nav.home, icon: Cpu },
    { id: 'calculadora', label: t.nav.calculator, icon: Calculator },
    { id: 'antes-despues-ny', label: t.nav.beforeAfter, icon: Sparkles },
    { id: 'coi-compliance', label: t.nav.coiCompliance, icon: FileCheck, badge: '$5M' },
    { id: 'servicios', label: t.nav.systems, icon: Layers },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    if (id === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2">
          
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => handleNavClick('inicio')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group min-w-0 shrink"
            id="navbar-logo"
          >
            {/* Architectural Isometric Floor Tile Isotype - Bronze & Charcoal */}
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 p-1.5 rounded-xl bg-stone-900 border border-[#C58535]/35 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-xs">
              <svg 
                viewBox="0 0 48 48" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-full h-full"
              >
                <defs>
                  <linearGradient id="mtbGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F3C892" />
                    <stop offset="50%" stopColor="#C58535" />
                    <stop offset="100%" stopColor="#8C5217" />
                  </linearGradient>
                </defs>
                {/* Isometric Architectural Floor Slab Structure */}
                <path d="M24 5L42 15L24 25L6 15L24 5Z" fill="url(#mtbGold)" />
                <path d="M6 15L24 25V43L6 33V15Z" fill="#1C1917" stroke="url(#mtbGold)" strokeWidth="1.2" />
                <path d="M42 15L24 25V43L42 33V15Z" fill="#292524" stroke="url(#mtbGold)" strokeWidth="1.2" />
                {/* Microcement/Epoxy Seamless Surface Refinement */}
                <path d="M24 10L35 16.2L24 22.5L13 16.2L24 10Z" fill="#FAFAF9" opacity="0.88" />
                <path d="M24 14L30 17.5L24 21L18 17.5L24 14Z" fill="url(#mtbGold)" opacity="0.9" />
              </svg>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-serif-heading font-bold text-sm sm:text-lg lg:text-xl tracking-wider text-stone-900 leading-none whitespace-nowrap">
                  MTB <span className="text-[#C58535] font-black">FLOORS</span>
                </span>
                <span className="text-[8px] sm:text-[9px] uppercase font-mono tracking-wider px-1 sm:px-1.5 py-0.5 rounded bg-[#C58535]/10 text-[#965C22] border border-[#C58535]/30 font-bold shrink-0">
                  {t.nav.badge}
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-stone-500 font-semibold tracking-tight mt-0.5 truncate max-w-[150px] xs:max-w-[190px] sm:max-w-none">
                Architectural Epoxy &amp; Microcement
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links (Spacious & Airy Grouping) */}
          <nav className="hidden xl:flex items-center gap-1 bg-stone-100/90 p-1.5 rounded-2xl border border-stone-200/80 shadow-2xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-xs font-bold'
                      : item.highlight
                      ? 'bg-[#007BFF]/10 text-[#007BFF] font-bold border border-[#007BFF]/20 hover:bg-[#007BFF] hover:text-white'
                      : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : item.highlight ? 'text-[#007BFF]' : 'text-stone-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-mono font-bold bg-amber-300 text-stone-900 px-1 rounded ml-0.5">
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#007BFF] animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs & Language Switcher [ 🇺🇸 EN | 🇪🇸 ES ] */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            
            {/* Elegant Top-Right Language Switcher */}
            <div className="flex items-center bg-stone-200/80 p-1 rounded-xl border border-stone-300 text-xs font-bold shadow-2xs">
              <button
                onClick={() => setLanguage('EN')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 text-xs ${
                  language === 'EN'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Switch to English"
              >
                <span>🇺🇸</span>
                <span>EN</span>
              </button>
              <button
                onClick={() => setLanguage('ES')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 text-xs ${
                  language === 'ES'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Cambiar a Español"
              >
                <span>🇪🇸</span>
                <span>ES</span>
              </button>
            </div>

            <button
              onClick={onOpenLeadModal}
              id="nav-lead-btn"
              className="px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:text-stone-900 border border-stone-300 bg-white shadow-2xs transition-all hidden md:flex items-center gap-1.5"
            >
              <span>{t.nav.catalogPdf}</span>
            </button>

            <button
              onClick={() => handleNavClick('showroom-movil')}
              id="nav-cta-showroom"
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-stone-900 hover:bg-[#007BFF] shadow-sm transition-all flex items-center gap-1.5 group"
            >
              <Truck className="w-3.5 h-3.5 text-amber-300 group-hover:text-white" />
              <span>{t.nav.bookShowroomBtn}</span>
            </button>
          </div>

          {/* Mobile Menu & Language Toggle */}
          <div className="xl:hidden flex items-center gap-2">
            
            {/* Mobile Language Pill */}
            <div className="flex items-center bg-stone-200 p-0.5 rounded-lg border border-stone-300 text-[11px] font-bold sm:hidden">
              <button
                onClick={() => setLanguage(language === 'EN' ? 'ES' : 'EN')}
                className="px-2 py-1 rounded bg-stone-900 text-white flex items-center gap-1"
              >
                <span>{language === 'EN' ? '🇺🇸 EN' : '🇪🇸 ES'}</span>
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-toggle"
              className="p-2 rounded-xl bg-stone-100 border border-stone-300 text-stone-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#FAF8F5] border-b border-stone-200 px-4 pt-2 pb-6 space-y-2 shadow-lg">
          
          {/* Language Selector inside Mobile Drawer */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-stone-100 border border-stone-200 mb-3">
            <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#007BFF]" />
              <span>Language / Idioma:</span>
            </span>
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-stone-300 text-xs font-bold">
              <button
                onClick={() => setLanguage('EN')}
                className={`px-3 py-1 rounded-md transition-all ${
                  language === 'EN' ? 'bg-stone-900 text-white' : 'text-stone-600'
                }`}
              >
                🇺🇸 English
              </button>
              <button
                onClick={() => setLanguage('ES')}
                className={`px-3 py-1 rounded-md transition-all ${
                  language === 'ES' ? 'bg-stone-900 text-white' : 'text-stone-600'
                }`}
              >
                🇪🇸 Español
              </button>
            </div>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-800 bg-white border border-stone-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-[#007BFF]" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono font-bold bg-amber-300 text-stone-900 px-1.5 py-0.5 rounded">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('showroom-movil')}
              className="w-full py-3 rounded-xl text-xs font-bold text-white bg-stone-900 flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4 text-amber-300" />
              <span>{t.nav.bookShowroomBtn}</span>
            </button>
            <button
              onClick={() => handleNavClick('calculadora')}
              className="w-full py-3 rounded-xl text-xs font-bold text-stone-900 bg-stone-200 border border-stone-300"
            >
              <span>{t.nav.calculator}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
