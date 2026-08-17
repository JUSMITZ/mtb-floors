import React, { useState } from 'react';
import { BookOpen, Download, Mail, User, CheckCircle2, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LeadMagnetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeadMagnetModal: React.FC<LeadMagnetModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await fetch('/api/lead-magnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });
    } catch (err) {
      console.error(err);
    }

    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-2xl">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-stone-100 text-stone-500 hover:text-stone-900"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div className="space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-stone-900">
              <BookOpen className="w-6 h-6 text-[#007BFF]" />
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold text-[#007BFF] uppercase tracking-wider">
                {language === 'EN' ? 'FREE TECHNICAL RESOURCE' : 'IMÁN DE CLIENTES POTENCIALES - RECURSO GRATUITO'}
              </span>
              <h3 className="font-serif-heading font-bold text-2xl text-stone-900 mt-1">
                {language === 'EN' ? 'Free Guide: How to Prepare Concrete for Epoxy' : 'Guía Gratuita: Cómo preparar tu piso para resina'}
              </h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                {language === 'EN'
                  ? 'Learn ICRI standards, concrete moisture testing, CSP profile roughness, and anti-blistering techniques.'
                  : 'Aprende los estándares de la norma ICRI, medición de humedad del concreto, perfil de rugosidad CSP y técnicas para evitar el ampollado de la resina.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-stone-700 font-semibold block mb-1">
                  {language === 'EN' ? 'Full Name:' : 'Nombre Completo:'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder={language === 'EN' ? 'e.g. Eng. Alexander Smith' : 'Ej: Ing. Alejandro Morales'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:border-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-stone-700 font-semibold block mb-1">
                  {language === 'EN' ? 'Email Address:' : 'Correo Electrónico:'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder={language === 'EN' ? 'example@company.com' : 'ejemplo@empresa.com'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:border-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="lead-submit-modal-btn"
                className="w-full py-3.5 px-4 rounded-xl font-heading font-bold text-xs text-white bg-stone-900 hover:bg-[#007BFF] shadow-md transition-all flex items-center justify-center gap-2 pt-3"
              >
                <Download className="w-4 h-4" />
                <span>{language === 'EN' ? 'DOWNLOAD INSTANT PDF TECHNICAL GUIDE' : 'DESCARGAR GUÍA TÉCNICA PDF EN INSTANTES'}</span>
              </button>
            </form>

            <div className="text-[10px] text-stone-500 text-center">
              🔒 {language === 'EN' ? 'We respect your privacy. Zero spam, high-value engineering content only.' : 'Respetamos tu privacidad. Cero spam, solo contenido técnico de valor.'}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-serif-heading font-bold text-2xl text-stone-900">
              {language === 'EN' ? 'Guide Sent Successfully!' : '¡Guía Enviada Exitosamente!'}
            </h3>

            <p className="text-xs text-stone-600">
              {language === 'EN' ? (
                <>Thank you, <strong className="text-stone-900">{name}</strong>. We sent the 15-page PDF download link to <strong className="text-[#007BFF]">{email}</strong>.</>
              ) : (
                <>Gracias, <strong className="text-stone-900">{name}</strong>. Hemos enviado el enlace de descarga del PDF de 15 páginas a <strong className="text-[#007BFF]">{email}</strong>.</>
              )}
            </p>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800"
            >
              {language === 'EN' ? 'Back to Application' : 'Volver a la Aplicación'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
