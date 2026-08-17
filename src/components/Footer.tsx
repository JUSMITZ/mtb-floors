import React from 'react';
import { Cpu, ShieldCheck, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onNavigate: (tabId: string) => void;
  onOpenLeadModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenLeadModal }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-stone-900 text-stone-400 border-t border-stone-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#007BFF] flex items-center justify-center text-white font-bold">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <span className="font-serif-heading font-bold text-xl text-white">
                  MTB <span className="text-[#007BFF]">FLOORS</span>
                </span>
                <p className="text-[11px] text-stone-400">High-Tech Industrial & Luxury Resin</p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-stone-300 max-w-sm">
              Serving New York (NYC, Long Island, Westchester & Upstate), New Jersey, Connecticut, Pennsylvania & Greater Boston Area. 100% Solids VOC Free Resin.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-md bg-stone-800 text-[10px] font-mono text-amber-300 border border-amber-400/30 font-bold">
                COI $5M INSURED
              </span>
              <span className="px-2.5 py-1 rounded-md bg-stone-800 text-[10px] font-mono text-stone-200 border border-stone-700 font-bold">
                HEPA DUSTLESS SANDING
              </span>
              <span className="px-2.5 py-1 rounded-md bg-stone-800 text-[10px] font-mono text-stone-200 border border-stone-700 font-bold">
                IIC/STC SOUNDPROOF
              </span>
              <span className="px-2.5 py-1 rounded-md bg-stone-800 text-[10px] font-mono text-amber-300 border border-amber-400/30 font-bold">
                MOBILE SHOWROOM VAN
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-serif-heading font-bold text-white text-xs uppercase tracking-wider">{t.footer.modulesTitle}</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onNavigate('inicio')} className="hover:text-white">{t.nav.home}</button></li>
              <li><button onClick={() => onNavigate('antes-despues-ny')} className="hover:text-white text-amber-300 font-bold">{t.nav.beforeAfter}</button></li>
              <li><button onClick={() => onNavigate('coi-compliance')} className="hover:text-white text-amber-300 font-semibold">{t.nav.coiCompliance}</button></li>
              <li><button onClick={() => onNavigate('showroom-movil')} className="hover:text-white text-emerald-400 font-semibold">{t.nav.showroom}</button></li>
              <li><button onClick={() => onNavigate('servicios')} className="hover:text-white">{t.nav.systems}</button></li>
              <li><button onClick={() => onNavigate('calculadora')} className="hover:text-white">{t.nav.calculator}</button></li>
            </ul>
          </div>

          {/* Technical Services */}
          <div className="space-y-3">
            <h4 className="font-serif-heading font-bold text-white text-xs uppercase tracking-wider">{t.footer.coverageTitle}</h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li className="font-semibold text-stone-200">New York (NYC, Long Island, Upstate)</li>
              <li className="font-semibold text-stone-200">New Jersey (North & Central NJ)</li>
              <li className="font-semibold text-stone-200">Connecticut (Greenwich, Stamford)</li>
              <li className="font-semibold text-stone-200">Pennsylvania (Philly & Lehigh)</li>
              <li className="font-semibold text-stone-200">Massachusetts (Greater Boston)</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="font-serif-heading font-bold text-white text-xs uppercase tracking-wider">Contact & Headquarters</h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-300" />
                <span>+1 (800) 555-MTB1 (6821)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-300" />
                <span>quotes@mtbfloors.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
                <span>NYC HQ: 5th Ave, Manhattan, NY 10001</span>
              </li>
              <li className="pt-2">
                <button
                  onClick={onOpenLeadModal}
                  className="px-3 py-1.5 rounded-lg bg-stone-800 text-amber-300 text-[11px] font-bold border border-amber-400/30 hover:bg-stone-700"
                >
                  📘 {t.footer.downloadGuide}
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} MTB FLOORS LLC. {t.footer.rightsReserved}</p>
          <div className="flex items-center gap-6">
            <span>Privacy & Compliance</span>
            <span>Warranty Terms</span>
            <span>ICRI Standards</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
