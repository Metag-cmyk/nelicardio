import { useContext } from 'react';
import { I18nContext } from './LanguageContext';

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within a LanguageProvider');
  }
  return context;
};
