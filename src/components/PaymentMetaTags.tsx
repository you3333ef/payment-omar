import { Helmet } from "react-helmet-async";
import { couriers } from "@/themes/themeConfig";

interface PaymentMetaTagsProps {
  serviceName: string;
  serviceKey?: string;
  amount?: string;
  title?: string;
  description?: string;
}

const PaymentMetaTags = ({ serviceName, serviceKey, amount, title, description }: PaymentMetaTagsProps) => {
  // Use serviceKey if provided, otherwise try to extract from serviceName
  const actualServiceKey = serviceKey || serviceName?.toLowerCase() || 'aramex';
  const branding = couriers[actualServiceKey as keyof typeof couriers] || couriers.aramex;

  const ogTitle = title || `الدفع - ${serviceName}`;
  const ogDescription = description || `صفحة دفع آمنة ومحمية لخدمة ${serviceName}${amount ? ` - ${amount}` : ''}`;

  // Use production domain to ensure links work when shared
  const productionDomain = typeof window !== 'undefined' ? window.location.origin : 'https://gentle-hamster-ed634c.netlify.app';

  // Use company-specific OG image or hero image
  const ogImage = branding.ogImage
    ? `${productionDomain}${branding.ogImage}`
    : branding.heroImage
    ? `${productionDomain}${branding.heroImage}`
    : `${productionDomain}/og-aramex.jpg`;

  return (
    <Helmet>
      <title>{ogTitle}</title>
      <meta name="description" content={ogDescription} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={ogTitle} />

      {/* WhatsApp specific */}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/jpeg" />
    </Helmet>
  );
};

export default PaymentMetaTags;
