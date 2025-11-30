import React from 'react';
import { Card } from "@/components/ui/card";
import { getCompanyBranding } from "@/lib/companyBranding";
import PaymentMetaTags from "@/components/PaymentMetaTags";
import { CreditCard } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

interface DynamicPaymentLayoutProps {
  children: React.ReactNode;
  serviceName: string;
  serviceKey?: string;
  amount: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  showHero?: boolean;
}

const DynamicPaymentLayout: React.FC<DynamicPaymentLayoutProps> = ({
  children,
  serviceName,
  serviceKey,
  amount,
  title,
  description,
  icon = <CreditCard className="w-7 h-7 sm:w-10 sm:h-10 text-white" />,
  showHero = true
}) => {
  const actualServiceKey = serviceKey || serviceName;
  const branding = getCompanyBranding(actualServiceKey);

  const heroImage = branding.heroImage || heroBg;

  return (
    <>
      <PaymentMetaTags 
        serviceName={serviceName}
        serviceKey={actualServiceKey}
        amount={amount}
        title={title}
        description={description}
      />
      <div
        className="min-h-screen bg-background"
        dir="rtl"
        style={{
          background: showHero ? branding.colors.background : branding.gradients.secondary,
          fontFamily: branding.fonts.primaryAr || branding.fonts.primary,
        }}
      >
        {showHero && (
          <div className="relative w-full h-48 sm:h-64 overflow-hidden">
            <img
              src={heroImage}
              alt={serviceName}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-b opacity-70"
              style={{
                background: `linear-gradient(to bottom, ${branding.colors.primary}40, ${branding.colors.primary}80)`
              }}
            />

            {/* Logo Overlay */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
              <div
                className="rounded-2xl p-3 sm:p-4 shadow-lg"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: `2px solid ${branding.colors.primary}`,
                  boxShadow: branding.shadows.md
                }}
              >
                {branding.logo && (
                  <img
                    src={branding.logo}
                    alt={serviceName}
                    className="h-12 sm:h-16 w-auto"
                    onError={(e) => e.currentTarget.style.display = 'none'}
                  />
                )}
              </div>
            </div>

            {/* Title Overlay */}
            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 text-white">
              <div className="text-right">
                <h2
                  className="text-lg sm:text-2xl font-bold mb-1"
                  style={{
                    fontFamily: branding.fonts.primaryAr || branding.fonts.primary,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                  }}
                >
                  {serviceName}
                </h2>
                <p
                  className="text-xs sm:text-sm opacity-90"
                  style={{
                    fontFamily: branding.fonts.primaryAr || branding.fonts.primary,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                  }}
                >
                  {branding.description}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className={`container mx-auto px-3 sm:px-4 ${showHero ? '-mt-8 sm:-mt-12 relative z-10' : 'py-8'}`}>
          <div className="max-w-2xl mx-auto">
            <Card
              className="p-4 sm:p-8 shadow-2xl border-t-4"
              style={{
                borderTopColor: branding.colors.primary,
                background: showHero ? branding.colors.background : branding.gradients.secondary,
                boxShadow: branding.shadows.lg,
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h1
                  className="text-xl sm:text-3xl font-bold"
                  style={{
                    color: branding.colors.text,
                    fontFamily: branding.fonts.primaryAr || branding.fonts.primary
                  }}
                >
                  {title}
                </h1>

                <div
                  className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{
                    background: branding.gradients.primary,
                    boxShadow: branding.shadows.lg,
                  }}
                >
                  {icon}
                </div>
              </div>

              {children}
            </Card>
          </div>
        </div>

        {/* Footer with company branding */}
        <div className="text-center py-6" style={{ backgroundColor: branding.colors.surface }}>
          <p
            className="text-sm"
            style={{
              color: branding.colors.textLight,
              fontFamily: branding.fonts.primaryAr || branding.fonts.primary
            }}
          >
            © 2025 {branding.name} - {branding.nameAr}
          </p>
          {branding.website && (
            <a
              href={branding.website}
              className="text-xs underline hover:opacity-80"
              style={{ color: branding.colors.primary }}
              target="_blank"
              rel="noopener noreferrer"
            >
              {branding.website}
            </a>
          )}
        </div>
      </div>
    </>
  );
};

export default DynamicPaymentLayout;