// Shipping OG Image Handler
// Automatically generates correct share images for shipping companies

import fs from 'fs';
import path from 'path';

interface ShippingCompany {
  name: string;
  nameAr: string;
  logo: string;
  image?: string;
}

export const SHIPPING_COMPANIES: Record<string, ShippingCompany> = {
  // UAE
  aramex: {
    name: 'Aramex',
    nameAr: 'أرامكس',
    logo: '/assets/shipping/logos/aramex-logo.png',
    image: '/assets/shipping/aramex-image.jpg'
  },
  dhl: {
    name: 'DHL',
    nameAr: 'دي اتش ال',
    logo: '/assets/shipping/logos/dhl-logo.png',
    image: '/assets/shipping/dhl-image.jpg'
  },
  fedex: {
    name: 'FedEx',
    nameAr: 'فيديكس',
    logo: '/assets/shipping/logos/fedex-logo.png',
    image: '/assets/shipping/fedex-image.jpg'
  },
  ups: {
    name: 'UPS',
    nameAr: 'يو بي اس',
    logo: '/assets/shipping/logos/ups-logo.png',
    image: '/assets/shipping/ups-image.jpg'
  },

  // Saudi Arabia
  salla: {
    name: 'Salla',
    nameAr: 'سلة',
    logo: '/assets/shipping/logos/salla-logo.png',
    image: '/assets/shipping/salla-image.jpg'
  },

  // Kuwait
  mylerz: {
    name: 'Mylerz',
    nameAr: 'مايرز',
    logo: '/assets/shipping/logos/mylerz-logo.png',
    image: '/assets/shipping/mylerz-image.jpg'
  },

  // Qatar
  qpost: {
    name: 'QPost',
    nameAr: 'كيو بوست',
    logo: '/assets/shipping/logos/qpost-logo.png',
    image: '/assets/shipping/qpost-image.jpg'
  },

  // Bahrain
  acass: {
    name: 'Acass',
    nameAr: 'أكاس',
    logo: '/assets/shipping/logos/acass-logo.png',
    image: '/assets/shipping/acass-image.jpg'
  },

  // Oman
  omantel: {
    name: 'Omantel',
    nameAr: 'عمانتل',
    logo: '/assets/shipping/logos/omantel-logo.png',
    image: '/assets/shipping/omantel-image.jpg'
  }
};

export const getShippingOGImage = (companyId: string): string => {
  const company = SHIPPING_COMPANIES[companyId];

  if (!company) {
    return '/assets/shipping/default-placeholder.jpg';
  }

  if (company.image && fs.existsSync(path.join(process.cwd(), 'public', company.image))) {
    return company.image;
  }

  return company.logo;
};

export const generateShippingMetaTags = (companyId: string) => {
  const company = SHIPPING_COMPANIES[companyId];

  if (!company) {
    return {
      title: 'Shipping Service',
      description: 'Professional shipping services',
      image: '/assets/shipping/default-placeholder.jpg'
    };
  }

  const ogImage = getShippingOGImage(companyId);

  return {
    title: `${company.nameAr} - ${company.name}`,
    description: `خدمات شحن احترافية مع ${company.nameAr}`,
    image: ogImage,
    webpImage: ogImage.replace('.jpg', '.webp'),
    fallbackImage: company.logo
  };
};

export const getAllShippingCompanies = (): ShippingCompany[] => {
  return Object.values(SHIPPING_COMPANIES);
};

export const getShippingCompanyById = (id: string): ShippingCompany | undefined => {
  return SHIPPING_COMPANIES[id];
};

// Auto-generate share images for all shipping companies
export const generateAllShippingOGImages = async () => {
  const companies = Object.values(SHIPPING_COMPANIES);

  companies.forEach(company => {
    const ogImage = getShippingOGImage(company.name.toLowerCase());
    console.log(`Generated OG image for ${company.name}:`, ogImage);
  });

  return companies.map(company => ({
    company: company.name,
    ogImage: getShippingOGImage(company.name.toLowerCase())
  }));
};
