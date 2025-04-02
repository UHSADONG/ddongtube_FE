import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Navigate, Route, useLocation } from 'react-router';
import { Suspense } from 'react';

import { queryClientConfig } from './config/queryClient'
import { SentryRoutes } from './sentry/routes';

import Start from './pages/start';
import Create from './pages/create';
import Home from './pages/home';
import Playlist from './pages/playlist';
import Error from './pages/error';
import Offline from './pages/offline';
import NotFound from './pages/notFound';
import Test from './pages/test';
import Loading from './pages/loading';
import StartGuest from './pages/startGuest';

const queryClient = new QueryClient(queryClientConfig);

function App() {

  const location = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense key={location.pathname} fallback={<Loading isLoading={true} />}>
        <SentryRoutes>
          <Route path="/" element={<Navigate to="/start" replace />} />
          <Route path="/start" element={<Start />} />
          <Route path="/start/:playlistCode" element={<StartGuest />} />
          <Route path="/create" element={<Create />} />
          <Route path="/home" element={<Home />} />
          <Route path="/playlist" element={<Playlist />} />
          <Route path="/error" element={<Error />} />
          <Route path="/error/:code" element={<Error />} />
          <Route path="/offline" element={<Offline />} />
          <Route path="/test" element={<Test />} />
          <Route path="*" element={<NotFound />} />
        </SentryRoutes>
      </Suspense>
    </QueryClientProvider >
  )
}

export default App
