import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesCatalog } from './components/ServicesCatalog';
import { CoopBoardCompliance } from './components/CoopBoardCompliance';
import { MobileShowroomBooking } from './components/MobileShowroomBooking';
import { CalculatorSection } from './components/Calculator';
import { VisualStudioHub } from './components/VisualStudioHub';
import { BlogSection } from './components/BlogSection';
import { LeadMagnetModal } from './components/LeadMagnetModal';
import { WhatsAppButton } from './components/WhatsAppButton';
import { StickyMobileBar } from './components/StickyMobileBar';
import { Footer } from './components/Footer';
import { SystemType } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('inicio');
  const [selectedSystemForCalc, setSelectedSystemForCalc] = useState<SystemType | undefined>(undefined);
  const [selectedSystemForVis, setSelectedSystemForVis] = useState<SystemType | undefined>(undefined);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState<boolean>(false);

  const scrollToTab = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tabId === 'antes-despues-ny' || tabId === 'visualizer') {
      const el = document.getElementById('estudio-visual');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      const el = document.getElementById(tabId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleNavigateToCalcWithSystem = (sysId: SystemType) => {
    setSelectedSystemForCalc(sysId);
    scrollToTab('calculadora');
  };

  const handleNavigateToVisWithSystem = (sysId: SystemType) => {
    setSelectedSystemForVis(sysId);
    scrollToTab('visualizer');
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col selection:bg-amber-300 selection:text-stone-900 font-sans">
        
        {/* Navigation Header */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={scrollToTab}
          onOpenLeadModal={() => setIsLeadModalOpen(true)}
        />

        {/* Main Content Sections */}
        <main className="flex-1 pb-16 md:pb-0">
          
          {/* Section 1: Hero Section */}
          <Hero
            onNavigate={scrollToTab}
            onOpenLeadModal={() => setIsLeadModalOpen(true)}
          />

          {/* Section 2: Módulo Interactivo - Estudio Visual Epóxico (Simulador IA Gemini & Antes/Después) */}
          <VisualStudioHub
            activeTab={activeTab}
            initialSystemId={selectedSystemForVis}
            onNavigateToCalcWithSystem={handleNavigateToCalcWithSystem}
          />

          {/* Section 3: Módulo Calculadora Inteligente por Sq Ft ($ USD) */}
          <CalculatorSection
            initialSystemId={selectedSystemForCalc}
          />

          {/* Section 4: Systems & Epoxy Catalog */}
          <ServicesCatalog
            onSelectSystemForCalc={handleNavigateToCalcWithSystem}
            onSelectSystemForVis={handleNavigateToVisWithSystem}
          />

          {/* Section 5: Cumplimiento COI $5M & Co-Op / Condo Boards NYC & Dustless HEPA */}
          <CoopBoardCompliance />

          {/* Section 6: Showroom Móvil a tu Puerta (NY, NJ, CT, PA, DE, RI) */}
          <MobileShowroomBooking />

          {/* Section 7: Blog Técnico & Guías */}
          <BlogSection
            onOpenLeadModal={() => setIsLeadModalOpen(true)}
          />

        </main>

        {/* Footer */}
        <Footer
          onNavigate={scrollToTab}
          onOpenLeadModal={() => setIsLeadModalOpen(true)}
        />

        {/* Lead Magnet Free Guide Modal */}
        <LeadMagnetModal
          isOpen={isLeadModalOpen}
          onClose={() => setIsLeadModalOpen(false)}
        />

        {/* Floating WhatsApp Direct Business Action */}
        <WhatsAppButton />

        {/* Sticky Bottom Bar for Mobile */}
        <StickyMobileBar
          onNavigateToCalc={() => scrollToTab('calculadora')}
        />

      </div>
    </LanguageProvider>
  );
}
