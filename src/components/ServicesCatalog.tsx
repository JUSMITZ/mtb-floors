import React, { useState } from 'react';
import { FLOORING_SYSTEMS } from '../data/systems';
import { FlooringSystem, SystemType } from '../types';
import { ShieldCheck, Zap, Clock, CheckCircle, ArrowRight, Layers, Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ServicesCatalogProps {
  onSelectSystemForCalc: (systemId: SystemType) => void;
  onSelectSystemForVis: (systemId: SystemType) => void;
}

export const ServicesCatalog: React.FC<ServicesCatalogProps> = ({
  onSelectSystemForCalc,
  onSelectSystemForVis,
}) => {
  const { language, t } = useLanguage();
  const [filterCategory, setFilterCategory] = useState<string>('todos');
  const [expandedSystemId, setExpandedSystemId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedSystemId(prev => prev === id ? null : id);
  };

  const filteredSystems = FLOORING_SYSTEMS.filter(sys => {
    if (filterCategory === 'todos') return true;
    if (filterCategory === 'lujo') return sys.id === 'high_gloss' || sys.id === 'metallic_3d';
    if (filterCategory === 'industrial') return sys.id === 'anti_slip' || sys.id === 'basic_seal';
    if (filterCategory === 'flakes') return sys.id === 'granite_flakes';
    return true;
  });

  const categories = language === 'EN' 
    ? [
        { id: 'todos', label: 'All Flooring Systems' },
        { id: 'lujo', label: 'Luxury & 3D Mirror' },
        { id: 'flakes', label: 'Flakes & Granite' },
        { id: 'industrial', label: 'Industrial & Heavy-Duty' },
      ]
    : [
        { id: 'todos', label: 'Todos los Sistemas' },
        { id: 'lujo', label: 'Lujo & Espejo 3D' },
        { id: 'flakes', label: 'Flakes & Granito' },
        { id: 'industrial', label: 'Industrial & Quirúrgico' },
      ];

  return (
    <section id="servicios" className="py-20 bg-[#FAF8F5] border-b border-stone-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 border border-stone-300 text-xs font-mono text-stone-900 font-semibold">
            <Layers className="w-3.5 h-3.5 text-[#007BFF]" />
            {t.servicesCatalog.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-heading font-bold text-stone-900">
            {t.servicesCatalog.title} <span className="text-[#007BFF]">{t.servicesCatalog.titleHighlight}</span>
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            {t.servicesCatalog.subtitle}
          </p>

          {/* Filter Categories */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterCategory(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  filterCategory === tab.id
                    ? 'bg-stone-900 text-white shadow-md'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSystems.map((sys) => {
            const isExpanded = expandedSystemId === sys.id;
            return (
              <div
                key={sys.id}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200 hover:border-stone-400 shadow-xs hover:shadow-lg transition-all flex flex-col group"
              >
                {/* Image Banner */}
                <div className="aspect-[16/10] relative overflow-hidden bg-stone-100">
                  <img
                    src={sys.image}
                    alt={sys.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-stone-900/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-mono font-bold text-amber-300 border border-stone-700">
                    ${sys.basePricePerSqFt.toFixed(2)} / sq ft
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-stone-900 border border-stone-200">
                    {sys.warrantyYears} Yr Warranty
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xl font-serif-heading font-bold text-stone-900 group-hover:text-[#007BFF] transition-colors">
                        {language === 'EN' ? sys.nameEn || sys.name : sys.name}
                      </h3>
                    </div>

                    <p className="text-stone-600 text-xs leading-relaxed line-clamp-2">
                      {language === 'EN' ? sys.descriptionEn || sys.description : sys.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs font-mono text-stone-500 pt-2 border-t border-stone-100">
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-700" />
                        <span>{sys.psiStrength.toLocaleString()} PSI</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#007BFF]" />
                        <span>{sys.cureTimeHours}h Cure</span>
                      </div>
                    </div>

                    {/* Accordion Toggle Button for Mobile Specs */}
                    <button
                      type="button"
                      onClick={() => toggleExpand(sys.id)}
                      className="w-full py-1.5 px-3 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-700 text-[11px] font-mono font-semibold flex items-center justify-between border border-stone-200 transition-colors"
                    >
                      <span>
                        {isExpanded
                          ? (language === 'EN' ? 'Hide Specifications ▲' : 'Ocultar Especificaciones ▲')
                          : (language === 'EN' ? 'View Specs & Data Sheet ▼' : 'Ver Ficha Técnica / Especificaciones ▼')}
                      </span>
                      <Info className="w-3.5 h-3.5 text-[#007BFF]" />
                    </button>

                    {/* Expandable Accordion Body */}
                    {isExpanded && (
                      <div className="pt-3 border-t border-stone-200 space-y-2 text-xs text-stone-600 animate-fadeIn bg-stone-50/70 p-3 rounded-xl border border-stone-200">
                        <div className="font-bold text-stone-900 text-[11px]">{language === 'EN' ? 'Popular for:' : 'Popular para:'}</div>
                        <ul className="list-disc list-inside space-y-1 text-[11px] text-stone-700">
                          {sys.popularFor.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                        <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-stone-600">
                          <span>{language === 'EN' ? 'Thickness:' : 'Espesor:'} <strong>{sys.thicknessMm}</strong></span>
                          <span>{language === 'EN' ? 'Resistance:' : 'Resistencia:'} <strong>{sys.chemicalResistance}</strong></span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Direct Action Buttons per Card */}
                  <div className="pt-2 grid grid-cols-2 gap-2 border-t border-stone-100">
                    <button
                      onClick={() => onSelectSystemForCalc(sys.id)}
                      className="w-full py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-[#007BFF] text-white font-heading font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>{t.servicesCatalog.calcPriceBtn}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onSelectSystemForVis(sys.id)}
                      className="w-full py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-900 font-heading font-bold text-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <span>{t.servicesCatalog.visualizeBtn}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
