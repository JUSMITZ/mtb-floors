import React from 'react';
import { MessageSquare } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const defaultMessage = encodeURIComponent(
    "Hola MTB FLOORS, acabo de usar su calculadora en sq ft y me gustaría agendar una visita técnica para mi proyecto en la región Tri-State / Northeast."
  );

  const whatsappUrl = `https://wa.me/13474844232?text=${defaultMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      id="whatsapp-floating-btn"
      className="fixed bottom-6 right-6 z-40 group flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 sm:px-5 rounded-full shadow-2xl shadow-emerald-600/40 hover:shadow-emerald-500/60 transition-all duration-300 hover:scale-105 border border-emerald-400/30"
      aria-label="Contactar por WhatsApp Business MTB FLOORS"
    >
      <div className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
      </div>

      <MessageSquare className="w-6 h-6 shrink-0 fill-white" />

      <div className="hidden sm:flex flex-col text-left">
        <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-100 font-bold">WHATSAPP BUSINESS</span>
        <span className="text-xs font-bold font-heading">Visita Técnica Directa</span>
      </div>
    </a>
  );
};
