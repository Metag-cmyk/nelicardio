import { useState, useEffect, lazy, Suspense } from 'react';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RootLayout } from './components/layout/RootLayout';
import { PatientProvider } from './context/PatientProvider';
import { ThemeProvider } from './theme/ThemeProvider';
import { SocietyProvider } from './context/SocietyProvider';
import { LanguageProvider } from './i18n/LanguageProvider';
import { useRoute } from './router/useRoute';
import { navigate, type Route, type RouteName } from './router/router';
import { NotFoundView } from './features/placeholder/PlaceholderView';

const ConditionList = lazy(() => import('./features/conditions/ConditionList'));
const MedCalculator = lazy(() => import('./features/meds/MedCalculator'));
const ClinicalCalculators = lazy(() => import('./features/calculators/ClinicalCalculators'));
const ImagingView = lazy(() => import('./features/imaging/ImagingView'));
const LabsView = lazy(() => import('./features/labs/LabsView'));
const GuidelinesView = lazy(() => import('./features/guidelines/GuidelinesView'));
const CoverageView = lazy(() => import('./features/coverage/CoverageView'));
const StudyView = lazy(() => import('./features/study/StudyView'));
const ExamView = lazy(() => import('./features/exam/ExamView'));

function RouteView({ route }: { route: Route }) {
  switch (route.name) {
    case 'diagnose':
      return (
        <ConditionList
          selectedId={route.id}
          onSelect={(id) => navigate({ name: 'diagnose', id })}
          onClose={() => navigate({ name: 'diagnose' })}
        />
      );
    case 'labs':
      return <LabsView />;
    case 'imaging':
      return <ImagingView />;
    case 'pharma':
      return (
        <MedCalculator
          selectedId={route.id}
          onSelect={(id) => navigate({ name: 'pharma', id })}
          onClose={() => navigate({ name: 'pharma' })}
        />
      );
    case 'scores':
      return <ClinicalCalculators />;
    case 'guidelines':
      return (
        <GuidelinesView
          selectedId={route.id}
          onSelect={(id) => navigate({ name: 'guidelines', id })}
          onClose={() => navigate({ name: 'guidelines' })}
        />
      );
    case 'coverage':
      return <CoverageView />;
    case 'study':
      return <StudyView />;
    case 'exam':
      return (
        <ExamView
          selectedId={route.id}
          onSelect={(id) => navigate({ name: 'exam', id })}
          onClose={() => navigate({ name: 'exam' })}
        />
      );
    default:
      return <NotFoundView path={route.id} />;
  }
}

function AppContent() {
  const route = useRoute();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (name: RouteName) => navigate({ name });

  return (
    <RootLayout
      route={route}
      isScrolled={isScrolled}
      onNavigate={handleNavigate}
    >
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-6">
          <div className="w-16 h-16 bg-medical-accent/10 rounded-3xl flex items-center justify-center heart-pulse shadow-xl shadow-medical-accent/20">
            <Heart className="w-8 h-8 text-medical-accent fill-medical-accent/20" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-medical-accent animate-pulse">Syncing Clinical Data...</p>
        </div>
      }>
        <AnimatePresence mode="wait">
          <motion.div
            key={route.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            <RouteView route={route} />
          </motion.div>
        </AnimatePresence>
      </Suspense>
    </RootLayout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SocietyProvider>
          <PatientProvider>
            <AppContent />
          </PatientProvider>
        </SocietyProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
