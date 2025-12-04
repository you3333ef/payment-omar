import { CreditCard, Building2, Truck, Plane } from 'lucide-react';

export type CourierID =
  | 'fedex' | 'dhl' | 'aramex' | 'ups' | 'smsa' | 'spl'
  | 'imile' | 'jt' | 'aymakan' | 'postaplus' | 'ubex'
  | 'emirates_post' | 'zajil' | 'naqel';

export interface ThemeConfig {
  id: CourierID;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
  };
  logo: string; // Path to logo image
  direction: 'rtl' | 'ltr';
}

export const couriers: Record<CourierID, ThemeConfig> = {
  aramex: {
    id: 'aramex',
    name: 'Aramex',
    colors: { primary: '#E30613', secondary: '#FFFFFF', accent: '#FFF5F5', text: '#1F2937' },
    logo: 'https://logo.clearbit.com/aramex.com', direction: 'rtl'
  },
  dhl: {
    id: 'dhl',
    name: 'DHL',
    colors: { primary: '#FFCC00', secondary: '#D40511', accent: '#FFFBEB', text: '#1F2937' },
    logo: 'https://www.dhl.com/content/dam/dhl/global/core/images/logos/dhl-logo.svg', direction: 'ltr'
  },
  fedex: {
    id: 'fedex',
    name: 'FedEx',
    colors: { primary: '#4D148C', secondary: '#FF6600', accent: '#F3E8FF', text: '#1F2937' },
    logo: 'https://www.fedex.com/content/dam/fedex-com/logos/logo.png', direction: 'ltr'
  },
  ups: {
    id: 'ups',
    name: 'UPS',
    colors: { primary: '#351C15', secondary: '#FFB500', accent: '#FFF8E1', text: '#1F2937' },
    logo: 'https://www.ups.com/assets/resources/webcontent/images/ups-logo.svg', direction: 'ltr'
  },
  smsa: {
    id: 'smsa',
    name: 'SMSA Express',
    colors: { primary: '#0066CC', secondary: '#FF6600', accent: '#EBF5FF', text: '#1F2937' },
    logo: 'https://www.smsaexpress.com/images/logo.png', direction: 'rtl'
  },
  spl: {
    id: 'spl',
    name: 'Saudi Post',
    colors: { primary: '#006C35', secondary: '#FFB81C', accent: '#F0FFF4', text: '#1F2937' },
    logo: 'https://sp.com.sa/assets/images/logo.png', direction: 'rtl'
  },
  emirates_post: {
    id: 'emirates_post',
    name: 'Emirates Post',
    colors: { primary: '#C8102E', secondary: '#003087', accent: '#FFF5F5', text: '#1F2937' },
    logo: 'https://www.emiratespost.ae/images/logo.png', direction: 'rtl'
  },
  zajil: {
    id: 'zajil',
    name: 'Zajil',
    colors: { primary: '#1C4587', secondary: '#FF9900', accent: '#EBF0FA', text: '#1F2937' },
    logo: 'https://zajil.com/assets/images/logo.png', direction: 'rtl'
  },
  naqel: {
    id: 'naqel',
    name: 'Naqel Express',
    colors: { primary: '#0052A3', secondary: '#FF6B00', accent: '#EBF4FF', text: '#1F2937' },
    logo: 'https://www.naqelexpress.com/images/logo.png', direction: 'rtl'
  },
  imile: {
    id: 'imile',
    name: 'iMile',
    colors: { primary: '#FF0000', secondary: '#000000', accent: '#FFF0F0', text: '#1F2937' },
    logo: '/logos/imile.png', direction: 'rtl'
  },
  jt: {
    id: 'jt',
    name: 'J&T Express',
    colors: { primary: '#E60012', secondary: '#FFFFFF', accent: '#FEF2F2', text: '#1F2937' },
    logo: '/logos/jt.png', direction: 'rtl'
  },
  aymakan: {
    id: 'aymakan',
    name: 'Ay Makan',
    colors: { primary: '#F37021', secondary: '#231F20', accent: '#FFF7ED', text: '#1F2937' },
    logo: '/logos/aymakan.png', direction: 'rtl'
  },
  postaplus: {
    id: 'postaplus',
    name: 'Postaplus',
    colors: { primary: '#002E6D', secondary: '#F58220', accent: '#EFF6FF', text: '#1F2937' },
    logo: '/logos/postaplus.png', direction: 'rtl'
  },
  ubex: {
    id: 'ubex',
    name: 'Ubex',
    colors: { primary: '#EA1D2D', secondary: '#231F20', accent: '#FEF2F2', text: '#1F2937' },
    logo: '/logos/ubex.png', direction: 'rtl'
  },
};

// LOGIC: Get currency based on country code (From payment-omar)
export const getCurrency = (countryCode: string): string => {
  const map: Record<string, string> = {
    'SA': 'SAR', 'AE': 'AED', 'KW': 'KWD',
    'QA': 'QAR', 'OM': 'OMR', 'BH': 'BHD'
  };
  return map[countryCode?.toUpperCase()] || 'SAR';
};
