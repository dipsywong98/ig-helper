import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import React from 'react';
import App from './App';
import { IgSessionContextProvider } from './IgSessionContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
});

const container = document.getElementById('root');
if (container !== null) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <IgSessionContextProvider>
          <App />
        </IgSessionContextProvider>
      </QueryClientProvider>
    </React.StrictMode>,
  );
}
