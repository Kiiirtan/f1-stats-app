import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import ErrorBoundary from './components/ui/ErrorBoundary';
import PageTransition from './components/ui/PageTransition';
import CursorGlow from './components/ui/CursorGlow';
import SmoothLoader from './components/ui/SmoothLoader';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import News from './pages/News';
import Drivers from './pages/Drivers';
import DriverProfile from './pages/DriverProfile';
import Races from './pages/Races';
import Results from './pages/Results';
import Constructors from './pages/Constructors';
import ConstructorProfile from './pages/ConstructorProfile';
import ConstructorSeasonDetails from './pages/ConstructorSeasonDetails';
import Settings from './pages/Settings';
import Contact from './pages/Contact';
import Credits from './pages/Credits';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';
import NotFound from './pages/NotFound';

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
      <ErrorBoundary>
        <SmoothLoader />
        <CursorGlow />
        <Router>
          <InitialRedirect />
          <Layout>
            <PageTransition>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/news" element={<News />} />
                <Route path="/drivers" element={<Drivers />} />
                <Route path="/driver/:id" element={<DriverProfile />} />
                <Route path="/races" element={<Races />} />
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
            </PageTransition>
          </Layout>
        </Router>
      </ErrorBoundary>
    </SettingsProvider>
  );
}

export default App;
