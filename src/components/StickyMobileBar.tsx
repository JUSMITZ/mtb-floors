import React, { useState, useEffect } from 'react';
import { Calculator, MessageSquare, Sparkles } from 'lucide-react';

interface StickyMobileBarProps {
  onNavigateToCalc: () => void;
  quoteTotal?: number;
}

export const StickyMobileBar: React.FC<StickyMobileBarProps> = ({ onNavigateToCalc }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after scrolling down 100px for instant mobile utility
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  const defaultMessage = encodeURIComponent(
    "Hola MTB FLOORS, estoy navegando en la web y quisiera solicitar información sobre cotizaciones y agendar visita técnica."
  );

  const whatsappUrl = `https://wa.me/18005556821?text=${defaultMessage}`;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-stone-900/95 backdrop-blur-xl border-t border-stone-800 p-2.5 pb-3 shadow-2xl transition-all duration-300">
      <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
        <button
          onClick={onNavigateToCalc}
          className="min-h-[48px] py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-900 font-heading font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-transform"
        >
          <Calculator className="w-4 h-4 shrink-0 text-stone-950" />
          <span className="truncate">🧮 Calculadora</span>
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[48px] py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-transform border border-emerald-500"
        >
          <MessageSquare className="w-4 h-4 shrink-0 fill-white text-white" />
          <span className="truncate">💬 WhatsApp Directo</span>
        </a>
      </div>
    </div>
  );
};
