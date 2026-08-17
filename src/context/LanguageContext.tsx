import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'EN' | 'ES';

export interface Translations {
  nav: {
    home: string;
    showroom: string;
    calculator: string;
    beforeAfter: string;
    coiCompliance: string;
    systems: string;
    gallery: string;
    catalogPdf: string;
    bookShowroomBtn: string;
    badge: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleHighlight: string;
    titleLine2: string;
    subtitle: string;
    estimateBtn: string;
    bookVanBtn: string;
    stat1Label: string;
    stat1Val: string;
    stat2Label: string;
    stat2Val: string;
    stat3Label: string;
    stat3Val: string;
    coiBadge: string;
  };
  studioHub: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    tab1: string;
    tab2: string;
    tab3: string;
  };
  coiSection: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
    guaranteeTitle: string;
    guaranteeDesc: string;
    ctaBtn: string;
  };
  showroomSection: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    formTitle: string;
    nameLabel: string;
    phoneLabel: string;
    emailLabel: string;
    stateLabel: string;
    cityLabel: string;
    notesLabel: string;
    submitBtn: string;
    guarantee: string;
  };
  calculator: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    sqFtLabel: string;
    substrateLabel: string;
    systemLabel: string;
    locationLabel: string;
    summaryTitle: string;
    totalInvestment: string;
    discountBadge: string;
    downloadQuoteBtn: string;
    bookVisitBtn: string;
  };
  servicesCatalog: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    calcPriceBtn: string;
    visualizeBtn: string;
  };
  catalog: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    quoteBtn: string;
    testAiBtn: string;
    specSheetBtn: string;
  };
  gallery: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    magnifierBadge: string;
    modalTitle: string;
  };
  footer: {
    brandDesc: string;
    quickLinks: string;
    systemsTitle: string;
    complianceTitle: string;
    contactTitle: string;
    coiStatement: string;
    copyright: string;
    modulesTitle: string;
    coverageTitle: string;
    downloadGuide: string;
    rightsReserved: string;
  };
}

const translations: Record<Language, Translations> = {
  EN: {
    nav: {
      home: 'Home',
      showroom: 'Mobile Van',
      calculator: 'Sq Ft Estimator',
      beforeAfter: 'NY Before/After',
      coiCompliance: '$5M COI Board Approval',
      systems: 'Systems',
      gallery: 'Inspection Gallery',
      catalogPdf: 'Catalog PDF Guide',
      bookShowroomBtn: 'Book Mobile Van NY',
      badge: 'NYC LUXURY',
    },
    hero: {
      badge: 'COI $5M INSURED • DUSTLESS HEPA • TRI-STATE NYC',
      titleLine1: 'Mirror-Gloss Architectural Epoxy & Microcement for ',
      titleHighlight: 'NYC Lofts & Condos',
      titleLine2: '',
      subtitle: 'Dustless diamond preparation, 100% solids seamless epoxy resin, and instant $5M Certificate of Insurance (COI) tailored for Manhattan, Brooklyn & Queens Co-Op and Condo boards.',
      estimateBtn: 'Estimate Sq Ft Cost',
      bookVanBtn: 'Book Mobile Showroom Van',
      stat1Label: 'COI Insurance Liability',
      stat1Val: '$5,000,000',
      stat2Label: 'Dustless HEPA Extraction',
      stat2Val: '99.97%',
      stat3Label: 'Board Approval Rate',
      stat3Val: '100%',
      coiBadge: '$5M COI Approved Contractor for NYC Buildings',
    },
    studioHub: {
      badge: '3-IN-1 INTERACTIVE VIRTUAL STUDIO & GALLERY',
      title: 'Epoxy & Microcement ',
      titleHighlight: 'Visual Laboratory',
      description: 'Switch between tabs to simulate custom finishes with Gemini AI, explore real NYC loft transformations, or inspect specular clarity with our 2.5X optical magnifier lens.',
      tab1: '1. NY Before/After',
      tab2: '2. AI Floor Simulator',
      tab3: '3. 2.5X Magnifier Gallery',
    },
    coiSection: {
      badge: 'EXCLUSIVE NYC & TRI-STATE COMPLIANCE',
      title: '$5M COI Insurance Certificate & ',
      titleHighlight: 'Co-Op / Condo Board Approval',
      subtitle: 'In Manhattan & Brooklyn, 80% of high-end residential buildings require a $5,000,000 Commercial General Liability COI before any work begins. MTB manages 100% of board approvals.',
      feature1Title: '$5,000,000 COI Insurance Guarantee',
      feature1Desc: 'We issue custom Certificates of Insurance naming your building board and management company as additional insured within 2 hours.',
      feature2Title: 'Dustless HEPA Diamond Grinding (CSP-2/3)',
      feature2Desc: 'Industrial HEPA extractors collect 99.97% of airborne micro-dust, keeping hallway air and neighboring units completely pristine.',
      feature3Title: 'Acoustic Soundproofing (IIC / STC Standards)',
      feature3Desc: 'High-density polyaspartic and elastomeric underlayments that strictly comply with NYC residential floor impact acoustic regulations.',
      guaranteeTitle: '100% Board Approval Guarantee',
      guaranteeDesc: 'We handle all paperwork, building architect reviews, and elevator protection protocols directly with your super.',
      ctaBtn: 'Request Instant $5M COI for My Building',
    },
    showroomSection: {
      badge: 'MOBILE SHOWROOM AT YOUR DOOR',
      title: 'Book Our Physical Sample Van in ',
      titleHighlight: 'NY, NJ, CT, PA, DE & RI',
      subtitle: 'Feel real cured epoxy slabs, metallic 3D samples, microcement textures, and flake finishes right inside your space before making any decision.',
      step1Title: 'Select Your Location',
      step1Desc: 'We service all 5 NYC boroughs, Long Island, Westchester, New Jersey, Connecticut, Pennsylvania, Delaware & Rhode Island.',
      step2Title: 'Physical Sample Demonstration',
      step2Desc: 'Our van arrives with over 40 physical architectural slabs, color swatches, and lighting testing fixtures.',
      step3Title: 'On-Site Laser Measurement',
      step3Desc: 'Receive a guaranteed fixed-price proposal on the spot after precise laser substrate measurement.',
      formTitle: 'Schedule Mobile Showroom Visit',
      nameLabel: 'Full Name',
      phoneLabel: 'Phone Number',
      emailLabel: 'Email Address',
      stateLabel: 'State / Region',
      cityLabel: 'City / Neighborhood',
      notesLabel: 'Project Notes / Sq Ft (Optional)',
      submitBtn: 'Confirm Mobile Van Booking',
      guarantee: 'Free visit with zero purchase obligation • Full Tri-State coverage',
    },
    calculator: {
      badge: 'MODULE 1: SMART SQ FT ESTIMATOR',
      title: 'Transparent Price Calculator by ',
      titleHighlight: 'Square Feet ($ USD)',
      subtitle: 'Official rate schedule for New York, New Jersey, Connecticut, Pennsylvania, and Massachusetts. Automatic industrial volume discounts included.',
      sqFtLabel: 'Total Area in Square Feet (Sq Ft)',
      substrateLabel: 'Current Substrate Condition',
      systemLabel: 'Select Epoxy / Microcement System',
      locationLabel: 'Project Environment (Indoor / Outdoor)',
      summaryTitle: 'Quote Summary',
      totalInvestment: 'Estimated Total Investment',
      discountBadge: 'VOLUME DISCOUNT APPLIED',
      downloadQuoteBtn: 'Download Formal PDF Quote',
      bookVisitBtn: 'Book Free On-Site Inspection',
    },
    servicesCatalog: {
      badge: 'ARCHITECTURAL RESIN CATALOG',
      title: 'High-Performance ',
      titleHighlight: 'Flooring Systems',
      subtitle: '100% solids epoxy, polyaspartic flakes, and 3D metallic resins tailored for NYC lofts, commercial spaces, and industrial facilities.',
      calcPriceBtn: 'Quote Price',
      visualizeBtn: 'Visualize in AI',
    },
    catalog: {
      badge: 'ARCHITECTURAL EPOXY & MICROCEMENT SYSTEMS',
      title: 'High-Performance ',
      titleHighlight: 'Resin Flooring Systems',
      subtitle: '100% solids formulation engineered for extreme durability, chemical resistance, zero VOC emissions, and mirror-gloss aesthetic beauty.',
      quoteBtn: 'Quote Sq Ft Price',
      testAiBtn: 'Test in AI Studio',
      specSheetBtn: 'View Full Spec Sheet',
    },
    gallery: {
      badge: 'LIVE OPTICAL PRECISION MAGNIFIER',
      title: 'Mirror-Gloss Inspection & ',
      titleHighlight: 'Zero-Porosity Verification',
      subtitle: 'Hover your cursor over any project photo or open the enlarged inspector to activate the 2.5X Optical Lens and verify zero bubbles, zero pores, and glass reflections.',
      magnifierBadge: '2.5X OPTICAL MAGNIFIER',
      modalTitle: 'High-Precision Substrate Inspector',
    },
    footer: {
      brandDesc: 'New York’s premier architectural epoxy resin and microcement flooring contractor. Specializing in Manhattan & Brooklyn loft transformations, commercial showrooms, and luxury residences.',
      quickLinks: 'Navigation',
      systemsTitle: 'Resin Systems',
      complianceTitle: 'NYC Board Compliance',
      contactTitle: 'Tri-State Office',
      coiStatement: 'MTB Epoxy & Microcement carries $5,000,000 USD Commercial General Liability Insurance & Workers Compensation. COI issued upon request.',
      copyright: '© 2026 PISOS DE MTB - Architectural Epoxy & Microcement LLC. All rights reserved.',
      modulesTitle: 'Navigation Modules',
      coverageTitle: 'Tri-State Coverage Area',
      downloadGuide: 'Download NYC Specs PDF',
      rightsReserved: 'All rights reserved.',
    },
  },
  ES: {
    nav: {
      home: 'Inicio',
      showroom: 'Showroom Móvil',
      calculator: 'Calculadora Sq Ft',
      beforeAfter: 'Antes / Después NY',
      coiCompliance: 'COI $5M Board NY',
      systems: 'Sistemas',
      gallery: 'Galería Lupa',
      catalogPdf: 'Guía Catálogo PDF',
      bookShowroomBtn: 'Agendar Showroom NY',
      badge: 'NYC LUXURY',
    },
    hero: {
      badge: 'SEGURO COI $5M • ASPIRACIÓN HEPA • TRI-STATE NY',
      titleLine1: 'Pisos Epóxicos & Microcemento de Alto Brillo Espejo para ',
      titleHighlight: 'Lofts & Condos en NY',
      titleLine2: '',
      subtitle: 'Preparación diamantada sin polvo, resina 100% sólidos sin juntas y certificado COI de $5M al instante para juntas de administración Co-Op y Condo en Manhattan, Brooklyn y Queens.',
      estimateBtn: 'Calcular Costo por Sq Ft',
      bookVanBtn: 'Agendar Showroom Móvil',
      stat1Label: 'Seguro Cobertura COI',
      stat1Val: '$5,000,000',
      stat2Label: 'Extracción de Polvo HEPA',
      stat2Val: '99.97%',
      stat3Label: 'Tasa Aprobación Juntas',
      stat3Val: '100%',
      coiBadge: 'Contratista Aprobado con COI $5M para Edificios de NY',
    },
    studioHub: {
      badge: 'ESTUDIO VIRTUAL Y GALERÍA DEDICADA 3-EN-1',
      title: 'Laboratorio Visual de ',
      titleHighlight: 'Pisos Epóxicos',
      description: 'Cambia entre pestañas para simular acabados con Inteligencia Artificial Gemini, explorar transformaciones reales en lofts de NY o inspeccionar el brillo con la lupa de precisión 2.5X.',
      tab1: '1. Antes / Después NY',
      tab2: '2. Simulador IA Gemini',
      tab3: '3. Galería Lupa 2.5X',
    },
    coiSection: {
      badge: 'EXCLUSIVO NUEVA YORK & TRI-STATE',
      title: 'Certificado COI de $5M & ',
      titleHighlight: 'Aprobación Co-Op / Condo',
      subtitle: 'En Manhattan y Brooklyn, el 80% de los edificios residenciales exigen un seguro de responsabilidad comercial COI de $5,000,000 USD antes de iniciar obras. MTB gestiona el 100% de los trámites.',
      feature1Title: 'Garantía de Seguro COI por $5,000,000 USD',
      feature1Desc: 'Emitimos certificados de seguro nombrando a la junta de tu edificio y la administración como asegurados adicionales en menos de 2 horas.',
      feature2Title: 'Desbaste Diamantado Sin Polvo HEPA (CSP-2/3)',
      feature2Desc: 'Extractores industriales HEPA capturan el 99.97% del micro-polvo, manteniendo los pasillos e inmuebles vecinos impecables.',
      feature3Title: 'Insonorización Acústica (Normas IIC / STC)',
      feature3Desc: 'Bases poliaspárticas y elastoméricas de alta densidad que cumplen estrictamente con la normativa de impacto acústico en pisos residenciales de NY.',
      guaranteeTitle: 'Garantía de Aprobación 100% por Juntas de NY',
      guaranteeDesc: 'Nos encargamos del papeleo, revisión con arquitectos del edificio y protección de elevadores directamente con el superintendente.',
      ctaBtn: 'Solicitar COI de $5M para Mi Edificio',
    },
    showroomSection: {
      badge: 'SHOWROOM A TU PUERTA',
      title: 'Reserva Nuestra Van de Muestras Físicas en ',
      titleHighlight: 'NY, NJ, CT, PA, DE & RI',
      subtitle: 'Toca los acabados epóxicos curados, muestras tridimensionales, microcemento y hojuelas directo en tu espacio antes de tomar cualquier decisión.',
      step1Title: 'Selecciona tu Ubicación',
      step1Desc: 'Atendemos los 5 condados de NY, Long Island, Westchester, New Jersey, Connecticut, Pennsylvania, Delaware y Rhode Island.',
      step2Title: 'Demostración de Muestras Reales',
      step2Desc: 'Nuestra van llega con más de 40 losas físicas arquitectónicas, muestreos de color y luces de prueba.',
      step3Title: 'Medición Láser In Situ',
      step3Desc: 'Recibe una propuesta formal a precio cerrado al instante tras la medición precisa de tu sustrato.',
      formTitle: 'Agendar Visita de Showroom Móvil',
      nameLabel: 'Nombre Completo',
      phoneLabel: 'Teléfono de Contacto',
      emailLabel: 'Correo Electrónico',
      stateLabel: 'Estado / Región',
      cityLabel: 'Ciudad / Barrio',
      notesLabel: 'Notas del Proyecto / Sq Ft (Opcional)',
      submitBtn: 'Confirmar Reserva de Van Móvil',
      guarantee: 'Visita gratuita sin compromiso de compra • Cobertura total Tri-State',
    },
    calculator: {
      badge: 'MÓDULO 1: CALCULADORA DE PRESUPUESTO INTELIGENTE',
      title: 'Cotizador Transparente por ',
      titleHighlight: 'Pies Cuadrados (Sq Ft)',
      subtitle: 'Tarifas oficiales para New York, New Jersey, Connecticut, Pennsylvania y Massachusetts. Descuentos automáticos por volumen industrial.',
      sqFtLabel: 'Superficie Total en Pies Cuadrados (Sq Ft)',
      substrateLabel: 'Estado Actual del Sustrato de Concreto',
      systemLabel: 'Seleccionar Sistema Epóxico / Microcemento',
      locationLabel: 'Entorno del Proyecto (Interior / Exterior)',
      summaryTitle: 'Resumen de Cotización',
      totalInvestment: 'Inversión Total Estimada',
      discountBadge: 'DESCUENTO POR VOLUMEN APLICADO',
      downloadQuoteBtn: 'Descargar Cotización Formal PDF',
      bookVisitBtn: 'Agendar Visita Técnica Directa',
    },
    servicesCatalog: {
      badge: 'CATÁLOGO DE RESINAS ARQUITECTÓNICAS',
      title: 'Sistemas de Pisos de ',
      titleHighlight: 'Alto Rendimiento',
      subtitle: 'Epóxico 100% sólidos, hojuelas poliaspárticas y resinas metálicas 3D diseñadas para lofts de NYC, espacios comerciales e instalaciones industriales.',
      calcPriceBtn: 'Cotizar Precio',
      visualizeBtn: 'Visualizar en IA',
    },
    catalog: {
      badge: 'SISTEMAS EPÓXICOS & MICROCEMENTO ARQUITECTÓNICO',
      title: 'Sistemas de Resina de ',
      titleHighlight: 'Alto Rendimiento',
      subtitle: 'Formulación 100% sólidos diseñada para durabilidad extrema, resistencia química, cero emisiones COV y belleza estética de brillo espejo.',
      quoteBtn: 'Cotizar Sq Ft',
      testAiBtn: 'Probar en IA',
      specSheetBtn: 'Ver Ficha Técnica Completa',
    },
    gallery: {
      badge: 'INSPECCIÓN DE PRECISIÓN ÓPTICA EN VIVO',
      title: 'Inspección de Brillo Espejo & ',
      titleHighlight: 'Cero Porosidad',
      subtitle: 'Pasa el cursor sobre cualquier foto o abre la vista ampliada para activar la Lupa Óptica 2.5X y verificar la ausencia de poros, burbujas y la nitidez del recubrimiento.',
      magnifierBadge: 'LUPA ÓPTICA 2.5X',
      modalTitle: 'Inspector Óptico de Sustrato',
    },
    footer: {
      brandDesc: 'Contratista líder en Nueva York de recubrimientos epóxicos y microcemento arquitectónico. Especialistas en lofts de Manhattan y Brooklyn, showrooms comerciales y residencias de lujo.',
      quickLinks: 'Navegación',
      systemsTitle: 'Sistemas de Resina',
      complianceTitle: 'Cumplimiento NY Board',
      contactTitle: 'Oficina Tri-State',
      coiStatement: 'MTB Epoxy & Microcement cuenta con Seguro de Responsabilidad General de $5,000,000 USD y Compensación de Trabajadores. Certificado COI a solicitud.',
      copyright: '© 2026 PISOS DE MTB - Architectural Epoxy & Microcement LLC. Todos los derechos reservados.',
      modulesTitle: 'Módulos de Navegación',
      coverageTitle: 'Área de Cobertura Tri-Estatal',
      downloadGuide: 'Descargar Guía Técnica PDF',
      rightsReserved: 'Todos los derechos reservados.',
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('EN'); // Default to EN as requested

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'EN' ? 'ES' : 'EN'));
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
