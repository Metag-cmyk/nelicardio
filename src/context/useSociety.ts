import { useContext } from 'react';
import { SocietyContext } from './SocietyContext';

export const useSociety = () => {
  const context = useContext(SocietyContext);
  if (context === undefined) {
    throw new Error('useSociety must be used within a SocietyProvider');
  }
  return context;
};
