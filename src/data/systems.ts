import { FlooringSystem, SubstrateOption } from '../types';

export const FLOORING_SYSTEMS: FlooringSystem[] = [
  {
    id: 'high_gloss',
    name: 'Alto Brillo Mirror (High Gloss Resin)',
    nameEn: 'High Gloss Mirror Resin',
    tagline: 'Elegancia especular continua y máxima reflexión de luz interior',
    taglineEn: 'Seamless specular elegance and maximum interior light reflection',
    description: 'Sistema autonivelante de resina epóxica 100% sólidos. Crea una superficie sin juntas, impenetrable por líquidos, con un acabado espejo de reflejo perfecto. 100% VOC Free & OSHA Compliant.',
    descriptionEn: '100% solids self-leveling epoxy system. Creates a seamless surface impenetrable by liquids with a mirror-reflection finish. 100% VOC Free & OSHA Compliant.',
    basePricePerSqFt: 7.00,
    thicknessMm: '2.0 - 3.0 mm (80-120 mils)',
    cureTimeHours: 24,
    psiStrength: 8500,
    chemicalResistance: 'Alta (Aceites, Solventes, Limpiadores)',
    uvProtection: true,
    warrantyYears: 12,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    popularFor: ['Manhattan Penthouses', 'Commercial Showrooms', 'Corporate Lobbies', 'Luxury Car Garages'],
    features: ['Efecto espejo impecable', 'OSHA & ADA Compliant', 'Resistente a neumáticos calientes', 'Cero porosidad (100% Solids)'],
    availableColors: [
      { name: 'Blanco Espejo', hex: '#FFFFFF' },
      { name: 'Gris Titán', hex: '#64748B' },
      { name: 'Negro Obsidiana', hex: '#0F172A' },
      { name: 'Azul Zafiro', hex: '#0284C7' }
    ]
  },
  {
    id: 'metallic_3d',
    name: 'Metallic 3D / Liquid Marble',
    nameEn: 'Metallic 3D / Liquid Marble',
    tagline: 'Efectos fluidos orgánicos y profundidad de mármol líquido',
    taglineEn: 'Organic fluid movement and 3D liquid marble depth',
    description: 'Formulación artesanal de alta tecnología con nanopigmentos metálicos en suspensión. Cada piso es una pieza única irrepetible con efectos tridimensionales profundos.',
    descriptionEn: 'High-tech artisanal formulation infused with suspended metallic nanopigments. Every floor is an unrepeatable custom artwork with deep 3D effects.',
    basePricePerSqFt: 11.50,
    thicknessMm: '3.0 - 4.0 mm (120-160 mils)',
    cureTimeHours: 36,
    psiStrength: 9200,
    chemicalResistance: 'Excelente',
    uvProtection: true,
    warrantyYears: 15,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    popularFor: ['Greenwich & Tribeca Estates', 'VIP Restaurants & Lounges', 'Boutique Hotels', 'High-End Retail'],
    features: ['Efecto mármol o galaxia 3D', 'Acabado vitrificado ultra denso', 'Antibacteriano por naturaleza', 'Garantía Escrita de 15 Años'],
    availableColors: [
      { name: 'Oro / Negro Cósmico', hex: '#D97706' },
      { name: 'Plata & Mármol Calacatta', hex: '#E2E8F0' },
      { name: 'Azul Océano Metálico', hex: '#007BFF' },
      { name: 'Cobre Vulcanizado', hex: '#B45309' }
    ]
  },
  {
    id: 'granite_flakes',
    name: 'Epoxy Flakes / Granite Vinyl',
    nameEn: 'Epoxy Flakes / Granite Vinyl',
    tagline: 'Textura arquitectónica altamente resistente y antideslizante',
    taglineEn: 'High-durability architectural granite texture and slip-resistance',
    description: 'Sistema multicapa saturado con hojuelas de vinilo incrustadas en resina y sellado con poliaspártico de alta densidad. Aspecto de granito italiano con rápido curado.',
    descriptionEn: 'Full-broadcast multi-layer system with embedded vinyl flakes sealed with high-density polyaspartic clear coat. Italian granite aesthetic with 1-day cure.',
    basePricePerSqFt: 7.50,
    thicknessMm: '2.5 - 3.5 mm (100-140 mils)',
    cureTimeHours: 18,
    psiStrength: 9000,
    chemicalResistance: 'Extrema (Derrames de autos, Grasa)',
    uvProtection: true,
    warrantyYears: 15,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    popularFor: ['Suburban Garages (NJ/CT/DE/RI)', 'Crossfit Gyms', 'Outdoor Patios', 'Basements'],
    features: ['Oculta imperfecciones y polvo', 'Resiste neumático caliente', 'Antideslizante ADA Compliant', 'Curado rápido 1-Day Installation'],
    availableColors: [
      { name: 'Mezcla Granito Gris', hex: '#475569' },
      { name: 'Gris Basalto & Azul', hex: '#334155' },
      { name: 'Arena Tostada', hex: '#D97706' },
      { name: 'Blanco Nieve Flakes', hex: '#F8FAFC' }
    ]
  },
  {
    id: 'anti_slip',
    name: 'Industrial Quartz / Sanitary Anti-Slip',
    nameEn: 'Industrial Quartz / Sanitary Anti-Slip',
    tagline: 'Certificación de grado quirúrgico USDA/FDA y alta fricción',
    taglineEn: 'USDA/FDA surgical grade certification and high slip resistance',
    description: 'Revestimiento epóxico cuarzo-saturado con grado de rugosidad R11/R12. Resistente a choque térmico, ácidos concentrados y desinfección sanitaria rigurosa.',
    descriptionEn: 'Quartz-broadcast heavy epoxy coating with R11/R12 slip rating. Resists thermal shock, concentrated acids, and rigorous sanitary sanitization.',
    basePricePerSqFt: 9.50,
    thicknessMm: '3.0 - 5.0 mm (120-200 mils)',
    cureTimeHours: 24,
    psiStrength: 10500,
    chemicalResistance: 'Extrema / Grado Industrial Químico',
    uvProtection: false,
    warrantyYears: 10,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    popularFor: ['USDA/FDA Food Plants', 'Commercial Kitchens', 'Pharma Labs', 'Healthcare Facilities'],
    features: ['Cumple norma USDA, FDA & HACCP', 'Resistencia a choque térmico (-20°F a 220°F)', 'Cove base sanitario sin juntas', 'Antideslizante ADA Certificado'],
    availableColors: [
      { name: 'Verde Quirúrgico', hex: '#059669' },
      { name: 'Gris Industrial', hex: '#475569' },
      { name: 'Azul Seguridad', hex: '#0284C7' },
      { name: 'Rojo Tráfico', hex: '#DC2626' }
    ]
  },
  {
    id: 'basic_seal',
    name: 'Commercial Sealant / Dustproof Coating',
    nameEn: 'Commercial Sealant / Dustproof Coating',
    tagline: 'Protección antipolvo económica para pisos de concreto',
    taglineEn: 'Cost-effective dustproof seal coating for concrete floors',
    description: 'Imprimación y capa protectora de resina transparente o pigmentada. Elimina el desprendimiento de polvo del concreto e imparte durabilidad limpia.',
    descriptionEn: 'Penetrating primer and clear/pigmented resin topcoat. Eliminates concrete dusting and provides clean industrial durability.',
    basePricePerSqFt: 4.00,
    thicknessMm: '0.8 - 1.2 mm (30-50 mils)',
    cureTimeHours: 12,
    psiStrength: 6500,
    chemicalResistance: 'Moderada (Aceites ligeros, Agua)',
    uvProtection: false,
    warrantyYears: 5,
    image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80',
    popularFor: ['Logistics Warehouses (NJ/PA)', 'Subterranean Parking', 'Light Workshops'],
    features: ['Rápida aplicación y habilitación', 'Costo-eficiente por sq ft', 'Sella poros del concreto', 'OSHA Dust Abatement'],
    availableColors: [
      { name: 'Gris Neutro', hex: '#64748B' },
      { name: 'Transparente Vitrificado', hex: '#CBD5E1' }
    ]
  }
];

export const SUBSTRATE_OPTIONS: SubstrateOption[] = [
  {
    id: 'concrete_new',
    name: 'Concreto Nuevo (New Sound Concrete)',
    nameEn: 'New Sound Concrete',
    prepDescription: 'Preparación estándar mediante aspirado industrial HEPA y desbaste diamantado CSP-2.',
    prepDescriptionEn: 'Standard preparation via industrial HEPA vacuuming and CSP-2 diamond grinding.',
    extraPrepCostPerSqFt: 0,
    badge: 'Sin costo extra',
    badgeEn: 'No Extra Cost',
    iconName: 'CheckCircle2'
  },
  {
    id: 'concrete_cracked',
    name: 'Concreto Fisurado / Con Grietas',
    nameEn: 'Cracked / Damaged Concrete',
    prepDescription: 'Apertura en V de fisuras, cosido estructural con grapas de acero y masilla epóxica.',
    prepDescriptionEn: 'V-groove crack routing, structural stitching with steel staples, and high-strength epoxy filler.',
    extraPrepCostPerSqFt: 1.25,
    badge: '+$1.25 / sq ft',
    badgeEn: '+$1.25 / sq ft',
    iconName: 'Activity'
  },
  {
    id: 'old_paint',
    name: 'Concreto con Pintura Vieja / Descascarada',
    nameEn: 'Concrete with Old / Peeling Paint',
    prepDescription: 'Desbaste mecánico pesado diamantado para remoción total de capas ampolladas preexistentes.',
    prepDescriptionEn: 'Heavy-duty diamond mechanical grinding for complete removal of pre-existing blistered layers.',
    extraPrepCostPerSqFt: 1.00,
    badge: '+$1.00 / sq ft',
    badgeEn: '+$1.00 / sq ft',
    iconName: 'Flame'
  },
  {
    id: 'existing_tiles',
    name: 'Cerámica / Baldosa Previa (Tile Surface)',
    nameEn: 'Existing Ceramic / Tile Surface',
    prepDescription: 'Escarificado de esmalte cerámico, fijación de baldosas sueltas y puente de adherencia cuarzo.',
    prepDescriptionEn: 'Ceramic glaze scarification, loose tile bonding, and quartz-saturate adhesion tie-coat.',
    extraPrepCostPerSqFt: 1.75,
    badge: '+$1.75 / sq ft',
    badgeEn: '+$1.75 / sq ft',
    iconName: 'Grid'
  }
];
