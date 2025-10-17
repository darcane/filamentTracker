import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface CookieConsent {
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

interface CookieConsentContextType {
  consent: CookieConsent;
  updateConsent: (consent: CookieConsent) => void;
  hasConsent: (type: keyof CookieConsent) => boolean;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

interface CookieConsentProviderProps {
  children: ReactNode;
}

export const CookieConsentProvider: React.FC<CookieConsentProviderProps> = ({ children }) => {
  const [consent, setConsent] = useState<CookieConsent>({
    analytics: false,
    marketing: false,
    preferences: true, // Essential cookies are always required
  });

  useEffect(() => {
    // Load consent from localStorage
    const savedConsent = localStorage.getItem('cookie-consent');
    if (savedConsent) {
      try {
        const parsedConsent = JSON.parse(savedConsent);
        setConsent(parsedConsent);
      } catch (error) {
        console.error('Error parsing cookie consent:', error);
      }
    }
  }, []);

  const updateConsent = useCallback((newConsent: CookieConsent) => {
    setConsent(newConsent);
    localStorage.setItem('cookie-consent', JSON.stringify(newConsent));
    
    // Initialize analytics if consent is given
    if (newConsent.analytics) {
      // Initialize Google Analytics or other analytics tools here
      console.log('Analytics cookies enabled');
    }
    
    // Initialize marketing tools if consent is given
    if (newConsent.marketing) {
      // Initialize marketing tools here
      console.log('Marketing cookies enabled');
    }
  }, []);

  const hasConsent = useCallback((type: keyof CookieConsent): boolean => {
    return consent[type];
  }, [consent]);

  return (
    <CookieConsentContext.Provider value={{ consent, updateConsent, hasConsent }}>
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = (): CookieConsentContextType => {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
};
