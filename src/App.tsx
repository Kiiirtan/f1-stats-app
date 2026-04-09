import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ui/ErrorBoundary';
import PageTransition from './components/ui/PageTransition';
import CursorGlow from './components/ui/CursorGlow';
import SmoothLoader from './components/ui/SmoothLoader';
import Layout from './components/layout/Layout';

// Lazy loaded routes for code-splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const News = lazy(() => import('./pages/News'));
const Drivers = lazy(() => import('./pages/Drivers'));
const DriverProfile = lazy(() => import('./pages/DriverProfile'));
const SeasonCalendar = lazy(() => import('./pages/SeasonCalendar'));
const Circuits = lazy(() => import('./pages/Circuits'));
const CircuitProfile = lazy(() => import('./pages/CircuitProfile'));
const Races = lazy(() => import('./pages/Races'));
const Archives = lazy(() => import('./pages/Archives'));
const Results = lazy(() => import('./pages/Results'));
const Constructors = lazy(() => import('./pages/Constructors'));
const ConstructorProfile = lazy(() => import('./pages/ConstructorProfile'));
const ConstructorSeasonDetails = lazy(() => import('./pages/ConstructorSeasonDetails'));
const Settings = lazy(() => import('./pages/Settings'));
const Contact = lazy(() => import('./pages/Contact'));
const Credits = lazy(() => import('./pages/Credits'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Cookies = lazy(() => import('./pages/Cookies'));
const NotFound = lazy(() => import('./pages/NotFound'));

function RouteFallback() {
  return (
    <div className="pt-24 min-h-[80vh] flex justify-center items-center w-full">
      <div className="w-16 h-1 bg-primary-container animate-pulse rounded-full" />
    </div>
  );
}

function InitialRedirect() {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!sessionStorage.getItem('app_initialized')) {
      sessionStorage.setItem('app_initialized', 'true');
      if (location.pathname === '/' && settings.defaultPage !== '/') {
        navigate(settings.defaultPage, { replace: true });
      }
    }
  }, [settings.defaultPage, navigate, location.pathname]);

  return null;
}

function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <ErrorBoundary>
          <SmoothLoader />
          <CursorGlow />
          <Router>
          <InitialRedirect />
          <Layout>
            <PageTransition>
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/drivers" element={<Drivers />} />
                  <Route path="/driver/:id" element={<DriverProfile />} />
                  <Route path="/calendar" element={<SeasonCalendar />} />
                  <Route path="/circuits" element={<Circuits />} />
                  <Route path="/circuit/:id" element={<CircuitProfile />} />
                  <Route path="/races" element={<Races />} />
                  <Route path="/archives" element={<Archives />} />
                  <Route path="/results" element={<Results />} />
                  <Route path="/constructors" element={<Constructors />} />
                  <Route path="/constructor/:id" element={<ConstructorProfile />} />
                  <Route path="/constructor/:id/season/:year" element={<ConstructorSeasonDetails />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/credits" element={<Credits />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/cookies" element={<Cookies />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </PageTransition>
          </Layout>
          </Router>
        </ErrorBoundary>
      </AuthProvider>
    </SettingsProvider>
  );
}

export default App;
