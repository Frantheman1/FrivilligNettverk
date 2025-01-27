import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const languages = {
  nb: {
    // Navigation
    aboutUs: 'Om Oss',
    settings: 'Innstillinger',
    myOpportunities: 'Mine Muligheter',
    createOpportunity: 'Legg Ut Mulighet',
    logIn: 'Logg Inn',
    logOut: 'Logg Ut',
    myProfile: 'Min Profil',

    // Filters
    filterOpportunities: 'Filtrer Muligheter',
    search: 'Søk',
    searchPlaceholder: 'Søk i tittel, beskrivelse, organisasjon eller ferdigheter...',
    location: 'Sted',
    locationPlaceholder: 'Søk etter sted...',
    date: 'Dato',
    category: 'Kategori',
    allCategories: 'Alle kategorier',
    resetFilters: 'Nullstill filtre',

    // Opportunity Card
    postedBy: 'Lagt ut av:',
    location: 'Sted:',
    date: 'Dato:',
    time: 'Tid:',
    contactInfo: 'Kontaktinformasjon',
    email: 'E-post:',
    phone: 'Telefon:',
    requiredSkills: 'Ønskede ferdigheter:',
    applyNow: 'Søk nå',
    applicationSent: 'Søknad sendt',
    approved: 'Godkjent',
    rejected: 'Avvist',

    // Settings
    appearance: 'Utseende',
    language: 'Språk',
    notifications: 'Varsler',
    emailNotifications: 'E-postvarsler',
    privacy: 'Personvern',
    privacySettings: 'Personverninnstillinger',
    dataHandling: 'Databehandling',

    // Categories
    categories: {
      'Miljø og Natur': 'Miljø og Natur',
      'Barn og Ungdom': 'Barn og Ungdom',
      'Eldre og Omsorg': 'Eldre og Omsorg',
      'Sport og Fritid': 'Sport og Fritid',
      'Kultur og Kunst': 'Kultur og Kunst',
      'Utdanning': 'Utdanning',
      'Helse': 'Helse',
      'Annet': 'Annet'
    }
  },
  en: {
    // Navigation
    aboutUs: 'About Us',
    settings: 'Settings',
    myOpportunities: 'My Opportunities',
    createOpportunity: 'Create Opportunity',
    logIn: 'Log In',
    logOut: 'Log Out',
    myProfile: 'My Profile',

    // Filters
    filterOpportunities: 'Filter Opportunities',
    search: 'Search',
    searchPlaceholder: 'Search in title, description, organization or skills...',
    location: 'Location',
    locationPlaceholder: 'Search by location...',
    date: 'Date',
    category: 'Category',
    allCategories: 'All categories',
    resetFilters: 'Reset filters',

    // Opportunity Card
    postedBy: 'Posted by:',
    location: 'Location:',
    date: 'Date:',
    time: 'Time:',
    contactInfo: 'Contact Information',
    email: 'Email:',
    phone: 'Phone:',
    requiredSkills: 'Required Skills:',
    applyNow: 'Apply Now',
    applicationSent: 'Application Sent',
    approved: 'Approved',
    rejected: 'Rejected',

    // Settings
    appearance: 'Appearance',
    language: 'Language',
    notifications: 'Notifications',
    emailNotifications: 'Email Notifications',
    privacy: 'Privacy',
    privacySettings: 'Privacy Settings',
    dataHandling: 'Data Handling',

    // Categories
    categories: {
      'Miljø og Natur': 'Environment & Nature',
      'Barn og Ungdom': 'Children & Youth',
      'Eldre og Omsorg': 'Elderly Care',
      'Sport og Fritid': 'Sports & Leisure',
      'Kultur og Kunst': 'Culture & Arts',
      'Utdanning': 'Education',
      'Helse': 'Health',
      'Annet': 'Other'
    }
  }
};

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'nb';
  });

  useEffect(() => {
    localStorage.setItem('language', currentLanguage);
  }, [currentLanguage]);

  const value = {
    language: currentLanguage,
    setLanguage: setCurrentLanguage,
    t: (key) => {
      const keys = key.split('.');
      let translation = languages[currentLanguage];
      for (const k of keys) {
        translation = translation?.[k];
      }
      return translation || key;
    }
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 