import React from 'react';
import { ADSENSE_CONFIG, AdVariant } from '../data/adsConfig';

interface AdPlaceholderProps {
  id: keyof typeof ADSENSE_CONFIG.slots | string;
  variant?: AdVariant;
  className?: string;
  label?: string;
  showLabel?: boolean;
}

export default function AdPlaceholder({ 
  id, 
  variant = 'horizontal', 
  className = "", 
  label = "Advertisement",
  showLabel = true
}: AdPlaceholderProps) {
  // If ads are disabled globally
  if (!ADSENSE_CONFIG.enabled) return null;

  const isAdSenseActive = ADSENSE_CONFIG.publisherId !== "" && (ADSENSE_CONFIG.slots as any)[id] !== "";

  // Dynamic styling based on variant
  const getContainerStyles = () => {
    switch (variant) {
      case 'rectangle':
        return "max-w-[300px] min-h-[250px]";
      case 'sidebar':
        return "w-full min-h-[300px]";
      case 'horizontal':
      default:
        return "max-w-[728px]";
    }
  };

  const getInnerStyles = () => {
    switch (variant) {
      case 'rectangle':
        return "h-[250px]";
      case 'sidebar':
        return "h-[600px] sm:h-[300px]";
      case 'horizontal':
      default:
        return "h-[100px] sm:h-[60px] lg:h-[90px]";
    }
  };

  // Google AdSense Effect
  React.useEffect(() => {
    if (isAdSenseActive) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense Error:", e);
      }
    }
  }, [isAdSenseActive, id]);

  return (
    <div className={`flex flex-col items-center my-8 w-full ${className}`}>
      {showLabel && (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
          {label}
        </span>
      )}
      
      <div className={`w-full bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-300 ${getContainerStyles()}`}>
        {isAdSenseActive ? (
          <ins 
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={ADSENSE_CONFIG.publisherId}
            data-ad-slot={(ADSENSE_CONFIG.slots as any)[id]}
            data-ad-format={variant === 'auto' ? 'auto' : undefined}
            data-full-width-responsive="true"
          ></ins>
        ) : (
          <div className={`w-full flex items-center justify-center p-2 text-center ${getInnerStyles()}`}>
            <div>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium italic">
                {variant.charAt(0).toUpperCase() + variant.slice(1)} Ad Placeholder
              </p>
              <p className="text-[8px] sm:text-[10px] text-slate-300">Slot ID: {id}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
