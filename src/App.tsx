import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Navigate, Route, useLocation } from 'react-router';
import { Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react"

import { queryClientConfig } from '@/config/queryClient'
import { SentryRoutes } from '@/lib/sentry/routes';

import Start from '@/pages/start';
import Create from '@/pages/create';
import Home from '@/pages/home';
import Playlist from '@/pages/playlist';
import Error from '@/pages/error';
import Offline from '@/pages/offline';
import NotFound from '@/pages/notFound';
import Test from '@/pages/test';
import Loading from '@/pages/loading';
import StartGuest from '@/pages/startGuest';
import ErrorBoundary from '@/error/errorBoundary';
import { PlaylistProvider } from './providers/PlaylistProvider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient(queryClientConfig);

function App() {

  const location = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <Analytics />
      <SpeedInsights />
      <ErrorBoundary key={location.key}>
        <Suspense fallback={<Loading isLoading={true} />}>
          <SentryRoutes>
            <Route path="/" element={<Navigate to="/start" replace />} />
            <Route path="/start" element={<Start />} />
            <Route path="/start/:playlistCode" element={<StartGuest />} />
            <Route path="/create" element={<Create />} />
            <Route path="/home" element={<Home />} />
            <Route path="/playlist" element={
              <PlaylistProvider>
                <Playlist />
              </PlaylistProvider>
            } />
            <Route path="/error" element={<Error />} />
            <Route path="/error/:code" element={<Error />} />
            <Route path="/offline" element={<Offline />} />
            <Route path="/test" element={<Test />} />
            <Route path="*" element={<NotFound />} />
          </SentryRoutes>
        </Suspense>
      </ErrorBoundary>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={true} />}
    </QueryClientProvider >
  )
}

export default App
