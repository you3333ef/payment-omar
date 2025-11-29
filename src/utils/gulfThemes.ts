// Gulf Government Payment System - Dynamic Theming
// Supports UAE, KSA, Kuwait, Qatar, Bahrain, Oman with official government UI

export interface CountryTheme {
  id: string;
  name: string;
  nameAr: string;
  flag: string;
  font: string;
  fontAr: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textLight: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  gradient: {
    primary: string;
    secondary: string;
  };
  emblem: string;
  styleReference: string;
  buttonStyle: {
    primary: string;
    secondary: string;
    outline: string;
  };
  bankLogos: Array<{
    id: string;
    name: string;
    nameAr: string;
    logo: string;
  }>;
  governmentServices: Array<{
    id: string;
    name: string;
    nameAr: string;
    icon: string;
  }>;
}

export const GULF_THEMES: Record<string, CountryTheme> = {
  uae: {
    id: 'uae',
    name: 'United Arab Emirates',
    nameAr: 'دولة الإمارات العربية المتحدة',
    flag: '🇦🇪',
    font: 'Dubai, sans-serif',
    fontAr: 'Noto Kufi Arabic, Dubai, sans-serif',
    colors: {
      primary: '#FF0000',
      secondary: '#00732F',
      accent: '#000000',
      background: '#FFFFFF',
      surface: '#F5F5F5',
      text: '#1A1A1A',
      textLight: '#666666',
      border: '#E0E0E0',
      success: '#00732F',
      warning: '#FFA500',
      error: '#DC2626',
    },
    borderRadius: {
      sm: '6px',
      md: '12px',
      lg: '16px',
      xl: '24px',
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    },
    gradient: {
      primary: 'linear-gradient(135deg, #FF0000 0%, #00732F 100%)',
      secondary: 'linear-gradient(135deg, #00732F 0%, #000000 100%)',
    },
    emblem: '/assets/uae-emblem.png',
    styleReference: 'TAMM / UAE PASS',
    buttonStyle: {
      primary: 'bg-gradient-to-r from-red-600 to-green-700 hover:from-red-700 hover:to-green-800 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105',
      secondary: 'bg-white border-2 border-red-600 text-red-600 hover:bg-red-50 font-bold py-4 px-8 rounded-xl',
      outline: 'bg-transparent border-2 border-gray-300 text-gray-700 hover:border-red-600 hover:text-red-600 font-semibold py-4 px-8 rounded-xl',
    },
    bankLogos: [
      { id: 'adib', name: 'ADIB', nameAr: 'مصرف أبوظبي الإسلامي', logo: '/assets/banks/adib-logo.png' },
      { id: 'dubai_islamic', name: 'Dubai Islamic Bank', nameAr: 'بنك دبي الإسلامي', logo: '/assets/banks/dib-logo.png' },
      { id: 'mashreq', name: 'Mashreq Bank', nameAr: 'بنك المشرق', logo: '/assets/banks/mashreq-logo.png' },
      { id: 'fab', name: 'FAB', nameAr: 'بنك أبوظبي الأول', logo: '/assets/banks/fab-logo.png' },
      { id: 'hsbc', name: 'HSBC', nameAr: 'بنك HSBC', logo: '/assets/banks/hsbc-logo.png' },
      { id: 'emirates_nbd', name: 'Emirates NBD', nameAr: 'بنك الإمارات دبي الوطني', logo: '/assets/banks/nbd-logo.png' },
      { id: 'rakbank', name: 'RAKBANK', nameAr: 'بنك رأس الخيمة الوطني', logo: '/assets/banks/rakbank-logo.png' },
      { id: 'cbd', name: 'Commercial Bank of Dubai', nameAr: 'بنك دبي التجاري', logo: '/assets/banks/cbd-logo.png' },
    ],
    governmentServices: [
      { id: 'visa', name: 'Visa Services', nameAr: 'خدمات التأشيرات', icon: 'Visa' },
      { id: 'emirates_id', name: 'Emirates ID', nameAr: 'الهوية الإماراتية', icon: 'Id' },
      { id: 'driving_license', name: 'Driving License', nameAr: 'رخصة القيادة', icon: 'Car' },
      { id: 'vehicle_registration', name: 'Vehicle Registration', nameAr: 'تسجيل المركبات', icon: 'Truck' },
      { id: 'utilities', name: 'Utilities Bill', nameAr: 'فاتورة الخدمات', icon: 'Home' },
      { id: 'municipality', name: 'Municipality Fees', nameAr: 'رسوم البلدية', icon: 'Building' },
    ],
  },

  saudi: {
    id: 'saudi',
    name: 'Saudi Arabia',
    nameAr: 'المملكة العربية السعودية',
    flag: '🇸🇦',
    font: 'GE SS, sans-serif',
    fontAr: 'Noto Kufi Arabic, GE SS, sans-serif',
    colors: {
      primary: '#006C35',
      secondary: '#000000',
      accent: '#C9A227',
      background: '#FFFFFF',
      surface: '#F8F9FA',
      text: '#1A1A1A',
      textLight: '#6C757D',
      border: '#DEE2E6',
      success: '#28A745',
      warning: '#FFC107',
      error: '#DC3545',
    },
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
    },
    shadows: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.1)',
      md: '0 2px 4px rgba(0, 0, 0, 0.1)',
      lg: '0 4px 8px rgba(0, 0, 0, 0.15)',
      xl: '0 8px 16px rgba(0, 0, 0, 0.2)',
    },
    gradient: {
      primary: 'linear-gradient(135deg, #006C35 0%, #000000 100%)',
      secondary: 'linear-gradient(135deg, #006C35 0%, #C9A227 100%)',
    },
    emblem: '/assets/saudi-emblem.png',
    styleReference: 'SADAD official portal',
    buttonStyle: {
      primary: 'bg-green-700 hover:bg-green-800 text-white font-bold py-4 px-8 rounded-lg shadow-md transition-all duration-300',
      secondary: 'bg-white border-2 border-green-700 text-green-700 hover:bg-green-50 font-bold py-4 px-8 rounded-lg',
      outline: 'bg-transparent border-2 border-gray-300 text-gray-700 hover:border-green-700 hover:text-green-700 font-semibold py-4 px-8 rounded-lg',
    },
    bankLogos: [
      { id: 'alrajhi', name: 'Al Rajhi Bank', nameAr: 'بنك الراجحي', logo: '/assets/banks/alrajhi-logo.png' },
      { id: 'riyadh', name: 'Riyad Bank', nameAr: 'بنك الرياض', logo: '/assets/banks/riyadh-logo.png' },
      { id: 'anb', name: 'ANB', nameAr: 'البنك الأهلي السعودي', logo: '/assets/banks/anb-logo.png' },
      { id: 'snb', name: 'SNB', nameAr: 'البنك الأهلي السعودي', logo: '/assets/banks/snb-logo.png' },
      { id: 'samba', name: 'Samba', nameAr: 'بنك سامبا', logo: '/assets/banks/samba-logo.png' },
      { id: 'najm', name: 'Najm', nameAr: 'شركة نجم', logo: '/assets/banks/najm-logo.png' },
      { id: 'sadad', name: 'Sadad Bank', nameAr: 'بنك سداد', logo: '/assets/banks/sadad-logo.png' },
      { id: 'aljazira', name: 'Aljazira Bank', nameAr: 'بنك الجزيرة', logo: '/assets/banks/aljazira-logo.png' },
    ],
    governmentServices: [
      { id: 'iqama', name: 'Iqama Renewal', nameAr: 'تجديد الإقامة', icon: 'Id' },
      { id: 'driving_license', name: 'Driving License', nameAr: 'رخصة القيادة', icon: 'Car' },
      { id: 'vehicle_registration', name: 'Vehicle Registration', nameAr: 'تسجيل المركبات', icon: 'Truck' },
      { id: 'visa', name: 'Visa Services', nameAr: 'خدمات التأشيرات', icon: 'Passport' },
      { id: 'hijri_calendar', name: 'Civil Affairs', nameAr: 'الأحوال المدنية', icon: 'User' },
      { id: 'mosque_permit', name: 'Mosque Permit', nameAr: 'تصريح المسجد', icon: 'Building' },
    ],
  },

  kuwait: {
    id: 'kuwait',
    name: 'Kuwait',
    nameAr: 'دولة الكويت',
    flag: '🇰🇼',
    font: 'Kuwait, sans-serif',
    fontAr: 'Noto Kufi Arabic, Kuwait, sans-serif',
    colors: {
      primary: '#005EB8',
      secondary: '#FFD100',
      accent: '#000000',
      background: '#FFFFFF',
      surface: '#F0F4F8',
      text: '#1A1A1A',
      textLight: '#5A6C7D',
      border: '#C8D1DC',
      success: '#00703C',
      warning: '#FFA500',
      error: '#D4351C',
    },
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
    },
    shadows: {
      sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
      md: '0 2px 6px rgba(0, 0, 0, 0.1)',
      lg: '0 4px 12px rgba(0, 0, 0, 0.15)',
      xl: '0 8px 16px rgba(0, 0, 0, 0.2)',
    },
    gradient: {
      primary: 'linear-gradient(135deg, #005EB8 0%, #FFD100 100%)',
      secondary: 'linear-gradient(135deg, #005EB8 0%, #000000 100%)',
    },
    emblem: '/assets/kuwait-emblem.png',
    styleReference: 'KNET official portal',
    buttonStyle: {
      primary: 'bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 px-8 rounded-lg shadow-md transition-all duration-300',
      secondary: 'bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-4 px-8 rounded-lg',
      outline: 'bg-transparent border-2 border-blue-700 text-blue-700 hover:bg-blue-50 font-semibold py-4 px-8 rounded-lg',
    },
    bankLogos: [
      { id: 'nbk', name: 'National Bank of Kuwait', nameAr: 'بنك الكويت الوطني', logo: '/assets/banks/nbk-logo.png' },
      { id: 'kib', name: 'Kuwait Investment Company', nameAr: 'شركة الكويت للاستثمار', logo: '/assets/banks/kib-logo.png' },
      { id: 'cbk', name: 'Commercial Bank of Kuwait', nameAr: 'البنك التجاري الكويتي', logo: '/assets/banks/cbk-logo.png' },
      { id: 'gulf_bank', name: 'Gulf Bank', nameAr: 'بنك الخليج', logo: '/assets/banks/gulf-logo.png' },
      { id: 'boubyan', name: 'Boubyan Bank', nameAr: 'بنك الخليج', logo: '/assets/banks/boubyan-logo.png' },
      { id: 'burgan', name: 'Burgan Bank', nameAr: 'بنك برقان', logo: '/assets/banks/burgan-logo.png' },
      { id: 'warba', name: 'Warba Bank', nameAr: 'بنك وربة', logo: '/assets/banks/warba-logo.png' },
      { id: 'industrial_bank', name: 'Industrial Bank of Kuwait', nameAr: 'بنك الكويت الصناعي', logo: '/assets/banks/industrial-logo.png' },
    ],
    governmentServices: [
      { id: 'civil_id', name: 'Civil ID', nameAr: 'البطاقة المدنية', icon: 'Id' },
      { id: 'passport', name: 'Passport', nameAr: 'جواز السفر', icon: 'Passport' },
      { id: 'driving_license', name: 'Driving License', nameAr: 'رخصة القيادة', icon: 'Car' },
      { id: 'vehicle_registration', name: 'Vehicle Registration', nameAr: 'تسجيل المركبات', icon: 'Truck' },
      { id: 'utilities', name: 'Utilities', nameAr: 'الخدمات', icon: 'Home' },
      { id: 'municipality', name: 'Municipality', nameAr: 'البلدية', icon: 'Building' },
    ],
  },

  qatar: {
    id: 'qatar',
    name: 'Qatar',
    nameAr: 'دولة قطر',
    flag: '🇶🇦',
    font: 'Lusail, sans-serif',
    fontAr: 'Noto Kufi Arabic, Lusail, sans-serif',
    colors: {
      primary: '#8A1538',
      secondary: '#8A1538',
      accent: '#C9A227',
      background: '#FFFFFF',
      surface: '#FAFAFA',
      text: '#1A1A1A',
      textLight: '#666666',
      border: '#E0E0E0',
      success: '#007A3D',
      warning: '#FFA500',
      error: '#D32F2F',
    },
    borderRadius: {
      sm: '6px',
      md: '10px',
      lg: '14px',
      xl: '20px',
    },
    shadows: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.08)',
      md: '0 3px 6px rgba(0, 0, 0, 0.1)',
      lg: '0 8px 16px rgba(0, 0, 0, 0.15)',
      xl: '0 12px 24px rgba(0, 0, 0, 0.2)',
    },
    gradient: {
      primary: 'linear-gradient(135deg, #8A1538 0%, #C9A227 100%)',
      secondary: 'linear-gradient(135deg, #8A1538 0%, #007A3D 100%)',
    },
    emblem: '/assets/qatar-emblem.png',
    styleReference: 'Hukoomi identity',
    buttonStyle: {
      primary: 'bg-red-800 hover:bg-red-900 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition-all duration-300',
      secondary: 'bg-white border-2 border-red-800 text-red-800 hover:bg-red-50 font-bold py-4 px-8 rounded-lg',
      outline: 'bg-transparent border-2 border-gray-300 text-gray-700 hover:border-red-800 hover:text-red-800 font-semibold py-4 px-8 rounded-lg',
    },
    bankLogos: [
      { id: 'qnb', name: 'QNB', nameAr: 'بنك قطر الوطني', logo: '/assets/banks/qnb-logo.png' },
      { id: 'cbq', name: 'Commercial Bank of Qatar', nameAr: 'بنك قطر التجاري', logo: '/assets/banks/cbq-logo.png' },
      { id: 'doha_bank', name: 'Doha Bank', nameAr: 'بنك الدوحة', logo: '/assets/banks/doha-logo.png' },
      { id: 'ibq', name: 'International Bank of Qatar', nameAr: 'البنك الأهلي القطري', logo: '/assets/banks/ibq-logo.png' },
      { id: 'msq', name: 'Masraf Al Rayyan', nameAr: 'مصرف قطر الإسلامي', logo: '/assets/banks/msq-logo.png' },
      { id: 'al_khaliji', name: 'Al Khaliji Bank', nameAr: 'البنك الخليجي', logo: '/assets/banks/khaliji-logo.png' },
      { id: 'barwa', name: 'Barwa Bank', nameAr: 'بنك بروة', logo: '/assets/banks/barwa-logo.png' },
      { id: 'qatar_islamic', name: 'Qatar Islamic Bank', nameAr: 'البنك الإسلامي القطري', logo: '/assets/banks/qib-logo.png' },
    ],
    governmentServices: [
      { id: 'qid', name: 'QID', nameAr: 'الهوية القطرية', icon: 'Id' },
      { id: 'vehicle_registration', name: 'Vehicle Registration', nameAr: 'تسجيل المركبات', icon: 'Truck' },
      { id: 'driving_license', name: 'Driving License', nameAr: 'رخصة القيادة', icon: 'Car' },
      { id: 'visa', name: 'Visa Services', nameAr: 'خدمات التأشيرات', icon: 'Passport' },
      { id: 'water_electricity', name: 'Water & Electricity', nameAr: 'الكهرباء والمياه', icon: 'Zap' },
      { id: 'traffic_fines', name: 'Traffic Fines', nameAr: 'مخالفات المرور', icon: 'Alert' },
    ],
  },

  bahrain: {
    id: 'bahrain',
    name: 'Bahrain',
    nameAr: 'مملكة البحرين',
    flag: '🇧🇭',
    font: 'Bahrain, sans-serif',
    fontAr: 'Noto Kufi Arabic, Bahrain, sans-serif',
    colors: {
      primary: '#E10000',
      secondary: '#FFFFFF',
      accent: '#000000',
      background: '#FFFFFF',
      surface: '#F8F9FA',
      text: '#1A1A1A',
      textLight: '#6C757D',
      border: '#DEE2E6',
      success: '#28A745',
      warning: '#FFC107',
      error: '#DC3545',
    },
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
    },
    shadows: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.08)',
      md: '0 2px 4px rgba(0, 0, 0, 0.1)',
      lg: '0 4px 8px rgba(0, 0, 0, 0.15)',
      xl: '0 8px 16px rgba(0, 0, 0, 0.2)',
    },
    gradient: {
      primary: 'linear-gradient(135deg, #E10000 0%, #FFFFFF 100%)',
      secondary: 'linear-gradient(135deg, #E10000 0%, #000000 100%)',
    },
    emblem: '/assets/bahrain-emblem.png',
    styleReference: 'eGovernment identity',
    buttonStyle: {
      primary: 'bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg shadow-md transition-all duration-300',
      secondary: 'bg-white border-2 border-red-600 text-red-600 hover:bg-red-50 font-bold py-4 px-8 rounded-lg',
      outline: 'bg-transparent border-2 border-gray-300 text-gray-700 hover:border-red-600 hover:text-red-600 font-semibold py-4 px-8 rounded-lg',
    },
    bankLogos: [
      { id: 'bbk', name: 'BBK', nameAr: 'بنك البحرين والكويت', logo: '/assets/banks/bbk-logo.png' },
      { id: 'cbi', name: 'CBI', nameAr: 'البنك التجاري البحريني', logo: '/assets/banks/cbi-logo.png' },
      { id: 'nbf', name: 'NBF', nameAr: 'بنك الفجيرة الوطني', logo: '/assets/banks/nbf-logo.png' },
      { id: 'bis', name: 'Bahrain Islamic Bank', nameAr: 'بنك البحرين الإسلامي', logo: '/assets/banks/bis-logo.png' },
      { id: 'alubaf', name: 'Alubaf Bank', nameAr: 'الأهله بنك', logo: '/assets/banks/alubaf-logo.png' },
      { id: 'khaleeji', name: 'Khaleeji Bank', nameAr: 'الخليجي بنك', logo: '/assets/banks/khaleeji-logo.png' },
      { id: 'gwour', name: 'Gwour Bank', nameAr: 'بنك غير', logo: '/assets/banks/gwour-logo.png' },
      { id: 'bmb', name: 'BMB Bank', nameAr: 'بنك البحرينية المالي', logo: '/assets/banks/bmb-logo.png' },
    ],
    governmentServices: [
      { id: 'cpr', name: 'CPR', nameAr: 'البطاقة الشخصية', icon: 'Id' },
      { id: 'vehicle_registration', name: 'Vehicle Registration', nameAr: 'تسجيل المركبات', icon: 'Truck' },
      { id: 'driving_license', name: 'Driving License', nameAr: 'رخصة القيادة', icon: 'Car' },
      { id: 'utilities', name: 'Utilities', nameAr: 'الخدمات', icon: 'Home' },
      { id: 'municipality', name: 'Municipality', nameAr: 'البلدية', icon: 'Building' },
      { id: 'traffic_fines', name: 'Traffic Fines', nameAr: 'مخالفات المرور', icon: 'Alert' },
    ],
  },

  oman: {
    id: 'oman',
    name: 'Oman',
    nameAr: 'سلطنة عمان',
    flag: '🇴🇲',
    font: 'Noto Arabic, sans-serif',
    fontAr: 'Noto Kufi Arabic, sans-serif',
    colors: {
      primary: '#C8102E',
      secondary: '#007A3D',
      accent: '#C9A227',
      background: '#FFFFFF',
      surface: '#FAFAFA',
      text: '#1A1A1A',
      textLight: '#666666',
      border: '#E0E0E0',
      success: '#007A3D',
      warning: '#FFA500',
      error: '#DC2626',
    },
    borderRadius: {
      sm: '6px',
      md: '10px',
      lg: '14px',
      xl: '20px',
    },
    shadows: {
      sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
      md: '0 3px 6px rgba(0, 0, 0, 0.12)',
      lg: '0 6px 12px rgba(0, 0, 0, 0.15)',
      xl: '0 12px 24px rgba(0, 0, 0, 0.2)',
    },
    gradient: {
      primary: 'linear-gradient(135deg, #C8102E 0%, #007A3D 100%)',
      secondary: 'linear-gradient(135deg, #007A3D 0%, #C9A227 100%)',
    },
    emblem: '/assets/oman-emblem.png',
    styleReference: 'eOman official patterns',
    buttonStyle: {
      primary: 'bg-gradient-to-r from-red-700 to-green-700 hover:from-red-800 hover:to-green-800 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition-all duration-300',
      secondary: 'bg-white border-2 border-red-700 text-red-700 hover:bg-red-50 font-bold py-4 px-8 rounded-lg',
      outline: 'bg-transparent border-2 border-gray-300 text-gray-700 hover:border-red-700 hover:text-red-700 font-semibold py-4 px-8 rounded-lg',
    },
    bankLogos: [
      { id: 'bankmuscat', name: 'Bank Muscat', nameAr: 'بنك مسقط', logo: '/assets/banks/muscat-logo.png' },
      { id: 'nbo', name: 'National Bank of Oman', nameAr: 'البنك الأهلي العماني', logo: '/assets/banks/nbo-logo.png' },
      { id: 'hsbc_om', name: 'HSBC Oman', nameAr: 'بنك اتش اس بي سي', logo: '/assets/banks/hsbc-logo.png' },
      { id: 'bdo', name: 'Bank Dhofar', nameAr: 'بنك عمان الأهلي', logo: '/assets/banks/bdo-logo.png' },
      { id: 'sohar', name: 'Sohar Bank', nameAr: 'بنك صحار', logo: '/assets/banks/sohar-logo.png' },
      { id: 'ozi', name: 'Ozi Bank', nameAr: 'البنك الأهلي العماني', logo: '/assets/banks/ozi-logo.png' },
      { id: 'alizz', name: 'Alizz Islamic Bank', nameAr: 'بنك أليز الإسلامي', logo: '/assets/banks/alizz-logo.png' },
      { id: 'nme', name: 'NME Bank', nameAr: 'بنك نمو', logo: '/assets/banks/nme-logo.png' },
    ],
    governmentServices: [
      { id: 'national_id', name: 'National ID', nameAr: 'الهوية العمانية', icon: 'Id' },
      { id: 'driving_license', name: 'Driving License', nameAr: 'رخصة القيادة', icon: 'Car' },
      { id: 'vehicle_registration', name: 'Vehicle Registration', nameAr: 'تسجيل المركبات', icon: 'Truck' },
      { id: 'visa', name: 'Visa Services', nameAr: 'خدمات التأشيرات', icon: 'Passport' },
      { id: 'water_electricity', name: 'Water & Electricity', nameAr: 'الكهرباء والمياه', icon: 'Zap' },
      { id: 'municipality', name: 'Municipality', nameAr: 'البلدية', icon: 'Building' },
    ],
  },
};

export const getCountryTheme = (countryId: string): CountryTheme => {
  return GULF_THEMES[countryId] || GULF_THEMES.uae;
};

export const getAllCountries = (): CountryTheme[] => {
  return Object.values(GULF_THEMES);
};
