import React, { useState, useEffect } from 'react';
import { SystemType } from '../types';
import { InteractiveBeforeAfter } from './InteractiveBeforeAfter';
import { VisualizerSection } from './Visualizer.tsx';
import { Sparkles, Sliders } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export type StudioTab = 'antes-despues' | 'simulador';

interface VisualStudioHubProps {
  activeTab?: string;
  initialSystemId?: SystemType;
  onNavigateToCalcWithSystem: (systemId: SystemType) => void;
  onSelectStudioTab?: (tab: StudioTab) => void;
}

export const VisualStudioHub: React.FC<VisualStudioHubProps> = ({
  activeTab,
  initialSystemId,
  onNavigateToCalcWithSystem,
  onSelectStudioTab,
}) => {
  const { language } = useLanguage();
  const [selectedTab, setSelectedTab] = useState<StudioTab>('simulador');

  // Sync with global activeTab from Navbar if user clicks "antes-despues-ny" or "visualizer"
  useEffect(() => {
    if (activeTab === 'antes-despues-ny') {
      setSelectedTab('antes-despues');
    } else if (activeTab === 'visualizer') {
      setSelectedTab('simulador');
    }
  }, [activeTab]);

  const handleTabChange = (tab: StudioTab) => {
    setSelectedTab(tab);
    if (onSelectStudioTab) {
      onSelectStudioTab(tab);
    }
  };

  return (
    <section id="estudio-visual" className="py-16 bg-[#FAF8F5] border-b border-stone-200 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Unified Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 border border-stone-300 text-xs font-mono text-stone-900 font-semibold shadow-xs">
            <Sparkles className="w-4 h-4 text-[#007BFF]" />
            {language === 'EN' ? 'INTERACTIVE VIRTUAL STUDIO' : 'ESTUDIO VIRTUAL E INTERACTIVO'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-heading font-bold text-stone-900">
            {language === 'EN' ? (
              <>Epoxy Flooring <span className="text-[#007BFF]">Visual Laboratory</span></>
            ) : (
              <>Laboratorio Visual de <span className="text-[#007BFF]">Pisos Epóxicos</span></>
            )}
          </h2>
          <p className="text-stone-600 text-sm max-w-xl mx-auto">
            {language === 'EN'
              ? 'Explore interactive tools. Simulate custom finishes in real-time with Gemini AI or compare Before & After transformations from real NYC projects.'
              : 'Explora las herramientas interactivas. Simula acabados en tiempo real con IA o compara transformaciones de Antes/Después en proyectos reales de NY.'}
          </p>
        </div>

        {/* Tab Module Selector Navigation Bar */}
        <div className="flex items-center justify-center mb-8">
          <div className="inline-flex p-1.5 bg-stone-200/80 rounded-2xl border border-stone-300 shadow-inner max-w-xl w-full sm:w-auto gap-1">
            
            <button
              onClick={() => handleTabChange('simulador')}
              id="tab-btn-simulador"
              className={`flex-1 sm:flex-initial py-2.5 px-5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                selectedTab === 'simulador'
                  ? 'bg-stone-900 text-white shadow-md'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#007BFF]" />
              <span>{language === 'EN' ? '1. Gemini AI Simulator' : '1. Simulador IA Gemini'}</span>
            </button>

            <button
              onClick={() => handleTabChange('antes-despues')}
              id="tab-btn-antes-despues"
              className={`flex-1 sm:flex-initial py-2.5 px-5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                selectedTab === 'antes-despues'
                  ? 'bg-stone-900 text-white shadow-md'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100/60'
              }`}
            >
              <Sliders className="w-4 h-4 text-amber-300" />
              <span>{language === 'EN' ? '2. Interactive Before / After' : '2. Antes / Después Interactivo'}</span>
            </button>

          </div>
        </div>

        {/* Dynamic Tab Module Rendered in Place */}
        <div className="transition-all duration-300">
          {selectedTab === 'simulador' && (
            <VisualizerSection
              initialSystemId={initialSystemId}
              onNavigateToCalcWithSystem={onNavigateToCalcWithSystem}
            />
          )}

          {selectedTab === 'antes-despues' && (
            <InteractiveBeforeAfter
              onNavigateToCalcWithSystem={onNavigateToCalcWithSystem}
            />
          )}
        </div>

      </div>
    </section>
  );
};

