import { type ReactNode } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { SplashScreen } from './components/SplashScreen';

// Pages
import HomePage from './pages/HomePage';
import CarsPage from './pages/CarsPage';
import ContactPage from './pages/ContactPage';
import PodminkyPage from './pages/PodminkyPage';
import ZasadyPage from './pages/ZasadyPage';
import AdminPage from './pages/AdminPage';

const queryClient = new QueryClient();

function Router() {
  const [location] = useLocation();
  const isAdmin = location.startsWith('/admin');

  if (isAdmin) {
    return (
      <>
        <ScrollToTop />
        <RoutedErrorBoundary>
          <AdminPage />
        </RoutedErrorBoundary>
      </>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full bg-background text-foreground flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 flex flex-col">
        <RoutedErrorBoundary>
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/vozy" component={CarsPage} />
            <Route path="/kontakt" component={ContactPage} />
            <Route path="/podminky" component={PodminkyPage} />
            <Route path="/zasady-soukromi" component={ZasadyPage} />
            <Route path="/admin" component={AdminPage} />
            <Route component={NotFound} />
          </Switch>
        </RoutedErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <SplashScreen />
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
