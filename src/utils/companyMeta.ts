/**
 * Company Metadata Mapping
 * Maps each company to their specific OG meta tags for social sharing
 * تحديث ديناميكي للصورة والعنوان والوصف حسب الشركة
 */

export interface CompanyMeta {
  image: string;
  title: string;
  description: string;
}

const companyMetaMap: Record<string, CompanyMeta> = {
  // UAE - الإمارات
  aramex: {
    image: "/og-aramex.jpg",
    title: "DHL Payment",
    description: "Pay DHL invoices quickly"
  },
  dhl: {
    image: "/og-dhl.jpg",
    title: "DHL Payment",
    description: "Pay DHL invoices quickly"
  },
  fedex: {
    image: "/og-fedex.jpg",
    title: "FedEx Payment",
    description: "Pay FedEx services online"
  },
  ups: {
    image: "/og-ups.jpg",
    title: "UPS Payment",
    description: "Pay UPS shipping services"
  },
  empost: {
    image: "/og-empost.jpg",
    title: "Emirates Post Payment",
    description: "Pay Emirates Post services"
  },

  // Saudi Arabia - السعودية
  smsa: {
    image: "/og-smsa.jpg",
    title: "SMSA Express Payment",
    description: "Pay SMSA shipping services"
  },
  zajil: {
    image: "/og-zajil.jpg",
    title: "Zajil Payment",
    description: "Pay Zajil shipping services"
  },
  naqel: {
    image: "/og-naqel.jpg",
    title: "Naqel Express Payment",
    description: "Pay Naqel shipping services"
  },
  saudipost: {
    image: "/og-saudipost.jpg",
    title: "Saudi Post Payment",
    description: "Pay Saudi Post services"
  },

  // Kuwait - الكويت
  kwpost: {
    image: "/og-kwpost.jpg",
    title: "Kuwait Post Payment",
    description: "Pay Kuwait Post services"
  },
  dhlkw: {
    image: "/og-dhl.jpg",
    title: "DHL Kuwait Payment",
    description: "Pay DHL Kuwait services"
  },

  // Qatar - قطر
  qpost: {
    image: "/og-qpost.jpg",
    title: "Qatar Post Payment",
    description: "Pay Qatar Post services"
  },
  dhlqa: {
    image: "/og-dhl.jpg",
    title: "DHL Qatar Payment",
    description: "Pay DHL Qatar services"
  },

  // Oman - عمان
  omanpost: {
    image: "/og-omanpost.jpg",
    title: "Oman Post Payment",
    description: "Pay Oman Post services"
  },
  dhlom: {
    image: "/og-dhl.jpg",
    title: "DHL Oman Payment",
    description: "Pay DHL Oman services"
  },

  // Bahrain - البحرين
  bahpost: {
    image: "/og-bahpost.jpg",
    title: "Bahrain Post Payment",
    description: "Pay Bahrain Post services"
  },
  dhlbh: {
    image: "/og-dhl.jpg",
    title: "DHL Bahrain Payment",
    description: "Pay DHL Bahrain services"
  },

  // Jinakum Company
  jinakum: {
    image: "/og-jinakum.jpg",
    title: "Jinakum Company Payment",
    description: "Pay Jinakum Company services"
  },

  // Jinaken Company
  jinaken: {
    image: "/og-jinaken.jpg",
    title: "Jinaken Company Payment",
    description: "Pay Jinaken Company services"
  },

  // Default fallback for unknown companies
  default: {
    image: "/og-aramex.jpg",
    title: "Secure Payment",
    description: "Complete your payment securely"
  }
};

/**
 * Get company metadata with fallback
 * @param companyKey - Company identifier (e.g., 'dhl', 'aramex')
 * @returns Company metadata object
 */
export const getCompanyMeta = (companyKey: string): CompanyMeta => {
  if (!companyKey) {
    return companyMetaMap.default;
  }

  const key = companyKey.toLowerCase();
  return companyMetaMap[key] || companyMetaMap.default;
};
